import React, { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useImpact } from '../context/ImpactContext';
import { ACTIONS } from '../data/actions';
import { go } from '../utils/calculator';
import ImagePreview from './ImagePreview';
import AnalysisResult from './AnalysisResult';

export default function ScanSection() {
  const {
    uploadedImage,
    scanState,
    scanError,
    scanResult,
    history,
    handleFileUpload,
    startAnalysis,
    setSelectedActionId,
    resetImage,
    clearError
  } = useImpact();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const steps = [
    'Identifying material & structure...',
    'Estimating environmental category...',
    'Finding recommended action...'
  ];

  useEffect(() => {
    if (scanState === 'busy') {
      setAnalysisStep(0);
      const timer1 = setTimeout(() => setAnalysisStep(1), 500);
      const timer2 = setTimeout(() => setAnalysisStep(2), 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [scanState]);

  const onFileSelected = (file?: File) => {
    if (file) {
      handleFileUpload(file).then(() => {
        startAnalysis();
      });
    }
  };

  const getActionIcon = (id: string) => ACTIONS.find((a) => a.id === id)?.icon || '🌱';

  return (
    <section id="scan" className="section wrap scan">
      <div>
        <p className="label">DON'T KNOW WHERE TO START?</p>
        <h2>Identify an action.</h2>
        <p className="lead">
          Upload an image of an everyday item or action and we'll identify its environmental footprint.
          Scan one, then scan another.
        </p>
        <div className="chips" aria-label="Items identified so far">
          {history.slice(0, 5).map((h) => (
            <span key={h.id} title={h.actionName}>
              {getActionIcon(h.actionId)}
            </span>
          ))}
          {history.length > 0 && <small>{history.length} verified actions in history</small>}
        </div>

        <div style={{ marginTop: 24 }}>
          <button
            type="button"
            className="link"
            style={{ textAlign: 'left', margin: 0 }}
            onClick={() => go('actions')}
          >
            ← Or choose an action manually instead
          </button>
        </div>
      </div>

      <div
        className={`drop ${dragOver ? 'drag-over' : ''} ${scanState}`}
        role="button"
        tabIndex={0}
        onClick={() => {
          if (scanState !== 'busy') {
            fileInputRef.current?.click();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && scanState !== 'busy') {
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (scanState !== 'busy' && e.dataTransfer.files?.[0]) {
            onFileSelected(e.dataTransfer.files[0]);
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          hidden
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              onFileSelected(e.target.files[0]);
            }
          }}
        />

        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {scanState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="ico">📷</span>
              <b>Upload an image</b>
              <small>Drop a photo here, or click to choose (JPG, PNG, WEBP &lt; 10MB)</small>
              <button
                type="button"
                className="link"
                onClick={(e) => {
                  e.stopPropagation();
                  startAnalysis();
                }}
              >
                or try a sample item
              </button>
            </motion.div>
          )}

          {/* BUSY / ANALYZING STATE - KEEP IMAGE VISIBLE */}
          {scanState === 'busy' && (
            <motion.div
              key="busy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="analyzing-container"
            >
              {uploadedImage && (
                <div className="img-frame analyzing-frame">
                  <img src={uploadedImage} alt="Scanning" className="preview-img dimmed" />
                </div>
              )}
              <div className="scanbar">
                <motion.i
                  animate={{ x: ['-100%', '250%'] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <span className="label">ANALYZING YOUR ACTION...</span>
              <p className="analyzing-step-text">{steps[analysisStep]}</p>
            </motion.div>
          )}

          {/* DONE STATE */}
          {scanState === 'done' && scanResult && (
            <AnalysisResult
              result={scanResult}
              imageSrc={uploadedImage}
              onReset={resetImage}
              onUseAction={() => setSelectedActionId(scanResult.actionId)}
            />
          )}

          {/* ERROR / FALLBACK STATE */}
          {scanState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="error-container"
            >
              <span className="ico">⚠️</span>
              <b>Analysis Note</b>
              <p className="error-msg">
                {scanError || "We couldn't confidently identify this item. You can choose an action manually."}
              </p>
              <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearError();
                    go('actions');
                  }}
                >
                  Choose an action
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetImage();
                    fileInputRef.current?.click();
                  }}
                >
                  Try another image
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
