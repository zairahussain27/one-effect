import React, { useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getActionById } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';

export default function Capture() {
  const { actionId } = useParams<{ actionId: string }>();
  const navigate = useNavigate();
  const {
    uploadedImage,
    fileName,
    handleFileUpload,
    resetImage
  } = useImpact();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const action = getActionById(actionId || 'recycle-bottle');

  const onFileSelected = async (file?: File) => {
    if (file) {
      await handleFileUpload(file, action.id);
    }
  };

  const handleStartAnalyze = () => {
    navigate(`/actions/${action.id}/analyzing`);
  };

  const handleRetake = () => {
    resetImage();
    fileInputRef.current?.click();
  };

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="capture-card"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="page-header" style={{ marginBottom: 16 }}>
            <span className="label">IMAGE PREVIEW / 02</span>
            <h1>Your Photo</h1>
            <p className="lead" style={{ margin: '4px 0 16px' }}>
              Action: <b>{action.name}</b> ({action.category})
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => onFileSelected(e.target.files?.[0])}
          />

          {uploadedImage ? (
            <div className="preview-stage">
              <div className="img-frame preview-large-frame">
                <img
                  src={uploadedImage}
                  alt="Uploaded environmental action"
                  className="preview-img"
                />
              </div>

              {fileName && <small className="file-name-label">{fileName}</small>}

              <div className="row" style={{ justifyContent: 'center', marginTop: 20 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleRetake}
                >
                  🔄 Retake / Replace
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStartAnalyze}
                >
                  ✨ Analyze & Verify Action →
                </button>
              </div>
            </div>
          ) : (
            <div
              className="drop"
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <div>
                <span className="ico">📷</span>
                <b>Choose or drop your photo</b>
                <small>JPG, PNG, or WEBP (up to 10 MB)</small>
                <button type="button" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                  Browse Files
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Link to={`/actions/${action.id}`} className="link" style={{ fontSize: '0.85rem' }}>
              ← Back to Action Details
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
