import { ACTION_FACTORS, FREQUENCIES } from '../data/impactFactors';
import type { Frequency, SimResult, SimState } from '../types';

export function periodsFor(f: Frequency, months: number): number {
  switch (f) {
    case 'once':
      return 1;
    case 'weekly':
      return Math.round((months * 52) / 12);
    case 'monthly':
      return months;
    case 'daily':
      return Math.round((months * 365) / 12);
    default:
      return 1;
  }
}

/**
 * Deterministic calculation engine:
 * totalActions = people × frequencyMultiplier × durationMultiplier
 * collectiveImpact = totalActions × impactFactor
 */
export function calculate({ people, frequency, months }: SimState, actionId = 'bottle'): SimResult {
  const safePeople = Math.max(1, people);
  const periods = periodsFor(frequency, months);
  const totalActions = safePeople * periods;

  const factors = ACTION_FACTORS[actionId] ?? ACTION_FACTORS.bottle;
  const metrics = factors.map((f) => {
    const raw = totalActions * f.per;
    return {
      label: f.label,
      unit: f.unit,
      value: raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw),
      dp: raw < 10 && raw % 1 !== 0 ? 1 : 0
    };
  });

  const periodUnit = FREQUENCIES.find((x) => x.id === frequency)?.unit ?? 'periods';

  return {
    people: safePeople,
    periods,
    totalActions,
    periodUnit,
    metrics
  };
}

export const go = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -72;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
};
