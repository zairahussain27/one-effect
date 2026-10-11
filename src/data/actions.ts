import type { Action } from '../types';

/**
 * Actions data — each action definition drives:
 *  - Action selection UI
 *  - Dynamic input form (via inputSchema)
 *  - Impact engine (via factorId)
 *  - History display
 *  - Community aggregation
 *
 * Adding a new action: add an entry here.
 * No other file needs to be changed for the action to appear.
 */
export const ACTIONS: Action[] = [
  // ── Recycling ─────────────────────────────────────────────────────────────
  {
    id: 'recycle-material',
    name: 'Recycle an item',
    sentence: 'Recycle a recyclable item by weight',
    category: 'Waste',
    icon: '♻️',
    blurb: 'Sort recyclables instead of sending them to landfill.',
    description:
      'Select the material and enter the approximate weight. ' +
      'Upload a photo for AI verification.',
    recommendedAction: 'Recycle in dedicated collection bin',
    materialPrompt: 'Recyclable Material',
    factorId: 'pet-recycling-warm16',
    verificationType: 'both',
    availableMetrics: ['wasteDivertedKg' as any, 'co2eAvoided', 'energySaved'] as any,
    inputSchema: [
      {
        id: 'material',
        label: 'What material are you recycling?',
        type: 'radio',
        options: [
          { value: 'PET',        label: 'PET Bottle',         icon: '🍶' },
          { value: 'Aluminum',   label: 'Aluminum Can',        icon: '🥫' },
          { value: 'Glass',      label: 'Glass Bottle',        icon: '🍾' },
          { value: 'HDPE',       label: 'HDPE Plastic',        icon: '🛢️' },
          { value: 'Corrugated', label: 'Cardboard Box',       icon: '📦' },
          { value: 'Paper',      label: 'Paper',               icon: '📄' },
          { value: 'Steel',      label: 'Steel / Tin Can',     icon: '🥫' },
          { value: 'EWaste',     label: 'E-Waste',             icon: '💻' },
        ]
      },
      {
        id: 'quantity',
        label: 'Approximate weight',
        type: 'number',
        unit: 'grams',
        min: 1,
        max: 100000,
        step: 1,
        helpText: 'Typical PET bottle: 12–30 g  ·  Aluminum can: 15 g  ·  Glass bottle: 200–400 g'
      }
    ]
  },

  // ── Water ─────────────────────────────────────────────────────────────────
  {
    id: 'save-water',
    name: 'Save water',
    sentence: 'Conserve water by turning off the tap or using less',
    category: 'Water',
    icon: '💧',
    blurb: 'Every litre you save counts. Measured directly.',
    description:
      'Enter how much water you saved. ' +
      'No CO₂ estimate is applied because water-energy intensity varies by local utility.',
    recommendedAction: 'Turn off tap when not actively using',
    materialPrompt: 'Water Tap / Faucet',
    factorId: 'water-conservation-note',
    verificationType: 'both',
    availableMetrics: ['waterSaved'] as any,
    inputSchema: [
      {
        id: 'quantity',
        label: 'How much water did you save?',
        type: 'number',
        unit: 'litres',
        min: 0.1,
        max: 10000,
        step: 0.5,
        helpText: 'Turning off a running tap for 1 min saves ~6 L  ·  Short shower: ~25–50 L saved'
      },
      {
        id: 'action_type',
        label: 'What did you do?',
        type: 'select',
        optional: true,
        options: [
          { value: 'tap_off',     label: 'Turned off tap while not in use' },
          { value: 'short_shower',label: 'Took a shorter shower'           },
          { value: 'fixed_leak',  label: 'Fixed a leak'                    },
          { value: 'reused',      label: 'Reused / recycled water'         },
          { value: 'efficient',   label: 'Used efficient fixture'          },
          { value: 'other',       label: 'Other'                           },
        ]
      }
    ]
  },

  // ── Electricity ───────────────────────────────────────────────────────────
  {
    id: 'save-electricity',
    name: 'Save electricity',
    sentence: 'Reduce electricity consumption',
    category: 'Energy',
    icon: '⚡',
    blurb: 'Every kWh you avoid = 0.71 kg CO₂ off India\'s grid.',
    description:
      'Enter the kilowatt-hours saved. ' +
      'Impact is calculated using India\'s official grid emission factor (CEA FY2024-25).',
    recommendedAction: 'Power down and unplug idle appliances',
    materialPrompt: 'Appliance / Light',
    factorId: 'india-grid-fy2024-25',
    verificationType: 'both',
    availableMetrics: ['energySaved', 'co2eAvoided'] as any,
    inputSchema: [
      {
        id: 'quantity',
        label: 'How much electricity did you save?',
        type: 'number',
        unit: 'kWh',
        min: 0.01,
        max: 1000,
        step: 0.1,
        helpText:
          'Turning off a 60W bulb for 1 hr = 0.06 kWh  ·  ' +
          'Not running AC for 1 hr = ~1.5 kWh  ·  ' +
          'Using solar instead of grid for 1 day = 3–5 kWh'
      },
      {
        id: 'action_type',
        label: 'What did you do?',
        type: 'select',
        optional: true,
        options: [
          { value: 'switched_off',   label: 'Switched off unused device/light'  },
          { value: 'efficient_app',  label: 'Used energy-efficient appliance'   },
          { value: 'reduced_ac',     label: 'Reduced AC / heating usage'        },
          { value: 'reduced_light',  label: 'Reduced lighting'                  },
          { value: 'solar',          label: 'Used solar electricity instead'     },
          { value: 'other',          label: 'Other'                             },
        ]
      }
    ]
  },

  // ── Transport ─────────────────────────────────────────────────────────────
  {
    id: 'low-carbon-trip',
    name: 'Choose a lower-carbon trip',
    sentence: 'Travel by foot, bike, or public transport',
    category: 'Transport',
    icon: '🚲',
    blurb: 'Zero tailpipe emissions from every km you walk or cycle.',
    description:
      'Select your mode of travel and enter the distance. ' +
      'Avoided CO₂ is estimated vs. a petrol car baseline (NITI Aayog data).',
    recommendedAction: 'Walk, cycle or use public transit for short trips',
    materialPrompt: 'Bicycle / Transit',
    factorId: 'india-car-tailpipe',
    verificationType: 'both',
    availableMetrics: ['distanceShifted', 'co2eAvoided'] as any,
    inputSchema: [
      {
        id: 'mode',
        label: 'How did you travel?',
        type: 'radio',
        options: [
          { value: 'walk',       label: 'Walk',           icon: '🚶' },
          { value: 'cycle',      label: 'Cycle',          icon: '🚲' },
          { value: 'bus',        label: 'Bus',            icon: '🚌' },
          { value: 'metro',      label: 'Metro / Train',  icon: '🚇' },
          { value: 'motorcycle', label: 'Motorcycle',     icon: '🏍️' },
          { value: 'auto',       label: 'Auto-Rickshaw',  icon: '🛺' },
          { value: 'ev',         label: 'Electric Vehicle', icon: '⚡' },
        ]
      },
      {
        id: 'quantity',
        label: 'Distance travelled',
        type: 'number',
        unit: 'km',
        min: 0.1,
        max: 500,
        step: 0.5,
        helpText: 'Enter the actual distance you travelled by this mode.'
      },
      {
        id: 'occupancy',
        label: 'Number of passengers (including you)',
        type: 'number',
        unit: 'people',
        min: 1,
        max: 6,
        step: 1,
        optional: true,
        helpText: 'For car/motorcycle — more passengers = lower per-person emissions.'
      }
    ]
  },

  // ── Nature ────────────────────────────────────────────────────────────────
  {
    id: 'plant-tree',
    name: 'Plant or tend a tree',
    sentence: 'Plant a native tree or tend an existing one',
    category: 'Nature',
    icon: '🌱',
    blurb: 'Trees grow and sequester carbon over years — recorded honestly.',
    description:
      'Record trees you planted or maintained. ' +
      'Carbon sequestration is NOT estimated at planting — it depends on species, age, and survival.',
    recommendedAction: 'Plant native trees and monitor their survival',
    materialPrompt: 'Native Tree / Sapling',
    factorId: 'none',
    verificationType: 'both',
    availableMetrics: ['treesPlanted'] as any,
    inputSchema: [
      {
        id: 'tree_type',
        label: 'What did you plant or tend?',
        type: 'radio',
        options: [
          { value: 'native_tree',  label: 'Native tree (sapling)',  icon: '🌳' },
          { value: 'fruit_tree',   label: 'Fruit tree',             icon: '🍎' },
          { value: 'maintained',   label: 'Maintained an existing tree', icon: '🌿' },
          { value: 'other',        label: 'Other',                  icon: '🌱' },
        ]
      },
      {
        id: 'quantity',
        label: 'Number of trees',
        type: 'number',
        unit: 'trees',
        min: 1,
        max: 1000,
        step: 1
      },
      {
        id: 'alive',
        label: 'Is the tree currently alive / healthy?',
        type: 'toggle',
        optional: true,
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no',  label: 'No'  }
        ]
      }
    ]
  },

  // ── Green Space Restoration ────────────────────────────────────────────────
  {
    id: 'restore-green-space',
    name: 'Restore green space',
    sentence: 'Restore or protect a green area',
    category: 'Nature',
    icon: '🌿',
    blurb: 'Protect urban green areas for biodiversity and wellbeing.',
    description:
      'Enter the area you restored or protected. ' +
      'Carbon sequestration is not estimated without species/soil data.',
    recommendedAction: 'Care for local flora and leave nature wild',
    materialPrompt: 'Green Space / Flora',
    factorId: 'none',
    verificationType: 'both',
    availableMetrics: ['areaRestored'] as any,
    inputSchema: [
      {
        id: 'quantity',
        label: 'Area restored or protected',
        type: 'number',
        unit: 'm²',
        min: 0.1,
        max: 100000,
        step: 0.5,
        helpText: 'A typical urban garden plot: 5–20 m²'
      },
      {
        id: 'action_type',
        label: 'What did you do?',
        type: 'select',
        optional: true,
        options: [
          { value: 'planted_native', label: 'Planted native vegetation' },
          { value: 'cleared_waste',  label: 'Cleared waste from green area' },
          { value: 'watered',        label: 'Watered / maintained plants' },
          { value: 'protected',      label: 'Protected from development' },
          { value: 'other',          label: 'Other' },
        ]
      }
    ]
  },

  // ── Composting ────────────────────────────────────────────────────────────
  {
    id: 'compost-food',
    name: 'Compost food waste',
    sentence: 'Divert food waste from landfill by composting',
    category: 'Waste',
    icon: '🌾',
    blurb: 'Composting diverts organic waste and prevents methane in landfills.',
    description:
      'Enter the weight of food waste you composted. ' +
      'GHG benefit uses EPA WARM v16 food waste composting factor.',
    recommendedAction: 'Compost kitchen scraps instead of sending to landfill',
    materialPrompt: 'Organic Food Waste',
    factorId: 'food-composting-warm16',
    verificationType: 'both',
    availableMetrics: ['wasteDivertedKg' as any, 'co2eAvoided'] as any,
    inputSchema: [
      {
        id: 'quantity',
        label: 'How much food waste did you compost?',
        type: 'number',
        unit: 'kg',
        min: 0.01,
        max: 500,
        step: 0.1,
        helpText:
          'A typical meal generates ~0.1–0.3 kg of compostable scraps. ' +
          'A week of kitchen compost: ~1–3 kg.'
      },
      {
        id: 'method',
        label: 'Composting method',
        type: 'select',
        optional: true,
        options: [
          { value: 'home_compost',   label: 'Home compost bin / pile' },
          { value: 'vermicompost',   label: 'Vermicompost (worm bin)' },
          { value: 'community',      label: 'Community compost program' },
          { value: 'municipal',      label: 'Municipal organics collection' },
          { value: 'other',          label: 'Other' },
        ]
      }
    ]
  }
];

