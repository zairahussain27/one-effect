import React from 'react';
import { motion } from 'framer-motion';
import { useImpact } from '../context/ImpactContext';
import { ACTIONS } from '../data/actions';
import { DURATIONS, FREQUENCIES, DISCLAIMER } from '../data/impactFactors';
import { AnimatedNumber } from '../components/WhatIfSimulator';
import { Scene, tierOf } from '../components/ImpactVisualization';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

export default function Simulator() {
  const {
    selectedActionId,
    setSelectedActionId,
    selectedAction,
    sim,
    simResult,
    setPeople,
    setFrequency,
    setMonths
  } = useImpact();

  const pos = Math.log10(Math.max(1, sim.people));
  const currentFreq = FREQUENCIES.find((f) => f.id === sim.frequency) || FREQUENCIES[1];
  const tier = tierOf(sim.people);
  const tierNames = ['A single seed', 'A patch of sprouts', 'A growing garden', 'A thriving ecosystem'];

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">COLLECTIVE SIMULATOR / 04</span>
          <h1>What if everyone did it?</h1>
          <p className="lead">
            Change the number of people. Change the frequency. Change the time. Watch the collective effect grow.
          </p>
        </motion.div>

        {/* Action Switcher */}
        <div className="action-selector-card">
          <div className="action-selector-header">
            <span className="label">STEP 1: SELECT BEHAVIOR TO MODEL</span>
            <span className="action-selector-count">{ACTIONS.length} sustainable actions</span>
          </div>
          <div className="action-pill-selector">
            {ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`pill-btn ${a.id === selectedActionId ? 'active' : ''}`}
                onClick={() => setSelectedActionId(a.id)}
              >
                <span className="pill-icon">{a.icon}</span>
                <span className="pill-name">{a.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulator Controls & Equation */}
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
            <div className="eq-header">
              <span className="label">THE COLLECTIVE EQUATION</span>
              <span className="eq-live-tag">LIVE PROJECTION</span>
            </div>

            <div className="equation-steps">
              <div className="eq-step-card">
                <span className="eq-step-val">{simResult.people.toLocaleString()}</span>
                <span className="eq-step-unit">{simResult.people === 1 ? 'person' : 'people'}</span>
              </div>
              <span className="eq-operator">×</span>
              <div className="eq-step-card">
                <span className="eq-step-val">1</span>
                <span className="eq-step-unit">action / {currentFreq.per}</span>
              </div>
              <span className="eq-operator">×</span>
              <div className="eq-step-card">
                <span className="eq-step-val">{simResult.periods.toLocaleString()}</span>
                <span className="eq-step-unit">{simResult.periodUnit}</span>
              </div>
            </div>

            <div className="eq-divider-row">
              <div className="eq-line" />
              <span className="eq-equals">=</span>
              <div className="eq-line" />
            </div>

            <div className="eq-result-showcase">
              <b className="num huge eq-total-num">
                <AnimatedNumber value={simResult.totalActions} />
              </b>
              <div className="eq-result-badge">
                <span>🌱 COLLECTIVE ACTIONS COMPLETED</span>
              </div>
            </div>

            {simResult.metrics.length > 0 && (
              <div className="eq-projected-impacts">
                <span className="eq-proj-title">PROJECTED ENVIRONMENTAL EFFECT</span>
                <div className="eq-impact-chips-row">
                  {simResult.metrics.slice(0, 3).map((m) => (
                    <div key={m.label} className="eq-impact-chip">
                      <b className="eq-chip-val">
                        <AnimatedNumber value={m.value} dp={m.dp} /> <small>{m.unit}</small>
                      </b>
                      <span className="eq-chip-lbl">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visual Nature Growth & Metrics Panel */}
        <div className="viz" style={{ marginTop: 28 }}>
          <div className="scene">
            <span className="label">
              {simResult.people.toLocaleString()} {simResult.people === 1 ? 'PERSON' : 'PEOPLE'} → THE ENVIRONMENT GROWS
            </span>
            <Scene people={simResult.people} />
            <motion.b key={tier} className="tier" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {tierNames[tier]}
            </motion.b>
          </div>

          <div className="panel">
            <div>
              <b className="num">
                <AnimatedNumber value={simResult.totalActions} />
              </b>
              <span className="label">COLLECTIVE ACTIONS</span>
            </div>

            {simResult.metrics.map((m) => (
              <div key={m.label}>
                <b className="num">
                  <AnimatedNumber value={m.value} dp={m.dp} /> {m.unit}*
                </b>
                <span className="label">{m.label}</span>
              </div>
            ))}

            <small>
              {DISCLAIMER} Based on: {selectedAction.sentence.toLowerCase()}.
            </small>
          </div>
        </div>
      </main>
    </div>
  );
}
