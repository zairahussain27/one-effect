import type { AnalysisResult } from '../types';

export const FALLBACK_RESULTS: Record<string, AnalysisResult> = {
  bottle: {
    item: 'PET Bottle',
    category: 'Waste',
    confidence: 0.94,
    recommendedAction: 'Recycle in dedicated plastic bin',
    actionId: 'bottle'
  },
  water: {
    item: 'Running Tap / Water',
    category: 'Water',
    confidence: 0.91,
    recommendedAction: 'Turn off tap when not in active use',
    actionId: 'water'
  },
  energy: {
    item: 'Light / Electronic Appliance',
    category: 'Energy',
    confidence: 0.88,
    recommendedAction: 'Switch off and unplug idle devices',
    actionId: 'energy'
  },
  transport: {
    item: 'Bicycle / Commute',
    category: 'Transport',
    confidence: 0.96,
    recommendedAction: 'Choose walking, cycling or public transit',
    actionId: 'transport'
  },
  nature: {
    item: 'Plant / Green Space',
    category: 'Nature',
    confidence: 0.89,
    recommendedAction: 'Care for green space and native plants',
    actionId: 'nature'
  },
  default: {
    item: 'Recyclable Material',
    category: 'Waste',
    confidence: 0.82,
    recommendedAction: 'Check local recycling and conservation guidelines',
    actionId: 'bottle'
  }
};

export function getFallbackResult(filename?: string): AnalysisResult {
  if (!filename) return FALLBACK_RESULTS.bottle;
  const name = filename.toLowerCase();
  for (const [key, val] of Object.entries(FALLBACK_RESULTS)) {
    if (key !== 'default' && name.includes(key)) {
      return val;
    }
  }
  return FALLBACK_RESULTS.default;
}