// ─── Helper functions ─────────────────────────────────────────────────────────

export const normalizeActionId = (id: string): string => {
  if (!id) return 'recycle-material';
  const clean = id.toLowerCase().trim();

  // Exact match first
  if (ACTIONS.find((a) => a.id === clean)) return clean;

  // Legacy → new mapping
  if (clean === 'recycle-bottle' || clean === 'bottle' || clean === 'waste')
    return 'recycle-material';
  if (clean.includes('recycle') || clean.includes('recycl')) return 'recycle-material';
  if (clean.includes('compost') || clean.includes('food-waste')) return 'compost-food';
  if (clean.includes('water') || clean === 'save-water') return 'save-water';
  if (clean === 'save-energy' || clean === 'save-electricity' || clean.includes('energy') || clean.includes('elec'))
    return 'save-electricity';
  if (clean.includes('transport') || clean.includes('trip') || clean.includes('bike') || clean === 'low-carbon-trip')
    return 'low-carbon-trip';
  if (clean.includes('tree') || clean.includes('plant-tree')) return 'plant-tree';
  if (clean.includes('restore') || clean.includes('green-space') || clean.includes('protect-green'))
    return 'restore-green-space';
  if (clean.includes('nature') || clean.includes('plant') || clean.includes('green'))
    return 'plant-tree';

  return 'recycle-material';
};

export const getActionById = (id: string): Action => {
  const norm = normalizeActionId(id);
  return ACTIONS.find((a) => a.id === norm) || ACTIONS[0];
};

export const getActionsByCategory = (category: string): Action[] => {
  return ACTIONS.filter((a) => a.category.toLowerCase() === category.toLowerCase());
};
