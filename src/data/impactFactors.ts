import type { Frequency, SimState } from '../types';
import { normalizeActionId } from './actions';

export interface ActionFactor {
  label: string;
  unit: string;
  per: number;
}

/**
 * Simulator impact factors — used by the collective What-If simulator only.
 * These are illustrative per-action multipliers for the simulator view.
 * Actual research-based calculations are in src/services/impactEngine.ts
 */
export const ACTION_FACTORS: Record<string, ActionFactor[]> = {
  // New IDs
  'recycle-material': [
    { label: 'MATERIAL DIVERTED', unit: 'kg', per: 0.025 },
    { label: 'EST. MODELED CO₂ REDUCTION', unit: 'kg CO₂e', per: 0.000029 },
    { label: 'EST. ENERGY SAVINGS', unit: 'kWh', per: 0.00093 }
  ],
  'save-water': [
    { label: 'WATER CONSERVED', unit: 'litres', per: 20 },
    { label: 'SHOWERS EQUIVALENT', unit: '', per: 0.4 }
  ],
  'save-electricity': [
    { label: 'ELECTRICITY SAVED', unit: 'kWh', per: 1.5 },
    { label: 'EST. CO₂ AVOIDED', unit: 'kg CO₂', per: 1.065 }
  ],
  'low-carbon-trip': [
    { label: 'DISTANCE SHIFTED', unit: 'km', per: 8 },
    { label: 'EST. OPERATIONAL CO₂ AVOIDED', unit: 'kg CO₂', per: 1.144 }
  ],
  'plant-tree': [
    { label: 'TREES PLANTED', unit: 'trees', per: 1 },
    { label: 'GREEN AREA', unit: 'm²', per: 4 }
  ],
  'restore-green-space': [
    { label: 'GREEN SPACE RESTORED', unit: 'm²', per: 10 }
  ],
  'compost-food': [
    { label: 'ORGANIC WASTE DIVERTED', unit: 'kg', per: 1.5 },
    { label: 'EST. METHANE AVOIDED', unit: 'kg CO₂e', per: 0.000315 }
  ],
  // Legacy IDs kept for backward compat with old sim state in localStorage
  'recycle-bottle': [
    { label: 'MATERIAL DIVERTED', unit: 'kg', per: 0.025 },
    { label: 'CO₂ EQUIVALENT SAVED', unit: 'kg CO₂e', per: 0.000029 }
  ],
  'save-energy': [
    { label: 'ELECTRICITY SAVED', unit: 'kWh', per: 0.05 },
    { label: 'CO₂ AVOIDED', unit: 'kg', per: 0.038 }
  ],
  'protect-green-space': [
    { label: 'GREEN SPACE CARED FOR', unit: 'm²', per: 0.5 },
    { label: 'SOIL CARBON STORED', unit: 'g', per: 15.0 }
  ]
};

// Short-id aliases
ACTION_FACTORS['bottle']    = ACTION_FACTORS['recycle-material'];
ACTION_FACTORS['water']     = ACTION_FACTORS['save-water'];
ACTION_FACTORS['energy']    = ACTION_FACTORS['save-electricity'];
ACTION_FACTORS['transport'] = ACTION_FACTORS['low-carbon-trip'];
ACTION_FACTORS['nature']    = ACTION_FACTORS['plant-tree'];

export const getActionFactors = (actionId: string): ActionFactor[] => {
  const norm = normalizeActionId(actionId);
  return ACTION_FACTORS[norm] ?? ACTION_FACTORS['recycle-material'];
};

export const getPrimaryImpactSummary = (actionId: string): { value: string; unit: string; description: string } => {
  const norm = normalizeActionId(actionId);
  switch (norm) {
    case 'recycle-material':
      return { value: '0.025 kg', unit: 'material diverted', description: 'Kept in circular recycling loop' };
    case 'save-water':
      return { value: '20 L', unit: 'clean water conserved', description: 'Reduced municipal treated water load' };
    case 'save-electricity':
      return { value: '1.5 kWh', unit: 'electricity saved', description: 'Reduced grid electricity draw' };
    case 'low-carbon-trip':
      return { value: '8 km', unit: 'low-carbon travel', description: 'Zero tailpipe km shifted' };
    case 'plant-tree':
      return { value: '1 tree', unit: 'planted', description: 'Added to your environmental journey' };
    case 'restore-green-space':
      return { value: '10 m²', unit: 'green space', description: 'Restored or protected' };
    case 'compost-food':
      return { value: '1.5 kg', unit: 'organic waste diverted', description: 'Composted instead of landfilled' };
    default:
      return { value: '1 action', unit: 'eco contribution', description: 'Positive environmental habit' };
  }
};

export const DISCLAIMER =
  '* Simulator uses illustrative per-action multipliers for scale visualization. ' +
  'Individual contribution calculations use documented research factors (EPA WARM v16, CEA India Grid, NITI Aayog).';

export const DEFAULT_SIM: SimState = {
  people: 10000,
  frequency: 'weekly',
  months: 12
};

export const FREQUENCIES: { id: Frequency; label: string; unit: string; per: string }[] = [
  { id: 'once',    label: 'Once',    unit: 'time',   per: 'TIME'  },
  { id: 'weekly',  label: 'Weekly',  unit: 'weeks',  per: 'WEEK'  },
  { id: 'monthly', label: 'Monthly', unit: 'months', per: 'MONTH' },
  { id: 'daily',   label: 'Daily',   unit: 'days',   per: 'DAY'   }
];

export const DURATIONS = [
  { months: 1,  label: '1 month' },
  { months: 6,  label: '6 months' },
  { months: 12, label: '1 year'  },
  { months: 60, label: '5 years' }
];

export const PROBLEM_STEPS = [
  { n: 1,     dots: 1   },
  { n: 10,    dots: 10  },
  { n: 1000,  dots: 48  },
  { n: 10000, dots: 110 }
];

export const COMMUNITY_STAGES = [
  { label: 'You',         people: 1,     name: 'Seed'    },
  { label: '10 people',   people: 10,    name: 'Plant'   },
  { label: '100 people',  people: 100,   name: 'Patch'   },
  { label: '1,000 people',people: 1000,  name: 'Garden'  },
  { label: '10,000 people',people:10000, name: 'Forest'  }
];
