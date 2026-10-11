/**
 * Impact Engine
 *
 * THE ONLY PLACE where environmental calculations happen.
 *
 * Architecture:
 *   AI → identification
 *   Impact Engine → calculation   ← this file
 *   Database → storage
 *   Aggregation → community totals
 *
 * Receives: action + user inputs + metadata
 * Returns:  ImpactCalculationResult with typed metrics + methodology
 */

import type {
  ImpactCalculationResult,
  ImpactMetricResult,
  MethodologyStep,
  Action
} from '../types';

import {
  ENVIRONMENTAL_FACTORS,
  RECYCLING_MATERIAL_FACTORS,
  TRANSPORT_MODE_FACTORS,
  TRANSPORT_BASELINE_KG_PER_KM,
  TRANSPORT_BASELINE_FACTOR_ID,
  calcRecyclingGhg,
  calcRecyclingEnergy,
  calcElectricityCo2,
  calcTransportCo2Avoided,
  getFactor,
  getFactorSafe
} from '../data/environmentalFactors';

// ─── Types for engine input ──────────────────────────────────────────────────

export interface ImpactInput {
  action: Action;
  /** Primary quantity (grams / litres / kWh / km / trees / m²) */
  quantity: number;
  metadata: Record<string, string | number | boolean>;
}

// ─── Main calculation function ────────────────────────────────────────────────

export function calculateImpact(input: ImpactInput): ImpactCalculationResult {
  const { action, quantity, metadata } = input;

  switch (action.id) {
    case 'recycle-material':
      return calculateRecycling(quantity, metadata);

    case 'save-water':
      return calculateWater(quantity, metadata);

    case 'save-electricity':
      return calculateElectricity(quantity, metadata);

    case 'low-carbon-trip':
      return calculateTransport(quantity, metadata);

    case 'plant-tree':
      return calculateTreePlanting(quantity, metadata);

    case 'restore-green-space':
      return calculateGreenSpaceRestoration(quantity, metadata);

    case 'compost-food':
      return calculateComposting(quantity, metadata);

    default:
      return genericImpact(action, quantity);
  }
}

// ─── 1. Recycling ─────────────────────────────────────────────────────────────

function calculateRecycling(
  massGrams: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const material = (metadata.material as string) || 'PET';
  const matFactors = RECYCLING_MATERIAL_FACTORS[material] || RECYCLING_MATERIAL_FACTORS['PET'];

  const ghgFactor = getFactor(matFactors.ghgId);
  const energyFactor = getFactorSafe(matFactors.energyId);

  const massKg = massGrams / 1000;
  const ghgAvoided = calcRecyclingGhg(massGrams, ghgFactor.factor);
  const energySaved = energyFactor ? calcRecyclingEnergy(massGrams, energyFactor.factor) : 0;

  const metrics: ImpactMetricResult[] = [
    {
      type: 'wasteDivertedKg' as any,
      value: parseFloat(massKg.toFixed(4)),
      unit: 'kg',
      label: 'Material diverted from landfill',
      description: `${matFactors.label} kept in the recycling loop`,
      methodologyNote: 'Direct measurement of material weight',
      confidenceLevel: 'measured'
    },
    {
      type: 'co2eAvoided',
      value: parseFloat(ghgAvoided.toFixed(6)),
      unit: 'kg CO₂e',
      label: 'Estimated modeled GHG reduction',
      description: `Based on EPA WARM v16 ${matFactors.label} factor`,
      factorId: matFactors.ghgId,
      factorValue: ghgFactor.factor,
      factorUnit: ghgFactor.unit,
      factorSource: ghgFactor.source,
      factorVersion: ghgFactor.version,
      methodologyNote:
        'EPA WARM v16 reports GHG avoided by recycling vs. landfill baseline. ' +
        'This is a modeled comparative lifecycle estimate, not a direct measurement.',
      confidenceLevel: 'modelled'
    }
  ];

  if (energyFactor && energySaved > 0) {
    metrics.push({
      type: 'energySaved',
      value: parseFloat(energySaved.toFixed(5)),
      unit: 'kWh',
      label: 'Estimated energy savings',
      description: 'Energy saved vs. virgin material production',
      factorId: matFactors.energyId,
      factorValue: energyFactor.factor,
      factorUnit: energyFactor.unit,
      factorSource: energyFactor.source,
      factorVersion: energyFactor.version,
      methodologyNote:
        'EPA WARM v16 energy factor converted from MMBtu/short-ton to kWh. ' +
        '1 MMBtu = 293.071 kWh, 1 short ton = 907.185 kg.',
      confidenceLevel: 'modelled'
    });
  }

  const methodology: MethodologyStep[] = [
    { label: 'Material', value: matFactors.label },
    { label: 'Weight', value: `${massGrams} g (${massKg.toFixed(4)} kg)` },
    {
      label: 'GHG Factor',
      value: `${ghgFactor.factor} MTCO₂e / short ton`,
      note: `Source: ${ghgFactor.source} v${ghgFactor.version}`
    },
    {
      label: 'Conversion',
      value: `${massGrams} × ${ghgFactor.factor} × (1000/907185) kg/g`,
    },
    {
      label: 'Estimated GHG Reduction',
      value: `${ghgAvoided.toFixed(6)} kg CO₂e`
    },
    ...(energyFactor
      ? [{
          label: 'Estimated Energy Savings',
          value: `${energySaved.toFixed(5)} kWh`,
          note: `${energyFactor.factor} MMBtu/short-ton × 293.071 kWh/MMBtu`
        }]
      : [])
  ];

  return {
    metrics,
    methodology,
    caveats: [
      'This is a modeled estimate based on US EPA WARM lifecycle methodology.',
      'Actual impact depends on local recycling infrastructure and processing efficiency.',
      'EPA WARM v16 uses US-specific energy grid data; results are illustrative for India.'
    ]
  };
}

