import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ACTIONS, getActionById, normalizeActionId } from '../data/actions';
import { DEFAULT_SIM } from '../data/impactFactors';
import { analyzeImage } from '../services/aiService';
import { calculate } from '../utils/calculator';
import * as actionService from '../services/actionService';
import { calculateImpact, buildImpactSnapshot } from '../services/impactEngine';
import type {
  Action,
  Frequency,
  ScanResult,
  SimResult,
  SimState,
  UserActionRecord,
  EnvironmentalContribution,
  ImpactCalculationResult,
  ImpactMetricResult
} from '../types';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

interface ImpactContextType {
  // Image / scan state
  uploadedImage: string | null;
  imageFile: File | null;
  fileName: string | null;
  selectedActionId: string;
  selectedAction: Action;
  scanState: 'idle' | 'busy' | 'done' | 'error';
  scanError: string | null;
  scanResult: ScanResult | null;

  // User input (quantity + metadata from dynamic form)
  quantity: number | null;
  unit: string;
  actionMetadata: Record<string, string | number | boolean>;
  pendingImpactResult: ImpactCalculationResult | null;

  // History
  history: UserActionRecord[];
  contributions: EnvironmentalContribution[];
  stats: actionService.UserStats;

  // Simulator
  sim: SimState;
  simResult: SimResult;

  // Save state
  isCurrentActionSaved: boolean;

  // Actions
  handleFileUpload: (file: File, targetActionId?: string) => Promise<ScanResult | null>;
  startAnalysis: (targetActionId?: string) => Promise<ScanResult | null>;
  setQuantity: (q: number) => void;
  setActionMetadata: (meta: Record<string, string | number | boolean>) => void;
  calculateAndPreview: (
    overrideQty?: number,
    overrideMeta?: Record<string, string | number | boolean>,
    overrideActionId?: string
  ) => ImpactCalculationResult | null;
  saveCurrentActionToJourney: (userId?: string) => Promise<UserActionRecord | null>;
  setSelectedActionId: (id: string) => void;
  setPeople: (people: number) => void;
  setFrequency: (frequency: Frequency) => void;
  setMonths: (months: number) => void;
  resetImage: () => void;
  resetSession: () => void;
  clearError: () => void;
  refreshHistory: () => Promise<void>;
}

const ImpactContext = createContext<ImpactContextType | undefined>(undefined);

