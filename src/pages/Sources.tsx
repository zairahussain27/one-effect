import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ENVIRONMENTAL_FACTORS } from '../data/environmentalFactors';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

const SOURCE_GROUPS = [
  {
    id: 'epa-warm',
    org: 'US Environmental Protection Agency (EPA)',
    title: 'Waste Reduction Model (WARM) — Version 16',
    year: 2023,
    url: 'https://www.epa.gov/warm',
    description:
      'WARM provides GHG factors for common materials including plastics, metals, glass, paper, ' +
      'and organic waste. Factors represent the lifecycle GHG difference between recycling and ' +
      'landfill baseline. All WARM figures are modeled comparative estimates.',
    usedFor: [
      'PET plastic recycling GHG factor (1.04 MTCO₂e/short ton)',
      'Aluminum can recycling GHG factor (9.13 MTCO₂e/short ton)',
      'Glass recycling GHG factor (0.28 MTCO₂e/short ton)',
      'Corrugated cardboard recycling GHG factor (3.14 MTCO₂e/short ton)',
      'HDPE, Paper, Steel recycling factors',
      'Food waste composting GHG factor (0.19 MTCO₂e/short ton)',
      'All recycling energy factors (MMBtu/short ton)'
    ],
    factorIds: [
      'pet-recycling-warm16',
      'aluminum-recycling-warm16',
      'glass-recycling-warm16',
      'corrugated-recycling-warm16',
      'food-composting-warm16',
      'pet-energy-warm16',
      'aluminum-energy-warm16'
    ],
    caveat:
      'WARM uses US-specific lifecycle and energy grid assumptions. ' +
      'Results are used as modeled illustrative estimates for India — actual local recycling ' +
      'infrastructure efficiency may differ.'
  },
  {
    id: 'cea-india',
    org: 'Central Electricity Authority (CEA) / Government of India',
    title: 'CO₂ Baseline Database for the Indian Power Sector — Version 18.0',
    year: 2024,
    url: 'https://cea.nic.in/',
    description:
      'The CEA publishes the official CO₂ emission factor for India\'s national electricity grid. ' +
      'The FY2024-25 weighted-average factor includes all generation sources and the growing ' +
      'renewable energy share. Published under the Ministry of Power, Government of India.',
    usedFor: [
      'India grid electricity CO₂ emission factor (0.710 kgCO₂/kWh, FY2024-25)',
      'Metro rail electricity-based CO₂ factor'
    ],
    factorIds: ['india-grid-fy2024-25', 'india-metro-grid'],
    caveat:
      'This is a national weighted-average factor. Actual emissions depend on the marginal ' +
      'generation source at time of use and vary significantly by state grid.'
  },
  {
    id: 'niti-aayog',
    org: 'NITI Aayog / Ministry of Road Transport and Highways (MoRTH)',
    title: 'India EV & Transport Emission Modelling',
    year: 2023,
    url: 'https://niti.gov.in/',
    description:
      'NITI Aayog\'s transport modelling explicitly separates passenger modes, uses occupancy ' +
      'assumptions and vehicle-specific emission factors. The NITI Aayog EV calculator uses ' +
      'journey distance and CO₂ emission factors as explicit inputs.',
    usedFor: [
      'Petrol car tailpipe factor (0.143 kgCO₂/passenger-km)',
      'Motorcycle tailpipe factor (0.065 kgCO₂/km)',
      'Bus passenger-km CO₂ factor (0.039 kgCO₂/passenger-km)',
      'Auto-rickshaw (3-wheeler) CO₂ factor (0.062 kgCO₂/passenger-km)'
    ],
    factorIds: [
      'india-car-tailpipe',
      'india-motorcycle-tailpipe',
      'india-bus-tailpipe',
      'india-auto-tailpipe'
    ],
    caveat:
      'Tailpipe (operational) emissions only — does not include vehicle manufacturing lifecycle. ' +
      'Actual savings depend on vehicle age, fuel type, and real occupancy.'
  },
  {
    id: 'epa-watersense',
    org: 'US Environmental Protection Agency (EPA)',
    title: 'WaterSense Program Documentation',
    year: 2023,
    url: 'https://www.epa.gov/watersense',
    description:
      'EPA WaterSense acknowledges the water-energy nexus: water treatment, delivery, and ' +
      'heating all consume energy. However, energy intensity varies by local water system, ' +
      'so EPA does not publish a universal CO₂-per-litre factor.',
    usedFor: [
      'Rationale for measuring water savings in litres (no universal CO₂ conversion)',
      'Scientific basis for water conservation claims'
    ],
    factorIds: ['water-conservation-note'],
    caveat:
      'ONE EFFECT does not apply a CO₂ factor to water savings because no universal, ' +
      'defensible factor exists. This is a deliberate scientific decision.'
  },
  {
    id: 'usfs',
    org: 'US Forest Service (USFS) Urban Forest Research',
    title: 'Urban Tree Carbon Sequestration Research',
    year: 2023,
    url: 'https://www.fs.usda.gov/',
    description:
      'US Forest Service research explicitly documents that tree carbon sequestration varies ' +
      'significantly with species, size, age, climate, location, management, and survival. ' +
      'A single universal "CO₂ per tree" constant is not defensible.',
    usedFor: [
      'Scientific rationale for NOT claiming fixed CO₂ per tree at planting',
      'Basis for tracking tree survival and deferred carbon accounting'
    ],
    factorIds: [],
    caveat:
      'ONE EFFECT records trees planted and tracks survival. ' +
      'Carbon sequestration claims will only be made when a scientifically ' +
      'defensible regional/species-specific model is available.'
  }
];

