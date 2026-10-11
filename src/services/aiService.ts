import { sendImageToBackend } from './api';
import type { ScanResult } from '../types';
import { normalizeActionId } from '../data/actions';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeImage(file?: File, targetActionId?: string): Promise<ScanResult> {
  const minAnalysisDuration = delay(1200);

  if (!file) {
    throw new Error('Please upload an image before starting analysis.');
  }

  const [awsResult] = await Promise.all([
    sendImageToBackend(file),
    minAnalysisDuration
  ]);

  const isMatch = targetActionId
    ? normalizeActionId(targetActionId) === normalizeActionId(awsResult.actionId)
    : true;

  return {
    ...awsResult,
    verified: isMatch,
    source: 'aws'
  };
}
