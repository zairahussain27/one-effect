import type { ScanResult } from '../types';

export const MOCK_SCANS: ScanResult[] = [
  {
    label: 'PET bottle',
    item: 'PET Bottle',
    material: 'PET plastic',
    category: 'Waste',
    confidence: 96,
    recommendedAction: 'Recycle in dedicated plastic bin',
    actionId: 'recycle-bottle',
    verified: true,
    source: 'mock'
  },
  {
    label: 'Running tap',
    item: 'Running Water / Tap',
    material: 'Clean Water',
    category: 'Water',
    confidence: 92,
    recommendedAction: 'Turn off tap when not in active use',
    actionId: 'save-water',
    verified: true,
    source: 'mock'
  },
  {
    label: 'Light bulb / Appliance',
    item: 'Light Fixture / Appliance',
    material: 'Electronics Power Draw',
    category: 'Energy',
    confidence: 89,
    recommendedAction: 'Switch off idle electronics',
    actionId: 'save-energy',
    verified: true,
    source: 'mock'
  },
  {
    label: 'Bicycle / Commute',
    item: 'Bicycle / Transit',
    material: 'Zero-Emission Commute',
    category: 'Transport',
    confidence: 96,
    recommendedAction: 'Ride bike or walk instead of driving',
    actionId: 'low-carbon-trip',
    verified: true,
    source: 'mock'
  },
  {
    label: 'Young tree / Plant',
    item: 'Urban Flora / Green Space',
    material: 'Native Soil & Plant',
    category: 'Nature',
    confidence: 91,
    recommendedAction: 'Care for green space and pollinators',
    actionId: 'protect-green-space',
    verified: true,
    source: 'mock'
  }
];

export const MOCK_DICTIONARY: Record<string, Partial<ScanResult>> = {
  bottle: {
    label: 'PET Bottle',
    item: 'PET Bottle',
    material: 'PET plastic',
    category: 'Waste',
    confidence: 96,
    recommendedAction: 'Recycle',
    actionId: 'recycle-bottle'
  },
  can: {
    label: 'Aluminum Can',
    item: 'Aluminum Can',
    material: 'Recyclable Aluminum',
    category: 'Waste',
    confidence: 91,
    recommendedAction: 'Recycle',
    actionId: 'recycle-bottle'
  },
  plastic: {
    label: 'Plastic Container',
    item: 'Plastic Container',
    material: 'HDPE / PET Plastic',
    category: 'Waste',
    confidence: 92,
    recommendedAction: 'Recycle',
    actionId: 'recycle-bottle'
  },
  cup: {
    label: 'Disposable Cup',
    item: 'Disposable Cup',
    material: 'Paper / Plastic lining',
    category: 'Waste',
    confidence: 89,
    recommendedAction: 'Recycle or replace with reusable cup',
    actionId: 'recycle-bottle'
  },
  paper: {
    label: 'Paper/Cardboard',
    item: 'Cardboard Box',
    material: 'Corrugated Paper',
    category: 'Waste',
    confidence: 89,
    recommendedAction: 'Recycle',
    actionId: 'recycle-bottle'
  },
  water: {
    label: 'Running Water / Tap',
    item: 'Running Water / Tap',
    material: 'Clean Water',
    category: 'Water',
    confidence: 92,
    recommendedAction: 'Save water & fix drips',
    actionId: 'save-water'
  },
  tap: {
    label: 'Faucet / Sink',
    item: 'Faucet / Sink',
    material: 'Water Fixture',
    category: 'Water',
    confidence: 93,
    recommendedAction: 'Turn off tap while brushing/washing',
    actionId: 'save-water'
  },
  light: {
    label: 'Light Bulb / Fixture',
    item: 'Light Bulb / Fixture',
    material: 'Lighting Power',
    category: 'Energy',
    confidence: 89,
    recommendedAction: 'Switch off when leaving room',
    actionId: 'save-energy'
  },
  bulb: {
    label: 'Incandescent / LED Bulb',
    item: 'LED Bulb',
    material: 'Lighting Power',
    category: 'Energy',
    confidence: 90,
    recommendedAction: 'Switch off unused lighting',
    actionId: 'save-energy'
  },
  lamp: {
    label: 'Desk Lamp',
    item: 'Desk Lamp',
    material: 'Plugged Appliance',
    category: 'Energy',
    confidence: 87,
    recommendedAction: 'Power down when not in use',
    actionId: 'save-energy'
  },
  bike: {
    label: 'Bicycle',
    item: 'Bicycle',
    material: 'Human-Powered Vehicle',
    category: 'Transport',
    confidence: 96,
    recommendedAction: 'Choose a low-carbon trip',
    actionId: 'low-carbon-trip'
  },
  bicycle: {
    label: 'Bicycle / Cycling',
    item: 'Bicycle / Cycling',
    material: 'Human-Powered Vehicle',
    category: 'Transport',
    confidence: 97,
    recommendedAction: 'Ride instead of driving for short trips',
    actionId: 'low-carbon-trip'
  },
  car: {
    label: 'Passenger Vehicle',
    item: 'Passenger Vehicle',
    material: 'Motor Transit',
    category: 'Transport',
    confidence: 86,
    recommendedAction: 'Switch one trip to cycling or transit',
    actionId: 'low-carbon-trip'
  },
  plant: {
    label: 'Potted Plant / Garden',
    item: 'Potted Plant / Garden',
    material: 'Flora & Soil',
    category: 'Nature',
    confidence: 93,
    recommendedAction: 'Nurture native plants and soil',
    actionId: 'protect-green-space'
  },
  tree: {
    label: 'Urban Tree / Flora',
    item: 'Urban Tree / Flora',
    material: 'Urban Canopy',
    category: 'Nature',
    confidence: 95,
    recommendedAction: 'Protect urban canopy & greenspace',
    actionId: 'protect-green-space'
  },
  leaf: {
    label: 'Foliage / Green Space',
    item: 'Foliage / Green Space',
    material: 'Urban Flora',
    category: 'Nature',
    confidence: 91,
    recommendedAction: 'Support local biodiversity',
    actionId: 'protect-green-space'
  },
  default: {
    label: 'Recyclable Material',
    item: 'Recyclable Material',
    material: 'Recyclable Resource',
    category: 'Waste',
    confidence: 82,
    recommendedAction: 'Check local recycling guidelines',
    actionId: 'recycle-bottle'
  }
};

let scanCounter = 0;

export function getMockResultForFile(file?: File): ScanResult {
  if (!file) {
    const item = MOCK_SCANS[scanCounter % MOCK_SCANS.length];
    scanCounter++;
    return { ...item, source: 'mock', verified: true };
  }

  const name = file.name.toLowerCase();
  for (const [key, value] of Object.entries(MOCK_DICTIONARY)) {
    if (key !== 'default' && name.includes(key)) {
      return {
        label: value.label || 'PET Bottle',
        item: value.item || 'PET Bottle',
        material: value.material || 'PET plastic',
        category: (value.category as any) || 'Waste',
        confidence: value.confidence || 90,
        recommendedAction: value.recommendedAction || 'Recycle',
        actionId: value.actionId || 'recycle-bottle',
        verified: true,
        source: 'mock'
      };
    }
  }

  // Next cycled fallback
  const fallbackItem = MOCK_SCANS[scanCounter % MOCK_SCANS.length];
  scanCounter++;
  return {
    ...fallbackItem,
    source: 'mock',
    verified: true
  };
}
