import React from 'react';
import { motion } from 'framer-motion';

export type StepState = 'completed' | 'active' | 'pending';

interface AnalysisStepProps {
  label: string;
  detail?: string;
  state: StepState;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  label,
  detail,
  state
}) => {
  return (
    <div className={`analysis-step-row ${state}`}>
      <div className="step-indicator">
        {state === 'completed' && (
          <motion.span
            className="step-check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            ✓
          </motion.span>
        )}

        {state === 'active' && (
          <span className="step-active-pulse">
            <span className="pulse-ring" />
            <span className="pulse-center" />
          </span>
        )}

        {state === 'pending' && (
          <span className="step-pending-circle">○</span>
        )}
      </div>

      <div className="step-content">
        <b className="step-label">{label}</b>
        {state === 'active' && detail && (
          <motion.small
            className="step-detail"
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {detail}
          </motion.small>
        )}
      </div>
    </div>
  );
};

export default AnalysisStep;
