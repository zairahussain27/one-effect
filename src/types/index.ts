export type Frequency = 'once' | 'weekly' | 'monthly' | 'daily';
export type ActionCategory = 'Waste' | 'Water' | 'Energy' | 'Transport' | 'Nature';
export type RecyclingMaterial = 'PET' | 'Aluminum' | 'Glass' | 'HDPE' | 'Corrugated' | 'Steel' | 'Paper' | 'EWaste' | 'Other';
export type TransportMode = 'walk' | 'cycle' | 'bus' | 'metro' | 'motorcycle' | 'auto' | 'car' | 'ev';

// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  firstName?: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// ─── Action Definition ───────────────────────────────────────────────────────
export type InputFieldType = 'number' | 'select' | 'radio' | 'text' | 'toggle';

export interface InputField {
  id: string;
  label: string;
  type: InputFieldType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string; icon?: string }[];
  optional?: boolean;
  helpText?: string;
}

export interface Action {
  id: string;
  name: string;
  sentence: string;
  category: ActionCategory;
  icon: string;
  blurb: string;
  description?: string;
  recommendedAction?: string;
  materialPrompt?: string;
  /** Primary factor ID to use for calculation */
  factorId: string;
  /** Input schema — drives the dynamic form */
  inputSchema: InputField[];
  /** Which impact metric keys this action can produce */
  availableMetrics: ImpactMetricType[];
  verificationType: 'image' | 'manual' | 'both';
}

// ─── Environmental Factor Database ──────────────────────────────────────────
export interface EnvironmentalFactor {
  id: string;
  name: string;
  source: string;
  sourceUrl: string;
  publicationYear: number;
  version?: string;
  geography?: string;
  methodology: string;
  factor: number;
  unit: string;
  uncertainty?: string;
  notes?: string;
  confidence: 'measured' | 'modelled' | 'estimated';
}

// ─── Impact Engine ───────────────────────────────────────────────────────────
export type ImpactMetricType =
  | 'wasteDiverted'
  | 'wasteDivertedKg'
  | 'co2eAvoided'
  | 'energySaved'
  | 'waterSaved'
  | 'distanceShifted'
  | 'treesPlanted'
  | 'areaRestored';

export interface ImpactMetricResult {
  type: ImpactMetricType;
  value: number;
  unit: string;
  label: string;
  description?: string;
  /** If null/undefined, no factor applied (e.g. water without energy data) */
  factorId?: string;
  factorValue?: number;
  factorUnit?: string;
  factorSource?: string;
  factorVersion?: string;
  methodologyNote?: string;
  confidenceLevel?: 'measured' | 'modelled' | 'estimated';
}

export interface ImpactCalculationResult {
  metrics: ImpactMetricResult[];
  /** Human-readable methodology steps for the "How was this calculated?" panel */
  methodology: MethodologyStep[];
  /** Any caveats or scientific notes to show the user */
  caveats?: string[];
}

export interface MethodologyStep {
  label: string;
  value: string;
  note?: string;
}

// ─── User Contribution Record (persisted) ───────────────────────────────────
export interface EnvironmentalContribution {
  id: string;
  userId: string;

  actionId: string;
  actionName: string;
  category: ActionCategory;

  /** The primary user input (e.g. grams, litres, kWh, km) */
  quantity: number;
  unit: string;

  /** Any additional metadata captured in the form (material, mode, occupancy etc.) */
  metadata: Record<string, string | number | boolean>;

  verified: boolean;
  confidence?: number;
  detectedItem?: string;

  /** Full impact calculation result — frozen at time of submission */
  impact: {
    wasteDivertedKg?: number;
    waterSavedLitres?: number;
    electricitySavedKwh?: number;
    co2eAvoidedKg?: number;
    distanceShiftedKm?: number;
    treesPlanted?: number;
    areaRestoredM2?: number;
  };

  /** Reproducibility — which factor version was used */
  factorId?: string;
  factorVersion?: string;
  factorValue?: number;

  imageUrl?: string;
  createdAt: string;
  dateLabel?: string;

  /** Full metrics array preserved for display in history */
  metricsSnapshot?: ImpactMetricResult[];
}

/** Legacy type — kept for backward compat with existing history records */
export interface UserActionRecord {
  id: string;
  userId: string;
  actionId: string;
  actionName: string;
  category: ActionCategory;
  imageUrl?: string;
  detectedItem: string;
  material?: string;
  confidence: number;
  impactValue: number;
  impactUnit?: string;
  verified: boolean;
  createdAt: string;
  dateLabel?: string;
  /** Optional rich fields when converting from EnvironmentalContribution */
  quantity?: number;
  unit?: string;
  metadata?: Record<string, string | number | boolean>;
  metricsSnapshot?: ImpactMetricResult[];
}

// ─── Aggregated Stats ────────────────────────────────────────────────────────
export interface UserStats {
  totalActions: number;
  wasteActions: number;
  waterActions: number;
  energyActions: number;
  transportActions: number;
  natureActions: number;
  // Aggregated impact totals
  totalWasteDivertedKg: number;
  totalWaterSavedL: number;
  totalEnergySavedKwh: number;
  totalCo2eAvoidedKg: number;
  totalDistanceShiftedKm: number;
  totalTreesPlanted: number;
  totalAreaRestoredM2: number;
}

// ─── Legacy Sim types ────────────────────────────────────────────────────────
export interface ImpactMetric {
  label: string;
  unit: string;
  value: number;
  dp: number;
}

export interface SimState {
  people: number;
  frequency: Frequency;
  months: number;
}

export interface SimResult {
  people: number;
  periods: number;
  periodUnit: string;
  totalActions: number;
  metrics: ImpactMetric[];
}

export interface ScanResult {
  label: string;
  item: string;
  category: ActionCategory;
  material?: string;
  confidence: number;
  recommendedAction: string;
  actionId: string;
  verified: boolean;
  source: 'mock' | 'aws' | 'demo' | 'fallback';
  rawResponse?: unknown;
}

export interface ImpactSession {
  imageFile?: File | null;
  imagePreview?: string | null;
  fileName?: string | null;
  selectedActionId: string;
  scanState: 'idle' | 'busy' | 'done' | 'error';
  scanError?: string | null;
  scanResult?: ScanResult | null;
  isSaved?: boolean;
}
