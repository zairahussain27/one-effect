import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import { Scene } from '../components/ImpactVisualization';

export default function MyImpact() {
  const { user } = useAuth();
  const { stats, contributions } = useImpact();

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'you';

  // Category breakdown with actual metrics
  const categories = [
    {
      icon: '♻️',
      label: 'Waste',
      count: stats.wasteActions,
      metrics: [
        stats.totalWasteDivertedKg > 0
          ? { label: 'Diverted from landfill', value: stats.totalWasteDivertedKg.toFixed(4), unit: 'kg' }
          : null,
        stats.totalCo2eAvoidedKg > 0
          ? { label: 'Estimated modeled GHG reduction (recycling + composting)', value: stats.totalCo2eAvoidedKg.toFixed(5), unit: 'kg CO₂e' }
          : null
      ].filter(Boolean)
    },
    {
      icon: '💧',
      label: 'Water',
      count: stats.waterActions,
      metrics: [
        stats.totalWaterSavedL > 0
          ? { label: 'Water conserved', value: stats.totalWaterSavedL.toFixed(1), unit: 'litres' }
          : null,
        { label: 'CO₂ equivalent', value: 'Not calculated', unit: '(varies by local utility)' }
      ].filter(Boolean)
    },
    {
      icon: '⚡',
      label: 'Energy',
      count: stats.energyActions,
      metrics: [
        stats.totalEnergySavedKwh > 0
          ? { label: 'Electricity saved', value: stats.totalEnergySavedKwh.toFixed(4), unit: 'kWh' }
          : null,
        stats.totalEnergySavedKwh > 0
          ? {
              label: 'Estimated CO₂ avoided (India grid, CEA FY2024-25)',
              value: (stats.totalEnergySavedKwh * 0.710).toFixed(4),
              unit: 'kg CO₂'
            }
          : null
      ].filter(Boolean)
    },
    {
      icon: '🚲',
      label: 'Transport',
      count: stats.transportActions,
      metrics: [
        stats.totalDistanceShiftedKm > 0
          ? { label: 'Distance by low-carbon mode', value: stats.totalDistanceShiftedKm.toFixed(1), unit: 'km' }
          : null,
        stats.totalDistanceShiftedKm > 0
          ? {
              label: 'Estimated operational CO₂ avoided (vs petrol car)',
              value: (stats.totalDistanceShiftedKm * 0.143).toFixed(4),
              unit: 'kg CO₂'
            }
          : null
      ].filter(Boolean)
    },
    {
      icon: '🌱',
      label: 'Nature',
      count: stats.natureActions,
      metrics: [
        stats.totalTreesPlanted > 0
          ? { label: 'Trees planted / tended', value: String(stats.totalTreesPlanted), unit: 'trees' }
          : null,
        stats.totalAreaRestoredM2 > 0
          ? { label: 'Green space restored', value: stats.totalAreaRestoredM2.toFixed(1), unit: 'm²' }
          : null,
        { label: 'Carbon sequestration', value: 'Not estimated at planting', unit: '(tracked over time)' }
      ].filter(Boolean)
    }
  ];

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
          <span className="label">PERSONAL IMPACT / SUMMARY</span>
          <h1>{firstName}'s Cumulative Effect</h1>
          <p className="lead">
            Every verified contribution is calculated from a documented research factor.
          </p>
        </motion.div>

        {/* Hero Impact Metrics — top-level totals */}
        <div className="impact-summary-grid">
          <div className="impact-summary-card">
            <span className="label">TOTAL VERIFIED ACTIONS</span>
            <b className="num big">{stats.totalActions}</b>
            <small>Direct verified contributions</small>
          </div>

          {stats.totalWasteDivertedKg > 0 && (
            <div className="impact-summary-card">
              <span className="label">MATERIAL DIVERTED</span>
              <b className="num">{stats.totalWasteDivertedKg.toFixed(3)} <small>kg</small></b>
              <small>Kept out of landfill</small>
            </div>
          )}

          {stats.totalWaterSavedL > 0 && (
            <div className="impact-summary-card">
              <span className="label">WATER CONSERVED</span>
              <b className="num">{stats.totalWaterSavedL.toFixed(1)} <small>L</small></b>
              <small>Directly measured</small>
            </div>
          )}

          {stats.totalEnergySavedKwh > 0 && (
            <div className="impact-summary-card">
              <span className="label">ENERGY SAVED</span>
              <b className="num">{stats.totalEnergySavedKwh.toFixed(3)} <small>kWh</small></b>
              <small>Electricity reduced</small>
            </div>
          )}

          {stats.totalCo2eAvoidedKg > 0 && (
            <div className="impact-summary-card">
              <span className="label">ESTIMATED CO₂e AVOIDED</span>
              <b className="num">{stats.totalCo2eAvoidedKg.toFixed(3)} <small>kg</small></b>
              <small>Modeled from research factors</small>
            </div>
          )}

          {stats.totalDistanceShiftedKm > 0 && (
            <div className="impact-summary-card">
              <span className="label">LOW-CARBON TRAVEL</span>
              <b className="num">{stats.totalDistanceShiftedKm.toFixed(1)} <small>km</small></b>
              <small>Shifted from motorized</small>
            </div>
          )}

          {stats.totalTreesPlanted > 0 && (
            <div className="impact-summary-card">
              <span className="label">TREES PLANTED</span>
              <b className="num big">{stats.totalTreesPlanted}</b>
              <small>In your journey</small>
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div style={{ marginTop: 32 }}>
          <span className="label" style={{ display: 'block', marginBottom: 16 }}>CATEGORY BREAKDOWN</span>

          <div className="my-impact-categories">
            {categories.filter(c => c.count > 0).map(({ icon, label, count, metrics }) => (
              <motion.div
                key={label}
                className="my-impact-category-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mic-header">
                  <span className="mic-icon">{icon}</span>
                  <div>
                    <b>{label}</b>
                    <span className="mic-count">{count} action{count !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="mic-metrics">
                  {(metrics as any[]).map((m: any, i: number) => m && (
                    <div key={i} className="mic-metric-row">
                      <span className="mic-metric-label">{m.label}</span>
                      <span className="mic-metric-value">
                        <b>{m.value}</b> {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nature visualization */}
        <div className="impact-nature-box" style={{ marginTop: 32 }}>
          <div className="scene">
            <span className="label">YOUR PERSONAL LIVING IMPACT</span>
            <Scene people={stats.totalActions} height={220} />
            <div className="tier">
              {stats.totalActions >= 40 ? 'A thriving ecosystem' : 'A growing garden'}
            </div>
          </div>

          <div className="panel">
            <div>
              <span className="label">GO FURTHER</span>
              <h2 style={{ color: 'var(--ivory)', marginTop: 8 }}>
                See your community's combined effect
              </h2>
              <p style={{ color: 'var(--sage)', fontSize: '0.95rem', margin: '12px 0 24px' }}>
                {stats.totalActions} verified actions from you alone.
                Your community has logged even more.
              </p>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <Link to="/community" className="btn btn-primary">
                Community Impact →
              </Link>
              <Link to="/simulator" className="btn btn-ghost">
                What If Everyone?
              </Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <small style={{ color: 'var(--green)', opacity: 0.8 }}>
            All figures calculated from documented research factors.{' '}
            <Link to="/sources" className="link" style={{ fontSize: 'inherit' }}>
              View methodology →
            </Link>
          </small>
        </div>
      </main>
    </div>
  );
}
