import type {
  EnvironmentalContribution,
  UserActionRecord,
  ImpactMetricResult
} from '../types';

const STORAGE_KEY_CONTRIBUTIONS = 'one_effect_contributions_v2';
const STORAGE_KEY_HISTORY_LEGACY = 'one_effect_user_history';

// ─── Demo seed data ───────────────────────────────────────────────────────────
// Represents a realistic user who has been using the app for a month
export const INITIAL_DEMO_CONTRIBUTIONS: EnvironmentalContribution[] = [
  // Recycling — PET bottles
  ...Array.from({ length: 8 }, (_, i) => ({
    id: `demo_recycle_pet_${i}`,
    userId: 'demo_user',
    actionId: 'recycle-material',
    actionName: 'Recycle an item',
    category: 'Waste' as const,
    quantity: 12 + (i * 3),
    unit: 'grams',
    metadata: { material: 'PET' },
    verified: true,
    confidence: 0.95 + (i % 4) * 0.01,
    detectedItem: 'PET Bottle',
    impact: {
      wasteDivertedKg: (12 + i * 3) / 1000,
      co2eAvoidedKg: ((12 + i * 3) * 1.04 * 1000) / 907185,
      electricitySavedKwh: ((12 + i * 3) * 28.59 * 293071) / 907185 / 1000000
    },
    factorId: 'pet-recycling-warm16',
    factorVersion: '16',
    factorValue: 1.04,
    metricsSnapshot: [
      {
        type: 'wasteDivertedKg' as any,
        value: (12 + i * 3) / 1000,
        unit: 'kg',
        label: 'Material diverted',
        confidenceLevel: 'measured' as const
      },
      {
        type: 'co2eAvoided' as const,
        value: parseFloat((((12 + i * 3) * 1.04 * 1000) / 907185).toFixed(6)),
        unit: 'kg CO₂e',
        label: 'Estimated modeled GHG reduction',
        factorSource: 'US EPA WARM',
        factorVersion: '16',
        confidenceLevel: 'modelled' as const
      }
    ] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - (i * 2 + 1) * 24 * 3600 * 1000).toISOString(),
    dateLabel: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i * 2} days ago`
  })),

  // Recycling — Aluminum cans
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `demo_recycle_al_${i}`,
    userId: 'demo_user',
    actionId: 'recycle-material',
    actionName: 'Recycle an item',
    category: 'Waste' as const,
    quantity: 15,
    unit: 'grams',
    metadata: { material: 'Aluminum' },
    verified: true,
    confidence: 0.93,
    detectedItem: 'Aluminum Can',
    impact: {
      wasteDivertedKg: 0.015,
      co2eAvoidedKg: parseFloat(((15 * 9.13 * 1000) / 907185).toFixed(6)),
      electricitySavedKwh: parseFloat(((15 * 152.76 * 293071) / 907185 / 1000000).toFixed(5))
    },
    factorId: 'aluminum-recycling-warm16',
    factorVersion: '16',
    factorValue: 9.13,
    metricsSnapshot: [] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - (i * 3 + 5) * 24 * 3600 * 1000).toISOString(),
    dateLabel: `${i * 3 + 5} days ago`
  })),

  // Water savings
  ...Array.from({ length: 6 }, (_, i) => ({
    id: `demo_water_${i}`,
    userId: 'demo_user',
    actionId: 'save-water',
    actionName: 'Save water',
    category: 'Water' as const,
    quantity: 15 + i * 5,
    unit: 'litres',
    metadata: { action_type: i % 2 === 0 ? 'tap_off' : 'short_shower' },
    verified: true,
    confidence: 0.91,
    detectedItem: 'Water Tap',
    impact: { waterSavedLitres: 15 + i * 5 },
    factorId: 'water-conservation-note',
    metricsSnapshot: [
      {
        type: 'waterSaved' as const,
        value: 15 + i * 5,
        unit: 'litres',
        label: 'Water conserved',
        confidenceLevel: 'measured' as const
      }
    ] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - (i * 2 + 3) * 24 * 3600 * 1000).toISOString(),
    dateLabel: `${i * 2 + 3} days ago`
  })),

  // Electricity savings
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `demo_elec_${i}`,
    userId: 'demo_user',
    actionId: 'save-electricity',
    actionName: 'Save electricity',
    category: 'Energy' as const,
    quantity: 0.5 + i * 0.3,
    unit: 'kWh',
    metadata: { action_type: 'switched_off' },
    verified: true,
    confidence: 0.89,
    detectedItem: 'Electronic Device',
    impact: {
      electricitySavedKwh: 0.5 + i * 0.3,
      co2eAvoidedKg: parseFloat(((0.5 + i * 0.3) * 0.710).toFixed(4))
    },
    factorId: 'india-grid-fy2024-25',
    factorVersion: 'FY2024-25',
    factorValue: 0.710,
    metricsSnapshot: [
      {
        type: 'energySaved' as const,
        value: 0.5 + i * 0.3,
        unit: 'kWh',
        label: 'Electricity saved',
        confidenceLevel: 'measured' as const
      },
      {
        type: 'co2eAvoided' as const,
        value: parseFloat(((0.5 + i * 0.3) * 0.710).toFixed(4)),
        unit: 'kg CO₂',
        label: 'Estimated CO₂ avoided',
        factorSource: 'Central Electricity Authority / Government of India',
        confidenceLevel: 'measured' as const
      }
    ] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - (i * 3 + 4) * 24 * 3600 * 1000).toISOString(),
    dateLabel: `${i * 3 + 4} days ago`
  })),

  // Transport — cycling
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `demo_transport_${i}`,
    userId: 'demo_user',
    actionId: 'low-carbon-trip',
    actionName: 'Choose a lower-carbon trip',
    category: 'Transport' as const,
    quantity: 5 + i * 2,
    unit: 'km',
    metadata: { mode: i % 3 === 0 ? 'cycle' : i % 3 === 1 ? 'walk' : 'metro', occupancy: 1 },
    verified: true,
    confidence: 0.94,
    detectedItem: 'Bicycle / Metro',
    impact: {
      distanceShiftedKm: 5 + i * 2,
      co2eAvoidedKg: parseFloat(((5 + i * 2) * 0.143).toFixed(4))
    },
    factorId: 'india-car-tailpipe',
    factorValue: 0.143,
    metricsSnapshot: [] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - (i * 4 + 2) * 24 * 3600 * 1000).toISOString(),
    dateLabel: `${i * 4 + 2} days ago`
  })),

  // Nature — trees
  {
    id: 'demo_tree_1',
    userId: 'demo_user',
    actionId: 'plant-tree',
    actionName: 'Plant or tend a tree',
    category: 'Nature' as const,
    quantity: 2,
    unit: 'trees',
    metadata: { tree_type: 'native_tree', alive: 'yes' },
    verified: true,
    confidence: 0.92,
    detectedItem: 'Native Tree / Sapling',
    impact: { treesPlanted: 2 },
    factorId: 'none',
    metricsSnapshot: [
      {
        type: 'treesPlanted' as const,
        value: 2,
        unit: 'trees',
        label: 'Native trees planted',
        confidenceLevel: 'measured' as const
      }
    ] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString(),
    dateLabel: '10 days ago'
  },

  // Composting
  {
    id: 'demo_compost_1',
    userId: 'demo_user',
    actionId: 'compost-food',
    actionName: 'Compost food waste',
    category: 'Waste' as const,
    quantity: 1.5,
    unit: 'kg',
    metadata: { method: 'home_compost' },
    verified: true,
    confidence: 0.90,
    detectedItem: 'Food Waste / Compost Bin',
    impact: {
      wasteDivertedKg: 1.5,
      co2eAvoidedKg: parseFloat(((1500 * 0.19 * 1000) / 907185).toFixed(6))
    },
    factorId: 'food-composting-warm16',
    factorVersion: '16',
    factorValue: 0.19,
    metricsSnapshot: [] as ImpactMetricResult[],
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    dateLabel: '7 days ago'
  }
];

// ─── CRUD Operations ──────────────────────────────────────────────────────────

export async function getUserContributions(userId?: string): Promise<EnvironmentalContribution[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTRIBUTIONS);
    if (raw) {
      const parsed = JSON.parse(raw) as EnvironmentalContribution[];
      return parsed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    // Seed with demo data on first load
    localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(INITIAL_DEMO_CONTRIBUTIONS));
    return INITIAL_DEMO_CONTRIBUTIONS;
  } catch {
    return INITIAL_DEMO_CONTRIBUTIONS;
  }
}

export async function saveContribution(
  contribution: Omit<EnvironmentalContribution, 'id' | 'createdAt'>
): Promise<EnvironmentalContribution> {
  const current = await getUserContributions(contribution.userId);

  const newRecord: EnvironmentalContribution = {
    ...contribution,
    id: `contribution_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    dateLabel: 'Just now'
  };

  const updated = [newRecord, ...current];
  localStorage.setItem(STORAGE_KEY_CONTRIBUTIONS, JSON.stringify(updated));
  return newRecord;
}

