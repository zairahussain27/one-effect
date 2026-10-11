import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { useImpact } from '../context/ImpactContext';
import { DURATIONS, FREQUENCIES } from '../data/impactFactors';
import type { Frequency } from '../types';

export function AnimatedNumber({ value, dp = 0 }: { value: number; dp?: number }) {
  const [n, setN] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const c = animate(prev.current, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (v) => {
        prev.current = v;
        setN(Number(v.toFixed(dp)));
      }
    });
    return () => c.stop();
  }, [value, dp]);

  return <>{n.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp })}</>;
}

export default function WhatIfSimulator() {
  const { sim, simResult, setPeople, setFrequency, setMonths } = useImpact();

  const pos = Math.log10(Math.max(1, sim.people));
  const currentFreq = FREQUENCIES.find((f) => f.id === sim.frequency) || FREQUENCIES[1];

  return (
    <section id="what-if" className="section wrap">
      <p className="label">THE EFFECT / 03</p>
      <h2>What if everyone did it?</h2>
      <p className="lead">
        Change the number of people. Change the frequency. Change the time. Watch the collective effect grow.
      </p>

      <div className="sim">
        <div className="controls">
          <div>
            <span className="label">PEOPLE PARTICIPATING</span>
            <b className="num">
              {sim.people.toLocaleString()} <small>{sim.people === 1 ? 'person' : 'people'}</small>
            </b>
            <input
              type="range"
              min={0}
              max={4}
              step={0.01}
              value={pos}
              aria-label="Number of people"
              style={{ ['--p' as string]: `${(pos / 4) * 100}%` }}
              onChange={(e) => {
                const val = Math.max(1, Math.round(10 ** Number(e.target.value)));
                setPeople(val);
              }}
            />
            <div className="ticks">
              <span>1 person</span>
              <span>100</span>
              <span>1,000</span>
              <span>10,000</span>
            </div>

            {/* Quick Presets */}
            <div className="preset-buttons">
              {[1, 100, 1000, 10000].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`btn-preset ${sim.people === p ? 'active' : ''}`}
                  onClick={() => setPeople(p)}
                >
                  {p.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label">FREQUENCY</span>
            <div className="seg">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={sim.frequency === f.id ? 'on' : ''}
                  onClick={() => setFrequency(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="label">DURATION</span>
            <div className="seg">
              {DURATIONS.map((d) => (
                <button
                  key={d.months}
                  type="button"
                  className={sim.months === d.months ? 'on' : ''}
                  onClick={() => setMonths(d.months)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="equation">
          <span className="label">
            {simResult.people.toLocaleString()} {simResult.people === 1 ? 'PERSON' : 'PEOPLE'}
          </span>
          <i>×</i>
          <span className="label">1 ACTION / {currentFreq.per}</span>
          <i>×</i>
          <span className="label">
            {simResult.periods.toLocaleString()} {simResult.periodUnit.toUpperCase()}
          </span>
          <hr />
          <b className="num huge">
            <AnimatedNumber value={simResult.totalActions} />
          </b>
          <span className="label">COLLECTIVE ACTIONS</span>
        </div>
      </div>
    </section>
  );
}
