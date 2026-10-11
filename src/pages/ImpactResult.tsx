import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import ImagePreview from '../components/ImagePreview';
import * as actionService from '../services/actionService';
import type { ImpactMetricResult } from '../types';


// ─── Metric icon mapping ──────────────────────────────────────────────────────
const METRIC_ICONS: Record<string, string> = {
  wasteDivertedKg: '♻️',
  co2eAvoided: '🌍',
  energySaved: '⚡',
  waterSaved: '💧',
  distanceShifted: '🚲',
  treesPlanted: '🌱',
  areaRestored: '🌿'
};

const METRIC_COLORS: Record<string, string> = {
  wasteDivertedKg: 'var(--green)',
  co2eAvoided: 'var(--teal, #4ecdc4)',
  energySaved: 'var(--amber, #f7b731)',
  waterSaved: 'var(--blue, #3498db)',
  distanceShifted: 'var(--sage)',
  treesPlanted: 'var(--green)',
  areaRestored: 'var(--sage)'
};

// ─── MethodologyPanel ─────────────────────────────────────────────────────────
function MethodologyPanel({ metric }: { metric: ImpactMetricResult }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="methodology-inline">
      <button
        type="button"
        className="methodology-toggle-btn"
        onClick={() => setOpen((v) => !v)}
      >
        ⓘ How was this calculated?
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="methodology-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {metric.methodologyNote && (
              <p className="methodology-note">{metric.methodologyNote}</p>
            )}
            {metric.factorId && (
              <div className="methodology-row">
                <span className="label">Factor</span>
                <span>{metric.factorValue} {metric.factorUnit}</span>
              </div>
            )}
            {metric.factorSource && (
              <div className="methodology-row">
                <span className="label">Source</span>
                <span>{metric.factorSource}</span>
              </div>
            )}
            {metric.factorVersion && (
              <div className="methodology-row">
                <span className="label">Version</span>
                <span>{metric.factorVersion}</span>
              </div>
            )}
            {metric.confidenceLevel && (
              <div className="methodology-row">
                <span className="label">Confidence</span>
                <span className={`confidence-badge ${metric.confidenceLevel}`}>
                  {metric.confidenceLevel}
                </span>
              </div>
            )}
            <Link to="/sources" className="link" style={{ fontSize: '0.8rem', marginTop: 8, display: 'inline-block' }}>
              View full methodology →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────
function MetricCard({ metric }: { metric: ImpactMetricResult }) {
  const icon = METRIC_ICONS[metric.type] || '📊';
  const color = METRIC_COLORS[metric.type] || 'var(--green)';

  const displayValue = metric.value >= 0.001
    ? (metric.value >= 1 ? metric.value.toFixed(2) : metric.value.toFixed(5))
    : '< 0.001';

  return (
    <motion.div
      className="impact-metric-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="metric-header">
        <span className="metric-icon">{icon}</span>
        <span className="label" style={{ color }}>{metric.label.toUpperCase()}</span>
      </div>

      <div className="metric-value-row">
        <b className="metric-num" style={{ color }}>
          {displayValue}
        </b>
        <span className="metric-unit">{metric.unit}</span>
      </div>

      {metric.description && (
        <small className="metric-description">{metric.description}</small>
      )}

      <MethodologyPanel metric={metric} />
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ImpactResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedAction,
    uploadedImage,
    stats,
    isCurrentActionSaved,
    saveCurrentActionToJourney,
    pendingImpactResult,
    quantity,
    actionMetadata,
    contributions
  } = useImpact();

  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(isCurrentActionSaved);

  // Dynamic community stats — never hardcoded
  const communityStats = actionService.getCommunityStats(stats);

  // Use pending impact result if available (calculated before save)
  const impactResult = pendingImpactResult;

  const handleSaveToJourney = async () => {
    if (justSaved || isCurrentActionSaved) {
      navigate('/history');
      return;
    }
    setSaving(true);
    try {
      await saveCurrentActionToJourney(user?.id || 'anonymous');
      setJustSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const materialLabel = (actionMetadata.material as string) || 'material';
  const modeLabel = (actionMetadata.mode as string) || '';

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="impact-result-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="page-header" style={{ marginBottom: 20 }}>
            <span className="label">PERSONAL IMPACT / 03</span>
            <h1>Your Action is Verified 🌱</h1>
            <p className="lead">
              You completed: <b>{selectedAction.name}</b>
              {quantity && (
                <> — <b>{quantity} {selectedAction.inputSchema.find(f => f.id === 'quantity')?.unit || ''}</b></>
              )}
            </p>
          </div>

          <div className="impact-grid-stage">
            {/* Image preview */}
            {uploadedImage && (
              <div className="impact-img-box">
                <ImagePreview imageSrc={uploadedImage} altText={selectedAction.name} />
              </div>
            )}

            {/* Impact calculation result */}
            <div className="impact-calc-box">
              {impactResult ? (
                <>
                  {/* Metrics */}
                  <div className="label" style={{ marginBottom: 12 }}>YOUR ENVIRONMENTAL CONTRIBUTION</div>

                  <div className="impact-metrics-list">
                    {impactResult.metrics.map((metric, idx) => (
                      <MetricCard key={`${metric.type}-${idx}`} metric={metric} />
                    ))}
                  </div>

                  {/* Caveats */}
                  {impactResult.caveats && impactResult.caveats.length > 0 && (
                    <div className="caveats-box">
                      <span className="label">📝 SCIENTIFIC NOTES</span>
                      <ul className="caveats-list">
                        {impactResult.caveats.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                /* Fallback when no calculation data yet (e.g. jumped to result page) */
                <div className="impact-stat-highlight">
                  <span className="label">YOUR CONTRIBUTION</span>
                  <b className="num big" style={{ color: 'var(--green)' }}>+1</b>
                  <span className="unit-label">VERIFIED ENVIRONMENTAL ACTION</span>
                </div>
              )}

              {/* Total actions milestone */}
              <div className="impact-milestone-box" style={{ marginTop: 20 }}>
                <p>You have now completed:</p>
                <b className="num" style={{ fontSize: '2.5rem' }}>
                  {stats.totalActions}
                </b>
                <span className="label">TOTAL VERIFIED ACTIONS IN YOUR JOURNEY</span>
              </div>

              {/* CTA */}
              <div className="row" style={{ marginTop: 16, gap: 12, flexWrap: 'wrap' }}>
                {!justSaved && !isCurrentActionSaved ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={handleSaveToJourney}
                  >
                    {saving ? 'Saving…' : 'Add to My Journey →'}
                  </button>
                ) : (
                  <div className="saved-badge-row">
                    <span className="tick-badge">✓ Added to your journey</span>
                    <Link to="/history" className="btn btn-primary btn-sm">
                      View Timeline
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <hr className="divider" style={{ margin: '36px 0 28px' }} />

          {/* Community transition */}
          <div className="what-if-teaser-box">
            <span className="label">THE BIGGER PICTURE</span>
            <h2>You're part of something larger.</h2>
            <p className="lead" style={{ margin: '8px 0 20px' }}>
              Your action is verified and personal.
              <br />
              <b>{communityStats.contributorCount} people near you are already contributing too.</b>
            </p>
            <div className="row" style={{ gap: 12 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/community')}
              >
                See Your Community's Effect →
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/simulator')}
              >
                What If Everyone? →
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <small style={{ color: 'var(--green)', opacity: 0.8 }}>
              Every metric comes from a documented research factor.{' '}
              <Link to="/sources" className="link" style={{ fontSize: 'inherit' }}>
                View sources →
              </Link>
            </small>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
