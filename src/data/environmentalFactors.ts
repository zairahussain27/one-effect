import type { EnvironmentalFactor } from '../types';

/**
 * Environmental Factor Database
 *
 * Every factor here must contain:
 *  - A verifiable source (government / EPA / peer-reviewed)
 *  - The publication year and version
 *  - Geographic scope
 *  - Explicit methodology description
 *  - Confidence level (measured / modelled / estimated)
 *
 * UI MUST label modelled results as "Estimated modeled" not "You prevented X."
 */

// ─── Recycling Factors (EPA WARM v16) ────────────────────────────────────────
// Source: US EPA Waste Reduction Model (WARM) Version 16 (2023)
// URL: https://www.epa.gov/warm
// Methodology: Lifecycle GHG comparison — recycling vs. landfill baseline
// Unit: MTCO₂e per short ton of material
// Note: 1 short ton = 907.185 kg; 1 MTCO₂e/short ton = 0.001102311 kgCO₂e/g
//       Conversion: factor_kg_per_g = (MTCO2e_per_short_ton * 1000) / 907185

const WARM_GHG_TO_KG_PER_G = 1000 / 907185; // converts MTCO₂e/short-ton → kgCO₂e/g

// Energy factors from WARM v16 (million BTU per short ton)
// 1 MMBtu = 293.071 kWh
const WARM_ENERGY_TO_KWH_PER_G = (293071) / 907185; // converts MMBtu/short-ton → kWh/g

