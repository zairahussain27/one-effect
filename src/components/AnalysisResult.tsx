import React from 'react';
import { motion } from 'framer-motion';
import type { ScanResult } from '../types';
import { go } from '../utils/calculator';
import ImagePreview from './ImagePreview';

interface AnalysisResultProps {
  result: ScanResult;
  imageSrc: string | null;
  onReset: () => void;
  onUseAction: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result,
  imageSrc,
  onReset,
  onUseAction
}) => {
  return (
    <motion.div
      key="result-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="analysis-result-card"
    >
      {imageSrc && (
        <ImagePreview
          imageSrc={imageSrc}
          altText={result.label}
          onRemove={onReset}
        />
      )}

      <div className="result-meta">
        <div className="badge-row">
          <span className="label">IDENTIFIED ITEM</span>
          <span className="source-tag">{result.source.toUpperCase()}</span>
        </div>

        <b className="num item-title">{result.label.toUpperCase()}</b>

        <div className="conf">
          <div className="conf-header">
            <span className="label">CONFIDENCE</span>
            <span className="conf-val">{result.confidence}%</span>
          </div>
          <div className="bar-track">
            <motion.i
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="action-tag">
          <span className="label">RECOMMENDED ACTION</span>
          <b className="rec-text">{result.recommendedAction}</b>
        </div>

        <div className="row result-actions" style={{ justifyContent: 'center', marginTop: 14 }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onUseAction();
              go('impact');
            }}
          >
            Calculate My Impact →
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
          >
            Scan Another
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
