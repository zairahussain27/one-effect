import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActionById } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

export default function VerificationResult() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const {
    uploadedImage,
    scanResult,
    selectedAction
  } = useImpact();

  const action = getActionById(actionId || selectedAction.id);
  const detectedLabel = scanResult?.item || scanResult?.label || action.name;
  const confidence = scanResult?.confidence ? (scanResult.confidence <= 1 ? Math.round(scanResult.confidence * 100) : Math.round(scanResult.confidence)) : 96;
  const material = scanResult?.material || action.materialPrompt || 'Verified Eco Material';

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="verification-result-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="verify-success-pill">
            <span className="tick-icon">✓</span>
            <span>ACTION VERIFIED</span>
          </div>

          <h1 className="verify-title">{detectedLabel.toUpperCase()}</h1>

          <div className="verify-body-grid">
            {uploadedImage && (
              <div className="verify-img-column">
                <div className="img-frame verify-img-frame">
                  <img
                    src={uploadedImage}
                    alt={detectedLabel}
                    className="preview-img"
                  />
                </div>
                <small className="source-tag" style={{ marginTop: 8 }}>
                  AI SOURCE: {scanResult?.source?.toUpperCase() || 'MOCK'}
                </small>
              </div>
            )}

            <div className="verify-info-column">
              <div className="info-row">
                <span className="label">MATERIAL IDENTIFIED</span>
                <b className="info-val">{material}</b>
              </div>

              <div className="info-row">
                <div className="conf-header">
                  <span className="label">CONFIDENCE SCORE</span>
                  <span className="conf-val">{confidence}%</span>
                </div>
                <div className="bar-track">
                  <motion.i
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              <div className="info-row">
                <span className="label">YOUR SELECTED ACTION</span>
                <b className="info-val">{action.sentence}</b>
              </div>

              <div className="info-row">
                <span className="label">RECOMMENDED PRACTICE</span>
                <b className="info-val rec-highlight">
                  {scanResult?.recommendedAction || action.recommendedAction}
                </b>
              </div>

              <div className="verify-cta-row">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate('/impact')}
                >
                  See My Impact →
                </button>
                <Link to="/actions" className="btn btn-ghost">
                  Log Another Action
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