const CONVERSION_NOTES = [
  {
    from: 'MTCO₂e/short-ton',
    to: 'kgCO₂e/gram',
    formula: 'factor × 1000 / 907,185',
    explanation:
      '1 metric ton = 1,000 kg; 1 short ton = 907.185 kg; ' +
      '1 MTCO₂e = 1,000 kgCO₂e. ' +
      'So kgCO₂e per gram = MTCO₂e_per_short_ton × 1000 / 907185.'
  },
  {
    from: 'MMBtu/short-ton',
    to: 'kWh/gram',
    formula: 'factor × 293.071 / 907,185',
    explanation:
      '1 MMBtu = 293.071 kWh; 1 short ton = 907,185 grams. ' +
      'So kWh per gram = MMBtu_per_short_ton × 293.071 / 907185.'
  }
];

export default function Sources() {
  const [expandedId, setExpandedId] = useState<string | null>('epa-warm');

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
          <span className="label">TRANSPARENCY / METHODOLOGY</span>
          <h1>Impact Methodology & Sources</h1>
          <p className="lead">
            Every number in ONE EFFECT comes from a documented, government or research source.
            We never manufacture environmental claims.
          </p>
        </motion.div>

        {/* Core principle */}
        <motion.div
          className="card-feature"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ marginBottom: 28 }}
        >
          <span className="label">SCIENTIFIC APPROACH</span>
          <h2>Why we show what we show</h2>
          <div className="sources-principles-grid">
            <div className="principle-item">
              <span className="principle-icon">🔬</span>
              <div>
                <b>Documented factors only</b>
                <p>Only EPA, government, and peer-reviewed sources. No sustainability blogs.</p>
              </div>
            </div>
            <div className="principle-item">
              <span className="principle-icon">📊</span>
              <div>
                <b>Modeled ≠ measured</b>
                <p>WARM lifecycle factors are labeled "modeled estimates," not direct measurements.</p>
              </div>
            </div>
            <div className="principle-item">
              <span className="principle-icon">🚫</span>
              <div>
                <b>No manufactured equivalencies</b>
                <p>We never say "X bottles = X trees" or "X litres = X plants grown."</p>
              </div>
            </div>
            <div className="principle-item">
              <span className="principle-icon">📍</span>
              <div>
                <b>Context-appropriate factors</b>
                <p>India electricity uses CEA data. Water uses direct litres. Trees use count.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Source groups */}
        <div className="sources-list">
          {SOURCE_GROUPS.map((group, idx) => (
            <motion.div
              key={group.id}
              className="source-group-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              <button
                type="button"
                className="source-group-header"
                onClick={() => setExpandedId(expandedId === group.id ? null : group.id)}
              >
                <div className="source-group-title">
                  <div className="source-header-meta">
                    <span className="source-org-tag">{group.org}</span>
                    <span className="source-year-pill">Published: {group.year}</span>
                  </div>
                  <h3>{group.title}</h3>
                </div>
                <div className={`source-expand-pill ${expandedId === group.id ? 'open' : ''}`}>
                  <span>{expandedId === group.id ? 'Collapse' : 'Inspect'}</span>
                  <svg
                    className={`chevron-icon ${expandedId === group.id ? 'rotated' : ''}`}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {expandedId === group.id && (
                <motion.div
                  className="source-group-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="source-body-divider" />

                  <p className="source-description">{group.description}</p>

                  <div className="source-section">
                    <div className="source-section-header">
                      <span className="source-section-icon">🎯</span>
                      <span className="source-section-title">USED FOR IN ONE EFFECT</span>
                    </div>
                    <div className="source-used-grid">
                      {group.usedFor.map((use, i) => (
                        <div key={i} className="source-used-card">
                          <span className="used-check">✓</span>
                          <span>{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {group.factorIds.length > 0 && (
                    <div className="source-section">
                      <div className="source-section-header">
                        <span className="source-section-icon">📊</span>
                        <span className="source-section-title">FACTOR IDs IN DATABASE</span>
                      </div>
                      <div className="factor-id-chips">
                        {group.factorIds.map((fid) => {
                          const factor = ENVIRONMENTAL_FACTORS[fid];
                          return (
                            <div key={fid} className="factor-id-chip">
                              <div className="fic-code-row">
                                <code className="factor-code">{fid}</code>
                                {factor && (
                                  <span className={`confidence-badge-sm ${factor.confidence}`}>
                                    {factor.confidence}
                                  </span>
                                )}
                              </div>
                              {factor && (
                                <div className="factor-chip-meta">
                                  <span className="factor-chip-name">{factor.name}</span>
                                  <div className="factor-chip-num-row">
                                    <b className="factor-chip-val">{factor.factor}</b>
                                    <span className="factor-chip-unit">{factor.unit}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="source-caveat-box">
                    <div className="caveat-badge">
                      <span>⚠️ SCIENTIFIC CAVEAT & REGIONAL SCOPE</span>
                    </div>
                    <p>{group.caveat}</p>
                  </div>

                  <div className="source-card-footer">
                    <a
                      href={group.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-source-link"
                    >
                      <span>Visit Official Source</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                      </svg>
                    </a>
                    <span className="source-verified-badge">✓ Peer-reviewed & Government Documented</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Unit conversions */}
        <motion.div
          className="card-feature"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: 28 }}
        >
          <span className="label">UNIT CONVERSIONS</span>
          <h2>How we convert research units</h2>
          <p style={{ color: 'var(--sage)', marginBottom: 16 }}>
            Research databases use ton-scale units. We convert to human-scale units (grams, kWh).
          </p>

          {CONVERSION_NOTES.map((conv, i) => (
            <div key={i} className="conversion-row">
              <div className="conversion-header">
                <code>{conv.from}</code>
                <span>→</span>
                <code>{conv.to}</code>
              </div>
              <div className="conversion-formula">
                <b>Formula: </b><code>{conv.formula}</code>
              </div>
              <p className="conversion-explanation">{conv.explanation}</p>
            </div>
          ))}
        </motion.div>

        {/* Factor database summary */}
        <motion.div
          className="card-feature"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: 28 }}
        >
          <span className="label">FACTOR DATABASE ({Object.keys(ENVIRONMENTAL_FACTORS).length} FACTORS)</span>
          <h2>All environmental factors</h2>

          <div className="factor-table-container">
            <table className="factor-database-table">
              <thead>
                <tr>
                  <th>Factor ID</th>
                  <th>Value</th>
                  <th>Unit</th>
                  <th>Source</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(ENVIRONMENTAL_FACTORS).map((factor) => (
                  <tr key={factor.id}>
                    <td><code className="factor-code">{factor.id}</code></td>
                    <td className="factor-val-cell">{factor.factor}</td>
                    <td className="factor-unit-cell">{factor.unit}</td>
                    <td className="factor-source-cell">{factor.source.split('/')[0]}</td>
                    <td>
                      <span className={`confidence-badge ${factor.confidence.toLowerCase()}`}>
                        {factor.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <small style={{ color: 'var(--sage)' }}>
            Questions about methodology?{' '}
            <Link to="/dashboard" className="link">
              Return to dashboard
            </Link>
          </small>
        </div>
      </main>
    </div>
  );
}
