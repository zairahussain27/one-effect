import React from 'react';
import { motion } from 'framer-motion';
import { useImpact } from '../context/ImpactContext';
import { go } from '../utils/calculator';
import ImagePreview from './ImagePreview';

export default function ImpactPreview() {
  const { selectedAction, uploadedImage, scanResult, sim } = useImpact();

  return (
    <section id="impact" className="section wrap">
      <div className="preview">
        <div className="pv-header">
          <p className="label">YOUR ACTION / 01</p>
          {scanResult && scanResult.actionId === selectedAction.id && (
            <span className="source-tag">{scanResult.source.toUpperCase()} IDENTIFIED</span>
          )}
        </div>

        <div className="pv-content-grid">
          {uploadedImage && (
            <div className="pv-img-wrapper">
              <ImagePreview
                imageSrc={uploadedImage}
                altText={selectedAction.name}
              />
            </div>
          )}

          <div className="pv-details">
            <motion.div
              key={selectedAction.id}
              className="pv-action"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="ico">{selectedAction.icon}</span>
              <div>
                <h3>{selectedAction.sentence}</h3>
                <small className="category-label">{selectedAction.category.toUpperCase()} CATEGORY</small>
              </div>
            </motion.div>

            {selectedAction.recommendedAction && (
              <div className="pv-rec-pill">
                <span className="label">RECOMMENDED:</span>
                <span>{selectedAction.recommendedAction}</span>
              </div>
            )}

            <div className="pv-multiplier">
              <b className="num big">
                1 <small className="label">INDIVIDUAL ACTION</small>
              </b>
              <p className="lead">
                Your action is small.
                <br />
                <b>But what happens when {sim.people.toLocaleString()} people do the same?</b>
              </p>
            </div>

            <div className="row" style={{ marginTop: 16 }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => go('what-if')}
              >
                What If Everyone? →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
