import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';
import * as actionService from '../services/actionService';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

// Simple bar visualization
function MetricBar({
  value,
  max,
  color,
  label,
  unit
}: {
  value: number;
  max: number;
  color: string;
  label: string;
  unit: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  const fmt = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    if (v >= 1) return v.toFixed(1);
    return v.toFixed(3);
  };

  return (
    <div className="community-metric-bar">
      <div className="cm-bar-label-row">
        <span className="cm-bar-label">{label}</span>
        <b className="cm-bar-value" style={{ color }}>
          {fmt(value)} <small>{unit}</small>
        </b>
      </div>
      <div className="cm-bar-track">
        <motion.div
          className="cm-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const { stats, contributions } = useImpact();
  const communityStats = actionService.getCommunityStats(stats);

  const [activeTab, setActiveTab] = useState<'overview' | 'thisWeek' | 'trends'>('overview');

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'you';

  // Max values for bar charts (community level)
  const maxWaste = Math.max(communityStats.totalWasteDivertedKg, 1);
  const maxWater = Math.max(communityStats.totalWaterSavedL, 1);
  const maxEnergy = Math.max(communityStats.totalEnergySavedKwh, 1);
  const maxCo2 = Math.max(communityStats.totalCo2eAvoidedKg, 1);
  const maxDist = Math.max(communityStats.totalDistanceShiftedKm, 1);

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">COMMUNITY EFFECT</span>
          <h1>Your Community's Effect</h1>
          <p className="lead">
            People around you are already contributing.
            <br />
            You're part of something larger than any single action.
          </p>
        </motion.div>

        {/* Contributors banner */}
        <motion.div
          className="community-hero-banner"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="community-count-block">
            <b className="num big">{communityStats.contributorCount}</b>
            <span className="label">PEOPLE IN YOUR AREA</span>
            <small>contributed this month</small>
          </div>

          <div className="community-privacy-note">
            <span className="privacy-icon">🔒</span>
            <div>
              <b>Privacy Protected</b>
              <p>Contributions are aggregated by area. No individual names or locations are shared.</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="seg" style={{ margin: '24px 0' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'thisWeek', label: 'This Week' },
            { id: 'trends', label: 'Trends' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'on' : ''}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Community metrics grid */}
            <div className="community-metrics-grid">
              <div className="community-metric-card">
                <span className="label">WASTE DIVERTED</span>
                <b className="num community-num">
                  {communityStats.totalWasteDivertedKg >= 1000
                    ? `${(communityStats.totalWasteDivertedKg / 1000).toFixed(2)} t`
                    : `${communityStats.totalWasteDivertedKg.toFixed(1)} kg`}
                </b>
                <small>from landfill</small>
              </div>

              <div className="community-metric-card">
                <span className="label">WATER CONSERVED</span>
                <b className="num community-num">
                  {communityStats.totalWaterSavedL >= 1000
                    ? `${(communityStats.totalWaterSavedL / 1000).toFixed(1)}k L`
                    : `${communityStats.totalWaterSavedL.toFixed(0)} L`}
                </b>
                <small>saved</small>
              </div>

              <div className="community-metric-card">
                <span className="label">ENERGY SAVED</span>
                <b className="num community-num">
                  {communityStats.totalEnergySavedKwh >= 1000
                    ? `${(communityStats.totalEnergySavedKwh / 1000).toFixed(1)}k kWh`
                    : `${communityStats.totalEnergySavedKwh.toFixed(1)} kWh`}
                </b>
                <small>electricity</small>
              </div>

              <div className="community-metric-card">
                <span className="label">CO₂e AVOIDED</span>
                <b className="num community-num">
                  {communityStats.totalCo2eAvoidedKg >= 1000
                    ? `${(communityStats.totalCo2eAvoidedKg / 1000).toFixed(2)} t`
                    : `${communityStats.totalCo2eAvoidedKg.toFixed(2)} kg`}
                </b>
                <small>estimated modeled</small>
              </div>

              <div className="community-metric-card">
                <span className="label">LOW-CARBON TRAVEL</span>
                <b className="num community-num">
                  {communityStats.totalDistanceShiftedKm.toFixed(0)} km
                </b>
                <small>shifted from cars</small>
              </div>

              {communityStats.totalTreesPlanted > 0 && (
                <div className="community-metric-card">
                  <span className="label">TREES PLANTED</span>
                  <b className="num community-num">
                    {communityStats.totalTreesPlanted}
                  </b>
                  <small>in your area</small>
                </div>
              )}
            </div>

            {/* Community visual breakdown */}
            <div className="card-feature" style={{ marginTop: 28 }}>
              <span className="label">YOUR COMMUNITY'S EFFECT</span>
              <h2>Environmental dimensions</h2>

              <div className="community-bars">
                <MetricBar
                  value={communityStats.totalWasteDivertedKg}
                  max={maxWaste * 1.1}
                  color="var(--green)"
                  label="♻ WASTE"
                  unit="kg diverted"
                />
                <MetricBar
                  value={communityStats.totalWaterSavedL}
                  max={maxWater * 1.1}
                  color="#3498db"
                  label="💧 WATER"
                  unit="litres saved"
                />
                <MetricBar
                  value={communityStats.totalEnergySavedKwh}
                  max={maxEnergy * 1.1}
                  color="#f7b731"
                  label="⚡ ENERGY"
                  unit="kWh saved"
                />
                <MetricBar
                  value={communityStats.totalCo2eAvoidedKg}
                  max={maxCo2 * 1.1}
                  color="#4ecdc4"
                  label="🌍 CLIMATE"
                  unit="kg CO₂e"
                />
                <MetricBar
                  value={communityStats.totalDistanceShiftedKm}
                  max={maxDist * 1.1}
                  color="var(--sage)"
                  label="🚲 MOBILITY"
                  unit="km shifted"
                />
              </div>

              <small style={{ color: 'var(--sage)', marginTop: 16, display: 'block' }}>
                * CO₂e is an estimated modeled figure from documented research factors.{' '}
                <Link to="/sources" className="link" style={{ fontSize: 'inherit' }}>
                  View methodology →
                </Link>
              </small>
            </div>

            {/* You vs Community */}
            <div className="card-feature" style={{ marginTop: 24 }}>
              <span className="label">YOU AND YOUR COMMUNITY</span>
              <h2>Your contribution, their company.</h2>
              <p style={{ color: 'var(--sage)', marginBottom: 20 }}>
                You're not competing — you're all building the same thing.
              </p>

              <div className="you-vs-community-grid">
                <div className="yvc-card your-card">
                  <span className="label">YOUR JOURNEY</span>
                  <b className="num">{stats.totalActions}</b>
                  <small>verified actions</small>
                  {stats.totalCo2eAvoidedKg > 0 && (
                    <small style={{ display: 'block', color: 'var(--green)' }}>
                      {stats.totalCo2eAvoidedKg.toFixed(4)} kg CO₂e modeled
                    </small>
                  )}
                </div>

                <div className="yvc-divider">
                  <span>part of</span>
                </div>

                <div className="yvc-card community-card">
                  <span className="label">YOUR COMMUNITY</span>
                  <b className="num">{communityStats.contributorCount}</b>
                  <small>contributors</small>
                  <small style={{ display: 'block', color: 'var(--green)' }}>
                    {communityStats.totalCo2eAvoidedKg.toFixed(2)} kg CO₂e total modeled
                  </small>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'thisWeek' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-feature">
              <span className="label">COMMUNITY ACTIVITY — THIS WEEK</span>
              <h2>What your community achieved this week</h2>

              <div className="this-week-list">
                <div className="week-metric-row">
                  <span className="week-icon">♻️</span>
                  <div>
                    <b>+ {communityStats.thisWeek.wasteDivertedKg.toFixed(1)} kg</b>
                    <small>waste diverted from landfill</small>
                  </div>
                </div>

                <div className="week-metric-row">
                  <span className="week-icon">💧</span>
                  <div>
                    <b>+ {communityStats.thisWeek.waterSavedL.toLocaleString()} L</b>
                    <small>water conserved</small>
                  </div>
                </div>

                <div className="week-metric-row">
                  <span className="week-icon">⚡</span>
                  <div>
                    <b>+ {communityStats.thisWeek.energySavedKwh.toFixed(0)} kWh</b>
                    <small>electricity saved</small>
                  </div>
                </div>

                <div className="week-metric-row">
                  <span className="week-icon">🌍</span>
                  <div>
                    <b>+ {communityStats.thisWeek.co2eAvoidedKg.toFixed(2)} kg CO₂e</b>
                    <small>estimated modeled GHG reduction</small>
                  </div>
                </div>

                <div className="week-metric-row">
                  <span className="week-icon">🚲</span>
                  <div>
                    <b>+ {communityStats.thisWeek.distanceShiftedKm.toFixed(0)} km</b>
                    <small>low-carbon transport</small>
                  </div>
                </div>

                <div className="week-metric-row">
                  <span className="week-icon">🌱</span>
                  <div>
                    <b>+ {communityStats.thisWeek.treesPlanted} trees</b>
                    <small>planted this week</small>
                  </div>
                </div>
              </div>

              <small style={{ color: 'var(--sage)', marginTop: 20, display: 'block' }}>
                Community data is aggregated by area. No individual data is shared.
                CO₂e figures are modeled estimates.
              </small>
            </div>
          </motion.div>
        )}

        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="card-feature">
              <span className="label">COMMUNITY TREND</span>
              <h2>Growing impact over time</h2>

              <p style={{ color: 'var(--sage)', margin: '12px 0 24px' }}>
                As more people contribute, the collective environmental effect grows.
                The chart below shows simulated trend data — real data will populate as your
                community continues contributing.
              </p>

              {/* Simple text-based trend visualization */}
              <div className="trend-chart">
                {[
                  { label: 'Mon', waste: 38, water: 820, energy: 42 },
                  { label: 'Tue', waste: 42, water: 960, energy: 51 },
                  { label: 'Wed', waste: 35, water: 740, energy: 38 },
                  { label: 'Thu', waste: 58, water: 1240, energy: 68 },
                  { label: 'Fri', waste: 71, water: 1580, energy: 84 },
                  { label: 'Sat', waste: 84, water: 1820, energy: 96 },
                  { label: 'Sun', waste: 54, water: 1280, energy: 62 }
                ].map((day) => (
                  <div key={day.label} className="trend-day-col">
                    <div className="trend-bars">
                      <motion.div
                        className="trend-bar waste"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.8 }}
                        style={{ height: `${(day.waste / 84) * 100}%` }}
                      />
                    </div>
                    <span className="trend-day-label">{day.label}</span>
                    <span className="trend-day-val">{day.waste}g</span>
                  </div>
                ))}
              </div>

              <div className="trend-legend">
                <span><i className="legend-dot waste" />Waste (kg)</span>
              </div>
            </div>
          </motion.div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <small style={{ color: 'var(--sage)' }}>
            Community data is aggregated at area level for privacy.{' '}
            <Link to="/sources" className="link">
              View impact methodology →
            </Link>
          </small>
        </div>
      </main>
    </div>
  );
}