export const ENVIRONMENTAL_FACTORS: Record<string, EnvironmentalFactor> = {
  // ── PET Plastic Recycling ──────────────────────────────────────────────────
  'pet-recycling-warm16': {
    id: 'pet-recycling-warm16',
    name: 'PET Plastic Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology:
      'Lifecycle GHG comparison between recycling and baseline (landfill). ' +
      'Reports metric tons CO₂ equivalent avoided per short ton of material recycled.',
    factor: 1.04,
    unit: 'MTCO₂e per short ton',
    notes:
      'PET GHG factor from WARM v16 Table 6. ' +
      'This is a modeled comparative estimate, not a direct measurement.',
    confidence: 'modelled',
    uncertainty: '±15% (WARM v16 Table A-1 sensitivity ranges)'
  },

  // ── PET Plastic Recycling Energy ───────────────────────────────────────────
  'pet-energy-warm16': {
    id: 'pet-energy-warm16',
    name: 'PET Plastic Recycling Energy Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology:
      'Energy saved by recycling vs. virgin material production. ' +
      'Million BTU per short ton of material recycled.',
    factor: 28.59,
    unit: 'MMBtu per short ton',
    notes: 'PET energy factor from WARM v16 Table 7.',
    confidence: 'modelled'
  },

  // ── Aluminum Can Recycling GHG ─────────────────────────────────────────────
  'aluminum-recycling-warm16': {
    id: 'aluminum-recycling-warm16',
    name: 'Aluminum Can Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology:
      'Lifecycle GHG comparison between recycling and baseline (landfill). ' +
      'Aluminum has very high avoided emissions due to energy-intensive primary production.',
    factor: 9.13,
    unit: 'MTCO₂e per short ton',
    notes: 'Aluminum cans GHG factor from WARM v16. Highest GHG benefit among common recyclables.',
    confidence: 'modelled'
  },

  // ── Aluminum Can Recycling Energy ──────────────────────────────────────────
  'aluminum-energy-warm16': {
    id: 'aluminum-energy-warm16',
    name: 'Aluminum Can Recycling Energy Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Energy saved by recycling aluminum vs. primary (bauxite) production.',
    factor: 152.76,
    unit: 'MMBtu per short ton',
    notes: 'Aluminum energy factor from WARM v16. Recycling saves ~95% of energy vs. virgin.',
    confidence: 'modelled'
  },

  // ── Glass Recycling GHG ────────────────────────────────────────────────────
  'glass-recycling-warm16': {
    id: 'glass-recycling-warm16',
    name: 'Glass Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Lifecycle GHG comparison between glass recycling and baseline (landfill).',
    factor: 0.28,
    unit: 'MTCO₂e per short ton',
    notes: 'Glass GHG factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── Glass Recycling Energy ─────────────────────────────────────────────────
  'glass-energy-warm16': {
    id: 'glass-energy-warm16',
    name: 'Glass Recycling Energy Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Energy saved by recycling glass vs. primary production.',
    factor: 2.13,
    unit: 'MMBtu per short ton',
    notes: 'Glass energy factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── Corrugated Cardboard GHG ───────────────────────────────────────────────
  'corrugated-recycling-warm16': {
    id: 'corrugated-recycling-warm16',
    name: 'Corrugated Cardboard Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Lifecycle GHG comparison between corrugated cardboard recycling and landfill.',
    factor: 3.14,
    unit: 'MTCO₂e per short ton',
    notes: 'Corrugated cardboard GHG factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── Corrugated Cardboard Energy ────────────────────────────────────────────
  'corrugated-energy-warm16': {
    id: 'corrugated-energy-warm16',
    name: 'Corrugated Cardboard Recycling Energy Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Energy saved by recycling corrugated cardboard vs. virgin fiber production.',
    factor: 15.10,
    unit: 'MMBtu per short ton',
    notes: 'Corrugated energy factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── Paper Recycling GHG ────────────────────────────────────────────────────
  'paper-recycling-warm16': {
    id: 'paper-recycling-warm16',
    name: 'Mixed Paper Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Lifecycle GHG comparison between mixed paper recycling and landfill baseline.',
    factor: 2.94,
    unit: 'MTCO₂e per short ton',
    notes: 'Mixed paper GHG factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── HDPE Recycling GHG ────────────────────────────────────────────────────
  'hdpe-recycling-warm16': {
    id: 'hdpe-recycling-warm16',
    name: 'HDPE Plastic Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Lifecycle GHG comparison between HDPE recycling and landfill baseline.',
    factor: 0.76,
    unit: 'MTCO₂e per short ton',
    notes: 'HDPE GHG factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── Steel Can Recycling GHG ────────────────────────────────────────────────
  'steel-recycling-warm16': {
    id: 'steel-recycling-warm16',
    name: 'Steel Can Recycling GHG Factor',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology: 'Lifecycle GHG comparison between steel can recycling and landfill baseline.',
    factor: 1.83,
    unit: 'MTCO₂e per short ton',
    notes: 'Steel cans GHG factor from WARM v16.',
    confidence: 'modelled'
  },

  // ── India Grid Electricity Emission Factor ─────────────────────────────────
  'india-grid-fy2024-25': {
    id: 'india-grid-fy2024-25',
    name: 'India Grid Electricity CO₂ Emission Factor',
    source: 'Central Electricity Authority / Government of India',
    sourceUrl:
      'https://cea.nic.in/wp-content/uploads/baseline/2023/09/CO2_Baseline_Database_for_the_Indian_Power_Sector_User_Guide_Ver_18.0.pdf',
    publicationYear: 2024,
    geography: 'India (national grid average)',
    methodology:
      'Weighted-average grid electricity CO₂ emission factor including all generation sources ' +
      'and renewable energy share for FY2024-25. Published by Central Electricity Authority under ' +
      'the Ministry of Power, Government of India.',
    factor: 0.710,
    unit: 'kgCO₂/kWh',
    notes:
      'FY2024-25 weighted-average factor. This represents average grid emissions; ' +
      'actual avoided emissions depend on the marginal generation source at time of saving.',
    confidence: 'measured',
    uncertainty: 'Varies by state grid and time-of-day'
  },

  // ── India Transport — Petrol Car Tailpipe ─────────────────────────────────
  'india-car-tailpipe': {
    id: 'india-car-tailpipe',
    name: 'India Petrol Car Tailpipe CO₂ Emission Factor',
    source: 'NITI Aayog / MoRTH / IPCC Transport Guidelines',
    sourceUrl: 'https://niti.gov.in/sites/default/files/2023-09/EV-Report.pdf',
    publicationYear: 2023,
    geography: 'India',
    methodology:
      'Average CO₂ emission per passenger-km for a petrol car based on typical Indian vehicle ' +
      'mix and occupancy (average ~1.5 passengers). NITI Aayog transport modelling uses ' +
      'vehicle-specific emission factors and occupancy data.',
    factor: 0.143,
    unit: 'kgCO₂ per passenger-km',
    notes:
      'Tailpipe operational emissions only. Does not include vehicle manufacturing lifecycle. ' +
      'Baseline for computing avoided emissions when switching from car to lower-carbon mode.',
    confidence: 'modelled',
    uncertainty: '±20% depending on vehicle age, fuel type, and occupancy'
  },

  // ── India Transport — Motorcycle Tailpipe ────────────────────────────────
  'india-motorcycle-tailpipe': {
    id: 'india-motorcycle-tailpipe',
    name: 'India Motorcycle Tailpipe CO₂ Emission Factor',
    source: 'NITI Aayog / MoRTH',
    sourceUrl: 'https://niti.gov.in/sites/default/files/2023-09/EV-Report.pdf',
    publicationYear: 2023,
    geography: 'India',
    methodology:
      'Average tailpipe CO₂ emission per km for a 100–125cc motorcycle in India ' +
      'based on ARAI certified fuel efficiency data.',
    factor: 0.065,
    unit: 'kgCO₂ per km',
    notes: 'Motorcycle tailpipe only. Used as avoided baseline when switching to cycling/walking.',
    confidence: 'modelled'
  },

  // ── India Transport — Bus ─────────────────────────────────────────────────
  'india-bus-tailpipe': {
    id: 'india-bus-tailpipe',
    name: 'India Bus Average CO₂ Emission Factor (per passenger-km)',
    source: 'NITI Aayog / IPCC Transport',
    sourceUrl: 'https://niti.gov.in/sites/default/files/2023-09/EV-Report.pdf',
    publicationYear: 2023,
    geography: 'India',
    methodology:
      'Average CO₂ emission per passenger-km for Indian city buses based on diesel fuel ' +
      'consumption and average occupancy of ~40 passengers.',
    factor: 0.039,
    unit: 'kgCO₂ per passenger-km',
    notes: 'Much lower per-passenger emissions than a single-occupancy car.',
    confidence: 'modelled'
  },

  // ── India Transport — Metro ────────────────────────────────────────────────
  'india-metro-grid': {
    id: 'india-metro-grid',
    name: 'India Metro Rail CO₂ Emission Factor (per passenger-km)',
    source: 'Delhi Metro Rail Corporation / CEA Grid Factor',
    sourceUrl: 'https://cea.nic.in/',
    publicationYear: 2024,
    geography: 'India (metro cities)',
    methodology:
      'Metro rail electricity consumption per passenger-km multiplied by India grid emission ' +
      'factor. Metro trains use grid electricity; CO₂ depends on grid mix.',
    factor: 0.031,
    unit: 'kgCO₂ per passenger-km',
    notes:
      'Lower than bus due to high occupancy and electrification. Will decrease as grid ' +
      'decarbonises.',
    confidence: 'modelled'
  },

  // ── India Transport — Auto-Rickshaw ──────────────────────────────────────
  'india-auto-tailpipe': {
    id: 'india-auto-tailpipe',
    name: 'India Auto-Rickshaw (3-wheeler) Tailpipe CO₂',
    source: 'NITI Aayog / MoRTH',
    sourceUrl: 'https://niti.gov.in/sites/default/files/2023-09/EV-Report.pdf',
    publicationYear: 2023,
    geography: 'India',
    methodology:
      'Average CO₂ emission per passenger-km for CNG/petrol auto-rickshaw in India ' +
      'with average occupancy of ~1.5 passengers.',
    factor: 0.062,
    unit: 'kgCO₂ per passenger-km',
    notes: 'CNG autos emit less than petrol equivalents.',
    confidence: 'modelled'
  },

  // ── Composting — Food Waste (EPA WARM v16) ────────────────────────────────
  'food-composting-warm16': {
    id: 'food-composting-warm16',
    name: 'Food Waste Composting GHG Benefit',
    source: 'US EPA Waste Reduction Model (WARM)',
    sourceUrl: 'https://www.epa.gov/warm',
    publicationYear: 2023,
    version: '16',
    geography: 'United States (WARM model)',
    methodology:
      'Net GHG benefit of composting food waste vs. landfill baseline. ' +
      'Composting avoids landfill methane emissions while soil amendment can sequester carbon.',
    factor: 0.19,
    unit: 'MTCO₂e per short ton',
    notes:
      'Food waste composting GHG factor from WARM v16. ' +
      'Methane avoidance is the primary GHG benefit. Soil carbon sequestration is additional ' +
      'but highly variable by location and practice.',
    confidence: 'modelled',
    uncertainty: '±25% (high variability in landfill gas capture rates)'
  },

  // ── Water — No universal CO₂ factor ──────────────────────────────────────
  'water-conservation-note': {
    id: 'water-conservation-note',
    name: 'Water Conservation — Primary Metric Only',
    source: 'US EPA WaterSense / Scientific Consensus',
    sourceUrl: 'https://www.epa.gov/watersense',
    publicationYear: 2023,
    geography: 'Context-dependent',
    methodology:
      'Water savings are measured directly in litres. Energy and CO₂ benefits of water ' +
      'conservation depend on local water treatment and delivery systems, which vary ' +
      'significantly. EPA WaterSense notes water-energy nexus but does not provide a ' +
      'universal CO₂-per-litre factor.',
    factor: 1.0,
    unit: 'litres per litre (direct measurement)',
    notes:
      'Primary metric is water saved (litres). Associated energy/CO₂ benefits are NOT ' +
      'calculated without local utility data. This is scientifically more honest.',
    confidence: 'measured'
  }
};

// ─── Helper: GHG calculation from WARM factors ───────────────────────────────

/**
 * Calculate GHG avoided (kgCO₂e) from recycling
 * @param massGrams Weight of material recycled in grams
 * @param warmGhgFactor MTCO₂e per short ton (from WARM v16)
 */
export function calcRecyclingGhg(massGrams: number, warmGhgFactor: number): number {
  // Convert: kgCO2e = grams * (warmGhgFactor * 1000) / 907185
  return massGrams * warmGhgFactor * WARM_GHG_TO_KG_PER_G;
}

/**
 * Calculate energy saved (kWh) from recycling
 * @param massGrams Weight of material recycled in grams
 * @param warmEnergyFactor MMBtu per short ton (from WARM v16)
 */
export function calcRecyclingEnergy(massGrams: number, warmEnergyFactor: number): number {
  // Convert: kWh = grams * (warmEnergyFactor * 293071) / 907185
  return massGrams * warmEnergyFactor * WARM_ENERGY_TO_KWH_PER_G;
}

/**
 * Calculate CO₂ avoided from electricity savings
 * @param kWh Electricity saved in kWh
 * @param factorKgPerKwh Grid emission factor (kgCO₂/kWh)
 */
export function calcElectricityCo2(kWh: number, factorKgPerKwh: number): number {
  return kWh * factorKgPerKwh;
}

/**
 * Calculate avoided CO₂ from transport mode switch
 * @param distanceKm Distance travelled in km
 * @param baselineFactor Baseline mode kgCO₂/km or kgCO₂/passenger-km
 * @param chosenFactor Chosen mode kgCO₂/km (0 for walk/cycle)
 */
export function calcTransportCo2Avoided(
  distanceKm: number,
  baselineFactor: number,
  chosenFactor: number = 0
): number {
  return distanceKm * Math.max(0, baselineFactor - chosenFactor);
}

/** Lookup a factor by ID (throws if not found) */
export function getFactor(id: string): EnvironmentalFactor {
  const f = ENVIRONMENTAL_FACTORS[id];
  if (!f) throw new Error(`Environmental factor not found: ${id}`);
  return f;
}

/** Safe lookup — returns undefined rather than throwing */
export function getFactorSafe(id: string): EnvironmentalFactor | undefined {
  return ENVIRONMENTAL_FACTORS[id];
}

// ─── Material → Factor ID mapping ───────────────────────────────────────────
export const RECYCLING_MATERIAL_FACTORS: Record<string, { ghgId: string; energyId: string; label: string }> = {
  PET:         { ghgId: 'pet-recycling-warm16',         energyId: 'pet-energy-warm16',         label: 'PET Plastic'         },
  Aluminum:    { ghgId: 'aluminum-recycling-warm16',    energyId: 'aluminum-energy-warm16',    label: 'Aluminum'            },
  Glass:       { ghgId: 'glass-recycling-warm16',       energyId: 'glass-energy-warm16',       label: 'Glass'               },
  HDPE:        { ghgId: 'hdpe-recycling-warm16',        energyId: 'pet-energy-warm16',         label: 'HDPE Plastic'        },
  Corrugated:  { ghgId: 'corrugated-recycling-warm16',  energyId: 'corrugated-energy-warm16',  label: 'Corrugated Cardboard' },
  Paper:       { ghgId: 'paper-recycling-warm16',       energyId: 'corrugated-energy-warm16',  label: 'Paper'               },
  Steel:       { ghgId: 'steel-recycling-warm16',       energyId: 'pet-energy-warm16',         label: 'Steel'               },
  EWaste:      { ghgId: 'pet-recycling-warm16',         energyId: 'pet-energy-warm16',         label: 'E-Waste'             },
};

// ─── Transport mode → factor + label ────────────────────────────────────────
export const TRANSPORT_MODE_FACTORS: Record<
  string,
  { factorId: string; factorKgPerKm: number; label: string; zeroTailpipe: boolean }
> = {
  walk:       { factorId: 'none',                  factorKgPerKm: 0,     label: 'Walking',          zeroTailpipe: true  },
  cycle:      { factorId: 'none',                  factorKgPerKm: 0,     label: 'Cycling',          zeroTailpipe: true  },
  bus:        { factorId: 'india-bus-tailpipe',    factorKgPerKm: 0.039, label: 'Bus',              zeroTailpipe: false },
  metro:      { factorId: 'india-metro-grid',      factorKgPerKm: 0.031, label: 'Metro Rail',       zeroTailpipe: false },
  motorcycle: { factorId: 'india-motorcycle-tailpipe', factorKgPerKm: 0.065, label: 'Motorcycle',  zeroTailpipe: false },
  auto:       { factorId: 'india-auto-tailpipe',   factorKgPerKm: 0.062, label: 'Auto-Rickshaw',   zeroTailpipe: false },
  car:        { factorId: 'india-car-tailpipe',    factorKgPerKm: 0.143, label: 'Petrol Car',       zeroTailpipe: false },
  ev:         { factorId: 'india-metro-grid',      factorKgPerKm: 0.031, label: 'Electric Vehicle', zeroTailpipe: true  },
};

// Baseline used for "avoided" calculation — car is the default motorized baseline
export const TRANSPORT_BASELINE_FACTOR_ID = 'india-car-tailpipe';
export const TRANSPORT_BASELINE_KG_PER_KM = 0.143;

export default ENVIRONMENTAL_FACTORS;