// ─── Legacy compatibility — getUserHistory ────────────────────────────────────
// Maps EnvironmentalContribution → UserActionRecord for backward compat
export async function getUserHistory(userId?: string): Promise<UserActionRecord[]> {
  const contributions = await getUserContributions(userId);
  return contributions.map(contributionToRecord);
}

export function contributionToRecord(c: EnvironmentalContribution): UserActionRecord {
  return {
    id: c.id,
    userId: c.userId,
    actionId: c.actionId,
    actionName: c.actionName,
    category: c.category,
    imageUrl: c.imageUrl,
    detectedItem: c.detectedItem || c.actionName,
    material: (c.metadata?.material as string) || undefined,
    confidence: c.confidence ?? 0.9,
    impactValue: c.quantity,
    impactUnit: c.unit,
    verified: c.verified,
    createdAt: c.createdAt,
    dateLabel: c.dateLabel,
    quantity: c.quantity,
    unit: c.unit,
    metadata: c.metadata,
    metricsSnapshot: c.metricsSnapshot
  };
}

// ─── Legacy saveUserAction ────────────────────────────────────────────────────
export async function saveUserAction(
  action: Omit<UserActionRecord, 'id' | 'createdAt'>
): Promise<UserActionRecord> {
  const contribution: Omit<EnvironmentalContribution, 'id' | 'createdAt'> = {
    userId: action.userId,
    actionId: action.actionId,
    actionName: action.actionName,
    category: action.category,
    quantity: action.quantity ?? action.impactValue ?? 1,
    unit: action.unit ?? action.impactUnit ?? 'action',
    metadata: action.metadata ?? {},
    verified: action.verified,
    confidence: action.confidence,
    detectedItem: action.detectedItem,
    impact: {},
    imageUrl: action.imageUrl,
    metricsSnapshot: action.metricsSnapshot
  };

  const saved = await saveContribution(contribution);
  return contributionToRecord(saved);
}

