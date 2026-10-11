import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import { Scene } from '../components/ImpactVisualization';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, history, resetSession, contributions } = useImpact();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Dynamic name — always from authenticated user profile
  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'there';

  const recentHistory = history.slice(0, 4);

  // Category summary data derived dynamically from stats
  const categorySummary = [
    {
      icon: '♻️',
      label: 'Waste',
      count: stats.wasteActions,
      metric: stats.totalWasteDivertedKg > 0
        ? `${stats.totalWasteDivertedKg.toFixed(3)} kg diverted`
        : null
    },
    {
      icon: '💧',
      label: 'Water',
      count: stats.waterActions,
      metric: stats.totalWaterSavedL > 0
        ? `${stats.totalWaterSavedL.toFixed(1)} L saved`
        : null
    },
    {
      icon: '⚡',
      label: 'Energy',
      count: stats.energyActions,
      metric: stats.totalEnergySavedKwh > 0
        ? `${stats.totalEnergySavedKwh.toFixed(3)} kWh saved`
        : null
    },
    {
      icon: '🚲',
      label: 'Transport',
      count: stats.transportActions,
      metric: stats.totalDistanceShiftedKm > 0
        ? `${stats.totalDistanceShiftedKm.toFixed(1)} km shifted`
        : null
    },
    {
      icon: '🌱',
      label: 'Nature',
      count: stats.natureActions,
      metric: stats.totalTreesPlanted > 0
        ? `${stats.totalTreesPlanted} trees`
        : null
    }
  ];

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        {/* Welcome Header */}
        <motion.div
          className="dashboard-hero"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="dash-greeting">
            <span className="label">PERSONAL ENVIRONMENTAL JOURNEY</span>
            <h1>
              {getGreeting()}, {firstName} 🌱
            </h1>
            <p className="lead">
              Every large environmental transformation begins with a single, verifiable daily habit.
            </p>
          </div>

          <div className="dash-quick-actions">
            <Link
              to="/actions"
              className="btn btn-primary"
              onClick={resetSession}
            >
              + Log an Action
            </Link>
            <Link to="/community" className="btn btn-ghost">
              Your Community →
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.section
          className="dash-stats-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="stats-main-card">
            <span className="label">YOUR ENVIRONMENTAL CONTRIBUTION</span>
            <div className="stat-big-row">
              <b className="num big">{stats.totalActions}</b>
              <div>
                <h3>Verified actions</h3>
                <small>100% verified via AI inspection</small>
              </div>
            </div>

            {/* Dynamic impact totals — only shown when non-zero */}
            <div className="impact-totals-row">
              {stats.totalWasteDivertedKg > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">♻️</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalWasteDivertedKg.toFixed(3)}</span>
                      <span className="itc-unit">kg</span>
                    </div>
                    <span className="itc-label">waste diverted</span>
                  </div>
                </div>
              )}
              {stats.totalWaterSavedL > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">💧</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalWaterSavedL.toFixed(1)}</span>
                      <span className="itc-unit">L</span>
                    </div>
                    <span className="itc-label">water saved</span>
                  </div>
                </div>
              )}
              {stats.totalEnergySavedKwh > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">⚡</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalEnergySavedKwh.toFixed(3)}</span>
                      <span className="itc-unit">kWh</span>
                    </div>
                    <span className="itc-label">energy saved</span>
                  </div>
                </div>
              )}
              {stats.totalCo2eAvoidedKg > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">🌍</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalCo2eAvoidedKg.toFixed(3)}</span>
                      <span className="itc-unit">kg</span>
                    </div>
                    <span className="itc-label">CO₂e avoided</span>
                  </div>
                </div>
              )}
              {stats.totalDistanceShiftedKm > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">🚲</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalDistanceShiftedKm.toFixed(1)}</span>
                      <span className="itc-unit">km</span>
                    </div>
                    <span className="itc-label">low-carbon km</span>
                  </div>
                </div>
              )}
              {stats.totalTreesPlanted > 0 && (
                <div className="impact-total-chip">
                  <div className="itc-icon-wrap">🌱</div>
                  <div className="itc-info">
                    <div className="itc-val-line">
                      <span className="itc-number">{stats.totalTreesPlanted}</span>
                      <span className="itc-unit">trees</span>
                    </div>
                    <span className="itc-label">planted</span>
                  </div>
                </div>
              )}
            </div>

            {/* Category chips */}
            <div className="category-chips-grid">
              {categorySummary.map(({ icon, label, count, metric }) => (
                <div key={label} className="category-chip">
                  <span className="cat-icon">{icon}</span>
                  <span className="cat-num">{count}</span>
                  <span className="cat-label">{label}</span>
                  {metric && <span className="cat-metric">{metric}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Living Nature Snapshot */}
          <div className="dash-nature-snapshot">
            <span className="label">YOUR LIVING EFFECT</span>
            <Scene people={stats.totalActions} height={180} />
            <div className="nature-caption">
              <b>{stats.totalActions > 25 ? 'A flourishing ecosystem' : 'A growing garden'}</b>
              <small>Your actions compound over time.</small>
            </div>
          </div>
        </motion.section>

        {/* Two Column Layout */}
        <div className="dash-dual-grid">
          {/* Your Contribution Card */}
          <motion.div
            className="card-feature"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="label">YOUR CONTRIBUTION</span>
            <h2>Small choices make monumental change.</h2>
            <p className="lead" style={{ fontSize: '1rem', margin: '12px 0 20px' }}>
              You have completed <b>{stats.totalActions}</b> environmental actions.
              {stats.totalCo2eAvoidedKg > 0 && (
                <> Estimated <b>{stats.totalCo2eAvoidedKg.toFixed(3)} kg CO₂e</b> avoided.</>
              )}
            </p>

            <div className="row">
              <Link to="/actions" className="btn btn-primary btn-sm" onClick={resetSession}>
                Log New Action →
              </Link>
              <Link to="/my-impact" className="btn btn-ghost btn-sm">
                View Full Impact
              </Link>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="card-feature"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <div className="pv-header">
              <span className="label">RECENT ACTIVITY</span>
              <Link to="/history" className="link" style={{ margin: 0, fontSize: '0.8rem' }}>
                View All ({history.length}) →
              </Link>
            </div>

            <div className="dash-recent-list">
              {recentHistory.length === 0 && (
                <p style={{ color: 'var(--sage)', fontSize: '0.9rem' }}>
                  No actions yet. Log your first contribution!
                </p>
              )}
              {recentHistory.map((item) => {
                // Find corresponding contribution for metrics
                const contrib = contributions.find(c => c.id === item.id);
                const primaryMetric = contrib?.metricsSnapshot?.[0];

                return (
                  <div key={item.id} className="recent-item">
                    <div className="recent-icon">
                      {item.category === 'Waste' ? '♻️'
                        : item.category === 'Water' ? '💧'
                        : item.category === 'Energy' ? '⚡'
                        : item.category === 'Transport' ? '🚲'
                        : '🌱'}
                    </div>
                    <div className="recent-info">
                      <b>{item.detectedItem || item.actionName}</b>
                      <small>
                        <span className="verified-tag">✓ Verified</span> · {item.dateLabel || 'Recent'}
                      </small>
                      {item.quantity && item.unit && (
                        <small style={{ color: 'var(--green)', display: 'block' }}>
                          {item.quantity} {item.unit}
                        </small>
                      )}
                    </div>
                    <div className="recent-badge-col">
                      {primaryMetric && (
                        <span className="recent-metric-badge">
                          {primaryMetric.value >= 0.001
                            ? primaryMetric.value >= 1
                              ? primaryMetric.value.toFixed(2)
                              : primaryMetric.value.toFixed(4)
                            : '<0.001'}{' '}
                          {primaryMetric.unit}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
