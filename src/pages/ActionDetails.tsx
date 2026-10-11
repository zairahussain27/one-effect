import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActionById } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

export default function ActionDetails() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const { setSelectedActionId, handleFileUpload } = useImpact();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const action = getActionById(actionId || 'recycle-bottle');

  const onFileSelected = async (file?: File) => {
    if (file) {
      setSelectedActionId(action.id);
      await handleFileUpload(file, action.id);
      navigate(`/actions/${action.id}/capture`);
    }
  };

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="action-details-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="action-details-header">
            <span className="action-large-icon">{action.icon}</span>
            <div>
              <span className="label">{action.category.toUpperCase()} ACTION</span>
              <h1>{action.name.toUpperCase()}</h1>
              <p className="lead">{action.sentence}</p>
            </div>
          </div>

          <div className="action-verify-prompt-box">
            <h3>Show us what you did.</h3>
            <p className="lead" style={{ margin: '8px 0 20px', fontSize: '1.05rem' }}>
              {action.description || 'Upload a photo of your action so our AI can verify the contribution.'}
            </p>

            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => onFileSelected(e.target.files?.[0])}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => onFileSelected(e.target.files?.[0])}
            />

            <div className="action-btn-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => cameraInputRef.current?.click()}
              >
                📸 Take Photo
              </button>

              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => fileInputRef.current?.click()}
              >
                📁 Upload Photo
              </button>
            </div>

            <div style={{ marginTop: 24 }}>
              <Link to="/actions" className="link" style={{ fontSize: '0.9rem' }}>
                ← Choose another action
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