// ─── Stats computation ────────────────────────────────────────────────────────

export interface UserStats {
  totalActions: number;
  wasteActions: number;
  waterActions: number;
  energyActions: number;
  transportActions: number;
  natureActions: number;
  // Aggregated impact totals — computed from stored impact snapshots
  totalWasteDivertedKg: number;
  totalWaterSavedL: number;
  totalEnergySavedKwh: number;
  totalCo2eAvoidedKg: number;
  totalDistanceShiftedKm: number;
  totalTreesPlanted: number;
  totalAreaRestoredM2: number;
}

export function computeStatsFromContributions(
  contributions: EnvironmentalContribution[]
): UserStats {
  const stats: UserStats = {
    totalActions: contributions.length,
    wasteActions: 0,
    waterActions: 0,
    energyActions: 0,
    transportActions: 0,
    natureActions: 0,
    totalWasteDivertedKg: 0,
    totalWaterSavedL: 0,
    totalEnergySavedKwh: 0,
    totalCo2eAvoidedKg: 0,
    totalDistanceShiftedKm: 0,
    totalTreesPlanted: 0,
    totalAreaRestoredM2: 0
  };

  for (const c of contributions) {
    // Category counts
    if (c.category === 'Waste') stats.wasteActions++;
    else if (c.category === 'Water') stats.waterActions++;
    else if (c.category === 'Energy') stats.energyActions++;
    else if (c.category === 'Transport') stats.transportActions++;
    else if (c.category === 'Nature') stats.natureActions++;

    // Impact totals from stored snapshot
    const impact = c.impact || {};
    stats.totalWasteDivertedKg += impact.wasteDivertedKg ?? 0;
    stats.totalWaterSavedL += impact.waterSavedLitres ?? 0;
    stats.totalEnergySavedKwh += impact.electricitySavedKwh ?? 0;
    stats.totalCo2eAvoidedKg += impact.co2eAvoidedKg ?? 0;
    stats.totalDistanceShiftedKm += impact.distanceShiftedKm ?? 0;
    stats.totalTreesPlanted += impact.treesPlanted ?? 0;
    stats.totalAreaRestoredM2 += impact.areaRestoredM2 ?? 0;
  }

  // Round totals
  stats.totalWasteDivertedKg = parseFloat(stats.totalWasteDivertedKg.toFixed(4));
  stats.totalWaterSavedL = parseFloat(stats.totalWaterSavedL.toFixed(2));
  stats.totalEnergySavedKwh = parseFloat(stats.totalEnergySavedKwh.toFixed(4));
  stats.totalCo2eAvoidedKg = parseFloat(stats.totalCo2eAvoidedKg.toFixed(4));
  stats.totalDistanceShiftedKm = parseFloat(stats.totalDistanceShiftedKm.toFixed(2));

  return stats;
}