// ─── 2. Water ─────────────────────────────────────────────────────────────────

function calculateWater(
  litres: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const actionType = (metadata.action_type as string) || 'unspecified';
  const actionLabels: Record<string, string> = {
    tap_off: 'Turned off tap',
    short_shower: 'Shorter shower',
    fixed_leak: 'Fixed a leak',
    reused: 'Reused / recycled water',
    efficient: 'Used efficient fixture',
    unspecified: 'Water conservation'
  };

  const metrics: ImpactMetricResult[] = [
    {
      type: 'waterSaved',
      value: parseFloat(litres.toFixed(2)),
      unit: 'litres',
      label: 'Water conserved',
      description: actionLabels[actionType] || 'Water saved',
      methodologyNote:
        'Measured directly in litres. No CO₂ estimate is applied — ' +
        'water-energy intensity varies significantly by local utility system.',
      confidenceLevel: 'measured'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Action', value: actionLabels[actionType] || 'Water conservation' },
    { label: 'Water saved', value: `${litres} litres` },
    {
      label: 'CO₂ Note',
      value: 'Not calculated',
      note:
        'Water-energy intensity varies by local water utility. ' +
        'EPA WaterSense acknowledges the water-energy nexus but does not provide ' +
        'a universal CO₂-per-litre factor.'
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      'Water savings are measured directly in litres — the most scientifically honest metric.',
      'Associated energy/CO₂ benefits depend on local water treatment and heating systems.',
      'These are not calculated here without local utility data.',
      'Reference: US EPA WaterSense program documentation.'
    ]
  };
}

// ─── 3. Electricity ───────────────────────────────────────────────────────────

function calculateElectricity(
  kWh: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const gridFactor = getFactor('india-grid-fy2024-25');
  const co2Avoided = calcElectricityCo2(kWh, gridFactor.factor);

  const actionType = (metadata.action_type as string) || 'unspecified';
  const actionLabels: Record<string, string> = {
    switched_off: 'Switched off unused device/light',
    efficient_app: 'Used energy-efficient appliance',
    reduced_ac: 'Reduced AC / heating usage',
    reduced_light: 'Reduced lighting',
    solar: 'Used solar electricity',
    unspecified: 'Electricity saving'
  };

  const metrics: ImpactMetricResult[] = [
    {
      type: 'energySaved',
      value: parseFloat(kWh.toFixed(3)),
      unit: 'kWh',
      label: 'Electricity saved',
      description: actionLabels[actionType] || 'Electricity saved',
      methodologyNote: 'Directly entered by user in kWh.',
      confidenceLevel: 'measured'
    },
    {
      type: 'co2eAvoided',
      value: parseFloat(co2Avoided.toFixed(4)),
      unit: 'kg CO₂',
      label: 'Estimated CO₂ avoided',
      description: 'Based on India grid emission factor (CEA FY2024-25)',
      factorId: gridFactor.id,
      factorValue: gridFactor.factor,
      factorUnit: gridFactor.unit,
      factorSource: gridFactor.source,
      methodologyNote:
        'CO₂ avoided = kWh saved × India grid emission factor. ' +
        'Factor: 0.710 kgCO₂/kWh (CEA weighted-average, FY2024-25). ' +
        'Actual avoided emissions depend on marginal generation source.',
      confidenceLevel: 'measured'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Action', value: actionLabels[actionType] || 'Electricity saving' },
    { label: 'Electricity saved', value: `${kWh} kWh` },
    {
      label: 'Grid Emission Factor',
      value: `${gridFactor.factor} kgCO₂/kWh`,
      note: `Source: ${gridFactor.source}, ${gridFactor.geography}`
    },
    {
      label: 'Calculation',
      value: `${kWh} × ${gridFactor.factor} = ${co2Avoided.toFixed(4)} kg CO₂`
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      `Based on India's grid emission factor (CEA FY2024-25): ${gridFactor.factor} kgCO₂/kWh.`,
      'This is a weighted-average national factor; actual emissions vary by state and time.',
      'Using solar avoids grid emissions entirely — this assumes grid electricity was displaced.'
    ]
  };
}

// ─── 4. Transport ─────────────────────────────────────────────────────────────

function calculateTransport(
  distanceKm: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const mode = (metadata.mode as string) || 'cycle';
  const modeData = TRANSPORT_MODE_FACTORS[mode] || TRANSPORT_MODE_FACTORS['cycle'];
  const baseline = getFactor(TRANSPORT_BASELINE_FACTOR_ID);

  // Baseline = petrol car; chosen mode factor
  const baselineKgPerKm = TRANSPORT_BASELINE_KG_PER_KM;
  const chosenKgPerKm = modeData.factorKgPerKm;
  const co2Avoided = calcTransportCo2Avoided(distanceKm, baselineKgPerKm, chosenKgPerKm);

  const metrics: ImpactMetricResult[] = [
    {
      type: 'distanceShifted',
      value: parseFloat(distanceKm.toFixed(2)),
      unit: 'km',
      label: `Distance by ${modeData.label}`,
      description: `${distanceKm} km shifted to lower-carbon mode`,
      methodologyNote: 'Direct measurement of distance travelled.',
      confidenceLevel: 'measured'
    },
    {
      type: 'co2eAvoided',
      value: parseFloat(co2Avoided.toFixed(4)),
      unit: 'kg CO₂',
      label: 'Estimated operational CO₂ avoided',
      description: `Compared with petrol car (${baseline.factor} kgCO₂/passenger-km)`,
      factorId: modeData.factorId !== 'none' ? modeData.factorId : TRANSPORT_BASELINE_FACTOR_ID,
      factorValue: baselineKgPerKm,
      factorUnit: 'kgCO₂ per passenger-km',
      factorSource: baseline.source,
      methodologyNote:
        `Avoided CO₂ = distance × (baseline factor − chosen mode factor). ` +
        `Baseline: petrol car at ${baselineKgPerKm} kgCO₂/km. ` +
        `Chosen mode: ${modeData.label} at ${chosenKgPerKm} kgCO₂/km. ` +
        (modeData.zeroTailpipe
          ? 'Zero direct tailpipe emissions for walking/cycling.'
          : 'Tailpipe emissions only — does not include vehicle manufacturing lifecycle.'),
      confidenceLevel: 'modelled'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Mode chosen', value: modeData.label },
    { label: 'Distance', value: `${distanceKm} km` },
    {
      label: 'Baseline (petrol car)',
      value: `${baselineKgPerKm} kgCO₂/passenger-km`,
      note: `Source: ${baseline.source}`
    },
    {
      label: 'Chosen mode factor',
      value: `${chosenKgPerKm} kgCO₂/km`,
      note: modeData.zeroTailpipe ? 'Zero tailpipe emissions' : `Source: ${baseline.source}`
    },
    {
      label: 'Avoided CO₂',
      value: `${distanceKm} × (${baselineKgPerKm} − ${chosenKgPerKm}) = ${co2Avoided.toFixed(4)} kg`
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      `Baseline comparison: petrol car at ${baselineKgPerKm} kgCO₂/passenger-km (NITI Aayog data).`,
      'Tailpipe/operational emissions only — vehicle manufacturing lifecycle not included.',
      modeData.zeroTailpipe
        ? `${modeData.label} produces zero direct tailpipe emissions.`
        : `${modeData.label} has lower emissions per passenger-km than a solo petrol car.`,
      'Actual savings vary with vehicle age, fuel type, occupancy, and traffic.'
    ]
  };
}

// ─── 5. Tree Planting ─────────────────────────────────────────────────────────

function calculateTreePlanting(
  numTrees: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const treeType = (metadata.tree_type as string) || 'native_tree';
  const alive = metadata.alive !== 'no';

  const treeLabels: Record<string, string> = {
    native_tree: 'Native tree',
    fruit_tree: 'Fruit tree',
    maintained: 'Existing tree maintained',
    other: 'Tree'
  };

  const metrics: ImpactMetricResult[] = [
    {
      type: 'treesPlanted',
      value: numTrees,
      unit: numTrees === 1 ? 'tree' : 'trees',
      label: treeLabels[treeType] + (alive ? '' : ' (survival uncertain)'),
      description:
        'Trees recorded in your environmental journey. ' +
        'Carbon sequestration tracked over time as trees grow.',
      methodologyNote:
        'Carbon sequestration is NOT calculated at planting. ' +
        'It varies significantly with species, age, size, climate, and management. ' +
        'US Forest Service research explicitly documents this variability.',
      confidenceLevel: 'measured'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Type', value: treeLabels[treeType] || 'Tree' },
    { label: 'Count', value: `${numTrees} ${numTrees === 1 ? 'tree' : 'trees'}` },
    { label: 'Status', value: alive ? 'Alive / healthy' : 'Survival uncertain' },
    {
      label: 'Carbon Sequestration',
      value: 'Not estimated at planting',
      note:
        'Tree carbon sequestration varies with species, size, age, climate, and management. ' +
        'Reference: US Forest Service urban tree carbon research. ' +
        'We record your contribution honestly and track survival over time.'
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      'Carbon sequestration is NOT claimed at the moment of planting.',
      'Tree CO₂ sequestration varies enormously with species, size, age, climate, and survival.',
      'US Forest Service research explicitly documents this variability.',
      'Your tree is recorded in your journey — its carbon benefit accrues as it grows.',
      alive
        ? 'Mark this tree as surviving each year to track its continued contribution.'
        : 'If the tree does not survive, no carbon benefit is claimed.'
    ]
  };
}

// ─── 6. Green Space Restoration ───────────────────────────────────────────────

function calculateGreenSpaceRestoration(
  areaM2: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const actionType = (metadata.action_type as string) || 'unspecified';
  const actionLabels: Record<string, string> = {
    planted_native: 'Planted native vegetation',
    cleared_waste: 'Cleared waste from green area',
    watered: 'Watered / maintained plants',
    protected: 'Protected from development',
    unspecified: 'Green space restoration'
  };

  const metrics: ImpactMetricResult[] = [
    {
      type: 'areaRestored',
      value: parseFloat(areaM2.toFixed(2)),
      unit: 'm²',
      label: 'Green area restored / protected',
      description: actionLabels[actionType] || 'Green space cared for',
      methodologyNote:
        'Measured directly in square metres. ' +
        'Carbon sequestration depends on vegetation type, soil, and location — not estimated here.',
      confidenceLevel: 'measured'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Action', value: actionLabels[actionType] || 'Green space restoration' },
    { label: 'Area', value: `${areaM2} m²` },
    {
      label: 'Carbon Note',
      value: 'Not estimated',
      note:
        'Soil carbon and vegetation carbon sequestration varies significantly by biome, ' +
        'vegetation type, and management. A defensible location-specific model is required.'
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      'Primary metric: area restored or protected (m²).',
      'Carbon sequestration is not estimated without species/soil/location data.',
      'Biodiversity and ecosystem service benefits exist beyond CO₂ alone.'
    ]
  };
}

// ─── 7. Composting ────────────────────────────────────────────────────────────

function calculateComposting(
  massKg: number,
  metadata: Record<string, string | number | boolean>
): ImpactCalculationResult {
  const compostFactor = getFactor('food-composting-warm16');
  const massGrams = massKg * 1000;

  // WARM factor: MTCO₂e per short ton
  // ghgBenefit = kg × (factor * 1000) / 907185
  const ghgBenefit = calcRecyclingGhg(massGrams, compostFactor.factor);

  const method = (metadata.method as string) || 'home_compost';
  const methodLabels: Record<string, string> = {
    home_compost: 'Home compost bin / pile',
    vermicompost: 'Vermicompost (worm bin)',
    community: 'Community compost program',
    municipal: 'Municipal organics collection',
    other: 'Composting'
  };

  const metrics: ImpactMetricResult[] = [
    {
      type: 'wasteDivertedKg' as any,
      value: parseFloat(massKg.toFixed(3)),
      unit: 'kg',
      label: 'Organic waste diverted from landfill',
      description: methodLabels[method] || 'Food waste composted',
      methodologyNote: 'Direct measurement of organic waste composted.',
      confidenceLevel: 'measured'
    },
    {
      type: 'co2eAvoided',
      value: parseFloat(ghgBenefit.toFixed(6)),
      unit: 'kg CO₂e',
      label: 'Estimated modeled GHG benefit',
      description: 'Methane avoidance from keeping organic waste out of landfill',
      factorId: compostFactor.id,
      factorValue: compostFactor.factor,
      factorUnit: compostFactor.unit,
      factorSource: compostFactor.source,
      factorVersion: compostFactor.version,
      methodologyNote:
        'EPA WARM v16 food waste composting GHG factor. ' +
        'Primary benefit is avoided landfill methane (CH₄) emissions. ' +
        'Soil carbon sequestration from compost application is additional but variable.',
      confidenceLevel: 'modelled'
    }
  ];

  const methodology: MethodologyStep[] = [
    { label: 'Method', value: methodLabels[method] || 'Composting' },
    { label: 'Weight composted', value: `${massKg} kg (${massGrams} g)` },
    {
      label: 'Composting GHG Factor',
      value: `${compostFactor.factor} MTCO₂e / short ton`,
      note: `Source: ${compostFactor.source} v${compostFactor.version}`
    },
    {
      label: 'Estimated GHG Benefit',
      value: `${ghgBenefit.toFixed(6)} kg CO₂e`
    }
  ];

  return {
    metrics,
    methodology,
    caveats: [
      'This is a modeled estimate based on US EPA WARM v16 food waste composting factor.',
      'Primary GHG benefit: methane avoided by diverting organics from landfill.',
      'Soil carbon sequestration from compost use is additional but location-dependent.',
      'WARM uses US-specific landfill gas capture data — results are illustrative for India.',
      `Uncertainty: ${compostFactor.uncertainty || '±25% based on landfill gas capture variability'}.`
    ]
  };
}

// ─── 8. Generic fallback ──────────────────────────────────────────────────────

function genericImpact(action: Action, quantity: number): ImpactCalculationResult {
  return {
    metrics: [
      {
        type: 'wasteDivertedKg' as any,
        value: quantity,
        unit: 'units',
        label: `${action.name} completed`,
        description: 'Contribution recorded',
        methodologyNote: 'Direct count — no factor applied for this action type yet.',
        confidenceLevel: 'measured'
      }
    ],
    methodology: [
      { label: 'Action', value: action.name },
      { label: 'Quantity', value: `${quantity}` }
    ],
    caveats: ['Calculation model for this action is not yet available.']
  };
}

// ─── Helper: Get primary metric from a result ────────────────────────────────

export function getPrimaryMetric(result: ImpactCalculationResult): ImpactMetricResult | null {
  return result.metrics[0] ?? null;
}

// ─── Helper: Build impact snapshot for storage ───────────────────────────────

export function buildImpactSnapshot(result: ImpactCalculationResult) {
  const snapshot: {
    wasteDivertedKg?: number;
    waterSavedLitres?: number;
    electricitySavedKwh?: number;
    co2eAvoidedKg?: number;
    distanceShiftedKm?: number;
    treesPlanted?: number;
    areaRestoredM2?: number;
  } = {};

  for (const m of result.metrics) {
    switch (m.type) {
      case 'wasteDivertedKg' as any:
        snapshot.wasteDivertedKg = m.value; break;
      case 'waterSaved':
        snapshot.waterSavedLitres = m.value; break;
      case 'energySaved':
        snapshot.electricitySavedKwh = m.value; break;
      case 'co2eAvoided':
        snapshot.co2eAvoidedKg = m.value; break;
      case 'distanceShifted':
        snapshot.distanceShiftedKm = m.value; break;
      case 'treesPlanted':
        snapshot.treesPlanted = m.value; break;
      case 'areaRestored':
        snapshot.areaRestoredM2 = m.value; break;
    }
  }

  return snapshot;
}
