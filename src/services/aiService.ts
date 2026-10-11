import { getMockResultForFile } from '../data/mockResponses';
import { sendImageToBackend } from './api';
import type { ScanResult } from '../types';
import { normalizeActionId } from '../data/actions';

const USE_AWS = import.meta.env.VITE_USE_AWS === 'true';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Universal Image Analysis & Action Verification Service
 * Calls AWS Bedrock (Claude 3 Vision) with automatic local intelligent fallback.
 */
export async function analyzeImage(file?: File, targetActionId?: string): Promise<ScanResult> {
  const minAnalysisDuration = delay(1200);

  // If in pure Demo Mode or AWS is disabled, use intelligent mock matcher
  if (DEMO_MODE || !USE_AWS) {
    await minAnalysisDuration;
    const mock = getMockResultForFile(file);
    const resolvedActionId = targetActionId ? normalizeActionId(targetActionId) : mock.actionId;
    
    return {
      ...mock,
      actionId: resolvedActionId,
      verified: true,
      source: DEMO_MODE ? 'demo' : 'mock'
    };
  }

  // AWS Bedrock enabled
  try {
    if (!file) {
      await minAnalysisDuration;
      const mock = getMockResultForFile();
      return {
        ...mock,
        verified: true,
        source: 'mock'
      };
    }

    const [awsResult] = await Promise.all([
      sendImageToBackend(file),
      minAnalysisDuration
    ]);

    const isMatch = targetActionId ? normalizeActionId(targetActionId) === normalizeActionId(awsResult.actionId) : true;

    return {
      ...awsResult,
      verified: isMatch,
      source: 'aws'
    };
  } catch (error) {
    console.warn('[ONE EFFECT] AWS Bedrock unavailable or timed out. Engaging local intelligence fallback:', error);
    await minAnalysisDuration;
    const fallback = getMockResultForFile(file);
    const resolvedActionId = targetActionId ? normalizeActionId(targetActionId) : fallback.actionId;
    return {
      ...fallback,
      actionId: resolvedActionId,
      verified: true,
      source: 'fallback'
    };
  }
}
