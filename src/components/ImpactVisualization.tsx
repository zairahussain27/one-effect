import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AnimatedNumber } from './WhatIfSimulator';
import { DISCLAIMER } from '../data/impactFactors';
import { useImpact } from '../context/ImpactContext';
import type { Action, SimResult } from '../types';

export const tierOf = (people: number) => (people <= 1 ? 0 : people <= 100 ? 1 : people <= 1000 ? 2 : 3);
const TIER_NAMES = ['A single seed', 'A patch of sprouts', 'A growing garden', 'A thriving ecosystem'];
const countOf = (p: number) => (p <= 1 ? 1 : Math.min(60, Math.round(Math.log10(p) * 14)));
const GREENS = ['#1F4D36', '#2F7048', '#3E8E5A', '#6FAA7A'];
const BOX = { transformBox: 'fill-box', transformOrigin: '50% 100%' } as const;

function Plant({ i, tier, x, y }: { i: number; tier: number; x: number; y: number }) {
  const h = [12, 30, 48, 88][tier] * (0.7 + ((i * 37) % 30) / 100);
  const c = GREENS[i % 4];
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1, delay: Math.min(i * 0.025, 0.8), ease: 'easeOut' }}
      style={BOX}
    >
      <motion.g
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: 'easeInOut' }}
        style={BOX}
      >
        {tier === 3 ? (
          <>
            <rect x={x - 3} y={y - h * 0.5} width="6" height={h * 0.5} rx="3" fill="#6B5A3E" />
            <circle cx={x} cy={y - h * 0.65} r={h * 0.32} fill={c} />
            <circle cx={x - h * 0.2} cy={y - h * 0.5} r={h * 0.22} fill={GREENS[(i + 1) % 4]} />
            <circle cx={x + h * 0.2} cy={y - h * 0.5} r={h * 0.22} fill={GREENS[(i + 2) % 4]} />
          </>
        ) : (
          <>
            <path
              d={`M${x} ${y} Q${x + 3} ${y - h / 2} ${x} ${y - h}`}
              stroke={c}
              strokeWidth={tier === 0 ? 3 : 2.5}
              fill="none"
              strokeLinecap="round"
            />
            {tier === 0 && <ellipse cx={x} cy={y + 2} rx="9" ry="5" fill="#8B6F47" />}
            <ellipse
              cx={x - 7}
              cy={y - h * 0.7}
              rx="8"
              ry="4"
              fill={c}
              transform={`rotate(-30 ${x - 7} ${y - h * 0.7})`}
            />
            <ellipse
              cx={x + 7}
              cy={y - h * 0.5}
              rx="8"
              ry="4"
              fill={GREENS[(i + 1) % 4]}
              transform={`rotate(30 ${x + 7} ${y - h * 0.5})`}
            />
            {tier === 2 && i % 3 === 0 && <circle cx={x} cy={y - h - 3} r="4.5" fill="#F2C94C" />}
          </>
        )}
      </motion.g>
    </motion.g>
  );
}

export function Scene({ people, count, height = 280 }: { people: number; count?: number; height?: number }) {
  const tier = tierOf(people);
  const n = count ?? countOf(people);
  const plants = Array.from({ length: n }, (_, i) => ({
    i,
    x: n === 1 ? 300 : 40 + ((i * 137.5) % 520),
    y: n === 1 ? 232 : 205 + ((i * 53) % 40)
  })).sort((a, b) => a.y - b.y);

  return (
    <svg viewBox="0 0 600 280" style={{ width: '100%', height }} role="img" aria-label={TIER_NAMES[tier]}>
      <defs>
        <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE3C8" />
          <stop offset="1" stopColor="#A9C4A0" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="500"
        cy="60"
        r="26"
        fill="#F2C94C"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <path d="M0 225 Q150 200 300 222 T600 215 V280 H0Z" fill="url(#gr)" />
      <AnimatePresence>
        {plants.map((p) => (
          <Plant key={p.i} {...p} tier={tier} />
        ))}
      </AnimatePresence>
    </svg>
  );
}

interface ImpactVisualizationProps {
  result?: SimResult;
  action?: Action;
}

export default function ImpactVisualization(props: ImpactVisualizationProps) {
  const context = useImpact();
  const result = props.result || context.simResult;
  const action = props.action || context.selectedAction;
  const tier = tierOf(result.people);

  return (
    <section className="section wrap viz">
      <div className="scene">
        <span className="label">
          {result.people.toLocaleString()} {result.people === 1 ? 'PERSON' : 'PEOPLE'} → THE ENVIRONMENT GROWS
        </span>
        <Scene people={result.people} />
        <motion.b key={tier} className="tier" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {TIER_NAMES[tier]}
        </motion.b>
      </div>

      <div className="panel">
        <div>
          <b className="num">
            <AnimatedNumber value={result.totalActions} />
          </b>
          <span className="label">COLLECTIVE ACTIONS</span>
        </div>

        {result.metrics.map((m) => (
          <div key={m.label}>
            <b className="num">
              <AnimatedNumber value={m.value} dp={m.dp} /> {m.unit}*
            </b>
            <span className="label">{m.label}</span>
          </div>
        ))}

        <small>
          {DISCLAIMER} Based on: {action.sentence.toLowerCase()}.
        </small>
      </div>
    </section>
  );
}
