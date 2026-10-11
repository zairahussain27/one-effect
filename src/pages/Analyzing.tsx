import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getActionById } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import AnalysisScreen from '../components/analysis/AnalysisScreen';

export default function Analyzing() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const {
    uploadedImage,
    scanState,
    scanError,
    clearError
  } = useImpact();

  const action = getActionById(actionId || 'recycle-bottle');

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        {scanState !== 'error' ? (
          <AnalysisScreen
            action={action}
            imageSrc={uploadedImage}
            onComplete={() => {
              navigate(`/actions/${action.id}/result`);
            }}
            onError={() => {
              // Gracefully fall back to result or show note
              navigate(`/actions/${action.id}/result`);
            }}
          />
        ) : (
          <div className="analyzing-card">
            <div className="error-container">
              <span className="ico">⚠️</span>
              <b>Verification Note</b>
              <p className="error-msg">
                {scanError || "We couldn't reach the AI service. Using fallback analysis."}
              </p>
              <div className="row" style={{ justifyContent: 'center', marginTop: 16 }}>
                <Link to="/impact" className="btn btn-primary btn-sm">
                  Proceed Manually →
                </Link>
                <Link
                  to={`/actions/${action.id}/capture`}
                  className="btn btn-ghost btn-sm"
                  onClick={() => clearError()}
                >
                  Try Another Photo
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