export const ImpactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── Action selection ──────────────────────────────────────────────────────
  const [selectedActionId, setSelectedActionIdState] = useState<string>(() => {
    try {
      return localStorage.getItem('one_effect_action') || 'recycle-material';
    } catch {
      return 'recycle-material';
    }
  });

  // ── Simulator ─────────────────────────────────────────────────────────────
  const [sim, setSimState] = useState<SimState>(() => {
    try {
      const saved = localStorage.getItem('one_effect_sim');
      return saved ? JSON.parse(saved) : DEFAULT_SIM;
    } catch {
      return DEFAULT_SIM;
    }
  });

  // ── Image / Scan ──────────────────────────────────────────────────────────
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [scanState, setScanState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const [scanError, setScanError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isCurrentActionSaved, setIsCurrentActionSaved] = useState<boolean>(false);

  // ── Dynamic input state ───────────────────────────────────────────────────
  const [quantity, setQuantityState] = useState<number | null>(null);
  const [unit, setUnit] = useState<string>('');
  const [actionMetadata, setActionMetadataState] = useState<Record<string, string | number | boolean>>({});
  const [pendingImpactResult, setPendingImpactResult] = useState<ImpactCalculationResult | null>(null);

  // ── User contributions ────────────────────────────────────────────────────
  const [contributions, setContributions] = useState<EnvironmentalContribution[]>([]);
  const [history, setHistory] = useState<UserActionRecord[]>([]);

  useEffect(() => {
    actionService.getUserContributions().then((cs) => {
      setContributions(cs);
      setHistory(cs.map(actionService.contributionToRecord));
    });
  }, []);

  const refreshHistory = async () => {
    const cs = await actionService.getUserContributions();
    setContributions(cs);
    setHistory(cs.map(actionService.contributionToRecord));
  };

  // ── Compute stats from contributions ──────────────────────────────────────
  const stats = useMemo(() => {
    return actionService.computeStatsFromContributions(contributions);
  }, [contributions]);

  // ── Persist selections ────────────────────────────────────────────────────
  useEffect(() => {
    try { localStorage.setItem('one_effect_action', selectedActionId); } catch {}
  }, [selectedActionId]);

  useEffect(() => {
    try { localStorage.setItem('one_effect_sim', JSON.stringify(sim)); } catch {}
  }, [sim]);

  const selectedAction = useMemo(() => getActionById(selectedActionId), [selectedActionId]);

  const simResult = useMemo(() => calculate(sim, selectedActionId), [sim, selectedActionId]);

  // ── Setters ───────────────────────────────────────────────────────────────
  const setSelectedActionId = (id: string) => {
    const normalized = normalizeActionId(id);
    setSelectedActionIdState(normalized);
    // Reset input when action changes
    setQuantityState(null);
    setActionMetadataState({});
    setPendingImpactResult(null);
    setIsCurrentActionSaved(false);
  };

  const setQuantity = (q: number) => {
    setQuantityState(q);
  };

  const setActionMetadata = (meta: Record<string, string | number | boolean>) => {
    setActionMetadataState((prev) => ({ ...prev, ...meta }));
  };

  const setPeople = (people: number) =>
    setSimState((prev) => ({ ...prev, people: Math.max(1, Math.round(people)) }));

  const setFrequency = (frequency: Frequency) =>
    setSimState((prev) => ({ ...prev, frequency }));

  const setMonths = (months: number) =>
    setSimState((prev) => ({ ...prev, months }));

  const clearError = () => {
    setScanError(null);
    if (scanState === 'error') setScanState('idle');
  };

  const resetImage = () => {
    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    setUploadedImage(null);
    setImageFile(null);
    setFileName(null);
    setScanState('idle');
    setScanError(null);
    setScanResult(null);
    setIsCurrentActionSaved(false);
  };

  const resetSession = () => {
    resetImage();
    setSelectedActionIdState('recycle-material');
    setQuantityState(null);
    setActionMetadataState({});
    setPendingImpactResult(null);
  };

  // ── Calculate impact preview ──────────────────────────────────────────────
  const calculateAndPreview = (
    overrideQty?: number,
    overrideMeta?: Record<string, string | number | boolean>,
    overrideActionId?: string
  ): ImpactCalculationResult | null => {
    const act = overrideActionId ? getActionById(overrideActionId) : selectedAction;
    const q = overrideQty !== undefined ? overrideQty : quantity;
    const m = overrideMeta !== undefined ? overrideMeta : actionMetadata;
    if (q === null || q <= 0) return null;

    const result = calculateImpact({
      action: act,
      quantity: q,
      metadata: m
    });

    setPendingImpactResult(result);
    return result;
  };

  // ── File upload ───────────────────────────────────────────────────────────
  const handleFileUpload = async (file: File, targetActionId?: string): Promise<ScanResult | null> => {
    clearError();
    if (!file) return null;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setScanError('Image is too large. Please upload an image under 10 MB.');
      setScanState('error');
      return null;
    }

    const isValidType =
      SUPPORTED_MIME_TYPES.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);

    if (!isValidType) {
      setScanError('Please upload a valid image file (JPG, PNG, or WEBP).');
      setScanState('error');
      return null;
    }

    if (uploadedImage && uploadedImage.startsWith('blob:')) {
      URL.revokeObjectURL(uploadedImage);
    }
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    setImageFile(file);
    setFileName(file.name);
    setScanState('idle');
    setIsCurrentActionSaved(false);

    if (targetActionId) {
      setSelectedActionIdState(normalizeActionId(targetActionId));
    }

    return null;
  };

  // ── AI analysis ───────────────────────────────────────────────────────────
  const startAnalysis = async (targetActionId?: string): Promise<ScanResult | null> => {
    const actionToVerify = targetActionId || selectedActionId;
    clearError();
    setScanState('busy');

    try {
      const result = await analyzeImage(imageFile || undefined, actionToVerify);
      setScanResult(result);
      setSelectedActionIdState(result.actionId);
      setScanState('done');
      return result;
    } catch (err) {
      console.error('Analysis error:', err);
      setScanError("We couldn't confidently identify this item. You can choose an action manually.");
      setScanState('error');
      return null;
    }
  };

  // ── Save contribution ─────────────────────────────────────────────────────
  const saveCurrentActionToJourney = async (userId = 'anonymous'): Promise<UserActionRecord | null> => {
    if (isCurrentActionSaved) return null;

    const action = selectedAction;
    const result = scanResult;

    // Require quantity
    const qty = quantity ?? 1;

    // Determine unit from action schema primary field
    const primaryField = action.inputSchema.find((f) => f.id === 'quantity');
    const u = unit || primaryField?.unit || 'action';

    // Build metadata including material from scan result if available
    const meta: Record<string, string | number | boolean> = {
      ...actionMetadata
    };
    if (result?.material && !meta.material) {
      // Map AI material to our material key
      const aiMaterial = result.material.toLowerCase();
      if (aiMaterial.includes('pet') || aiMaterial.includes('plastic')) meta.material = 'PET';
      else if (aiMaterial.includes('alum')) meta.material = 'Aluminum';
      else if (aiMaterial.includes('glass')) meta.material = 'Glass';
      else if (aiMaterial.includes('paper') || aiMaterial.includes('cardboard')) meta.material = 'Paper';
      else meta.material = 'PET'; // default
    }

    // Calculate impact using the engine
    const impactResult = calculateImpact({ action, quantity: qty, metadata: meta });
    const impactSnapshot = buildImpactSnapshot(impactResult);

    const contribution: Omit<EnvironmentalContribution, 'id' | 'createdAt'> = {
      userId,
      actionId: action.id,
      actionName: action.name,
      category: action.category,
      quantity: qty,
      unit: u,
      metadata: meta,
      verified: true,
      confidence: result?.confidence
        ? (result.confidence > 1 ? result.confidence / 100 : result.confidence)
        : 0.96,
      detectedItem: result?.item || result?.label || action.name,
      impact: impactSnapshot,
      factorId: action.factorId,
      imageUrl: uploadedImage || undefined,
      metricsSnapshot: impactResult.metrics
    };

    const saved = await actionService.saveContribution(contribution);
    setIsCurrentActionSaved(true);
    setPendingImpactResult(impactResult);
    await refreshHistory();

    return actionService.contributionToRecord(saved);
  };

  return (
    <ImpactContext.Provider
      value={{
        uploadedImage,
        imageFile,
        fileName,
        selectedActionId,
        selectedAction,
        scanState,
        scanError,
        scanResult,
        quantity,
        unit,
        actionMetadata,
        pendingImpactResult,
        history,
        contributions,
        stats,
        sim,
        simResult,
        isCurrentActionSaved,
        handleFileUpload,
        startAnalysis,
        setQuantity,
        setActionMetadata,
        calculateAndPreview,
        saveCurrentActionToJourney,
        setSelectedActionId,
        setPeople,
        setFrequency,
        setMonths,
        resetImage,
        resetSession,
        clearError,
        refreshHistory
      }}
    >
      {children}
    </ImpactContext.Provider>
  );
};

export const useImpact = (): ImpactContextType => {
  const ctx = useContext(ImpactContext);
  if (!ctx) throw new Error('useImpact must be used within an ImpactProvider');
  return ctx;
};
