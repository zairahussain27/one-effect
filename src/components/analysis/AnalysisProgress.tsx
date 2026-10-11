import React from 'react';
import { motion } from 'framer-motion';

interface AnalysisProgressProps {
  progress: number;
  currentLabel: string;
  isComplete?: boolean;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  progress,
  currentLabel,
  isComplete = false
}) => {
  return (
    <div className="analysis-progress-container">
      <div className="progress-header-row">
        <span className="label">AI VERIFICATION ENGINE</span>
        <b className="progress-percent-num">
          {Math.min(100, Math.round(progress))}%
        </b>
      </div>

      <div className="analysis-bar-track">
        <motion.div
          className="analysis-bar-fill"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ ease: 'easeOut', duration: 0.35 }}
        >
          <span className="bar-glow-tip" />
        </motion.div>
      </div>

      <p className="current-action-prompt">
        {isComplete ? '✓ Verification complete! Preparing impact...' : currentLabel}
      </p>
    </div>
  );
};

export default AnalysisProgress;