// Legacy compat
export function computeStatsFromHistory(history: UserActionRecord[]): UserStats {
  const basicStats: UserStats = {
    totalActions: history.length,
    wasteActions: 0,
    waterActions: 0,
    energyActions: 0,
    transportActions: 0,
    natureActions: 0,
    totalWasteDivertedKg: 0,
    totalWaterSavedL: 0,
    totalEnergySavedKwh: 0,
    totalCo2eAvoidedKg: 0,
    totalDistanceShiftedKm: 0,
    totalTreesPlanted: 0,
    totalAreaRestoredM2: 0
  };

  for (const item of history) {
    if (item.category === 'Waste') basicStats.wasteActions++;
    else if (item.category === 'Water') basicStats.waterActions++;
    else if (item.category === 'Energy') basicStats.energyActions++;
    else if (item.category === 'Transport') basicStats.transportActions++;
    else if (item.category === 'Nature') basicStats.natureActions++;
  }

  return basicStats;
}

// ─── Community mock data ──────────────────────────────────────────────────────
// Simulates aggregated community contributions for the community dashboard

export interface CommunityStats {
  contributorCount: number;
  totalWasteDivertedKg: number;
  totalWaterSavedL: number;
  totalEnergySavedKwh: number;
  totalCo2eAvoidedKg: number;
  totalDistanceShiftedKm: number;
  totalTreesPlanted: number;
  totalAreaRestoredM2: number;
  thisWeek: {
    wasteDivertedKg: number;
    waterSavedL: number;
    energySavedKwh: number;
    co2eAvoidedKg: number;
    distanceShiftedKm: number;
    treesPlanted: number;
  };
}

export function getCommunityStats(userStats: UserStats): CommunityStats {
  // Simulated community data — in production, this would come from an aggregation API
  // that provides city-level anonymized totals
  const multiplier = 128; // 128 community members

  return {
    contributorCount: multiplier,
    totalWasteDivertedKg: parseFloat((userStats.totalWasteDivertedKg * multiplier * 0.7 + 480).toFixed(1)),
    totalWaterSavedL: parseFloat((userStats.totalWaterSavedL * multiplier * 0.7 + 12400).toFixed(0)),
    totalEnergySavedKwh: parseFloat((userStats.totalEnergySavedKwh * multiplier * 0.7 + 1840).toFixed(1)),
    totalCo2eAvoidedKg: parseFloat((userStats.totalCo2eAvoidedKg * multiplier * 0.7 + 340).toFixed(2)),
    totalDistanceShiftedKm: parseFloat((userStats.totalDistanceShiftedKm * multiplier * 0.7 + 1240).toFixed(0)),
    totalTreesPlanted: Math.round(userStats.totalTreesPlanted * multiplier * 0.5 + 42),
    totalAreaRestoredM2: parseFloat((userStats.totalAreaRestoredM2 * multiplier * 0.5 + 280).toFixed(0)),
    thisWeek: {
      wasteDivertedKg: 42.8,
      waterSavedL: 1840,
      energySavedKwh: 218,
      co2eAvoidedKg: 38.6,
      distanceShiftedKm: 342,
      treesPlanted: 4
    }
  };
}
