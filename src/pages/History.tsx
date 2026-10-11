import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import type { ImpactMetricResult } from '../types';

// Format a metric value for display
function fmtMetricValue(m: ImpactMetricResult): string {
  if (m.value >= 1) return m.value.toFixed(2);
  if (m.value >= 0.001) return m.value.toFixed(5);
  return '< 0.001';
}

export default function History() {
  const { history, contributions, stats } = useImpact();
  const [filter, setFilter] = useState<string>('all');

  const filteredHistory = history.filter((item) => {
    if (filter === 'all') return true;
    return item.category.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="page-header-row"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="label">PERSONAL CHRONOLOGY</span>
            <h1>Your Journey</h1>
            <p className="lead">
              A verifiable log of every environmental action — with actual quantities and calculated impact.
            </p>
          </div>

          <Link to="/actions" className="btn btn-primary btn-sm">
            + Log New Action
          </Link>
        </motion.div>

        {/* Milestone Bar — dynamic from actual data */}
        <div className="history-milestones-bar">
          <div className="milestone-box">
            <b>{stats.totalActions}</b>
            <span className="label">TOTAL ACTIONS</span>
          </div>
          {stats.totalWasteDivertedKg > 0 && (
            <div className="milestone-box">
              <b>{stats.totalWasteDivertedKg.toFixed(3)} kg</b>
              <span className="label">WASTE DIVERTED</span>
            </div>
          )}
          {stats.totalWaterSavedL > 0 && (
            <div className="milestone-box">
              <b>{stats.totalWaterSavedL.toFixed(1)} L</b>
              <span className="label">WATER SAVED</span>
            </div>
          )}
          {stats.totalEnergySavedKwh > 0 && (
            <div className="milestone-box">
              <b>{stats.totalEnergySavedKwh.toFixed(3)} kWh</b>
              <span className="label">ENERGY SAVED</span>
            </div>
          )}
          {stats.totalCo2eAvoidedKg > 0 && (
            <div className="milestone-box">
              <b>{stats.totalCo2eAvoidedKg.toFixed(3)} kg</b>
              <span className="label">CO₂e AVOIDED*</span>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="seg" style={{ margin: '24px 0 28px' }}>
          {['all', 'waste', 'water', 'energy', 'transport', 'nature'].map((f) => (
            <button
              key={f}
              type="button"
              className={filter === f ? 'on' : ''}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Timeline List */}
        <motion.div
          className="history-timeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          {filteredHistory.map((item, idx) => {
            const contrib = contributions.find(c => c.id === item.id);
            const metrics = item.metricsSnapshot || contrib?.metricsSnapshot || [];

            return (
              <motion.div
                key={item.id || idx}
                className="history-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.5) }}
              >
                <div className="history-icon-col">
                  <span className="history-icon">
                    {item.category === 'Waste' ? '♻️'
                      : item.category === 'Water' ? '💧'
                      : item.category === 'Energy' ? '⚡'
                      : item.category === 'Transport' ? '🚲'
                      : '🌱'}
                  </span>
                  <span className="history-line" />
                </div>

                <div className="history-body">
                  <div className="history-top-row">
                    <b>{item.detectedItem || item.actionName}</b>
                    <span className="history-date">
                      {item.dateLabel || new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="history-sub-row">
                    <span className="history-action-text">{item.actionName}</span>
                    <span className="verified-pill">
                      ✓ Verified ({Math.round((item.confidence ?? 0.9) * 100)}%)
                    </span>
                  </div>

                  {/* Quantity */}
                  {item.quantity && item.unit && (
                    <div className="history-quantity-row">
                      <span className="quantity-badge">
                        {item.quantity} {item.unit}
                      </span>
                      {item.metadata?.material && (
                        <span className="material-badge">{item.metadata.material as string}</span>
                      )}
                      {item.metadata?.mode && (
                        <span className="material-badge">{item.metadata.mode as string}</span>
                      )}
                    </div>
                  )}

                  {/* Impact metrics from snapshot */}
                  {metrics.length > 0 && (
                    <div className="history-metrics-row">
                      {metrics.slice(0, 3).map((m, mi) => (
                        <span key={mi} className="history-metric-chip">
                          {fmtMetricValue(m)} {m.unit}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filteredHistory.length === 0 && (
            <div className="empty-history-box">
              <p>No actions logged in this category yet.</p>
              <Link to="/actions" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                Log your first {filter} action
              </Link>
            </div>
          )}
        </motion.div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <small style={{ color: 'var(--sage)' }}>
            * Estimated modeled values from documented research factors.{' '}
            <Link to="/sources" className="link" style={{ fontSize: 'inherit' }}>
              View methodology →
            </Link>
          </small>
        </div>
      </main>
    </div>
  );
}
