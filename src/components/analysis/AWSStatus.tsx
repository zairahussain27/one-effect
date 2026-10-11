import React from 'react';
import { motion } from 'framer-motion';

interface AWSStatusProps {
  message?: string;
  isComplete?: boolean;
  isFallback?: boolean;
}

export const AWSStatus: React.FC<AWSStatusProps> = ({
  message = 'Amazon Bedrock is processing image...',
  isComplete = false,
  isFallback = false
}) => {
  return (
    <motion.div
      className="aws-status-badge"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="aws-status-pill">
        <span className="aws-tag">AWS</span>
        <span className="aws-divider">•</span>
        <span className="aws-model">Bedrock Vision</span>

        {!isComplete && !isFallback && (
          <span className="aws-pulse-dot" />
        )}

        {isComplete && (
          <span className="aws-check-icon">✓</span>
        )}

        {isFallback && (
          <span className="aws-demo-tag">DEMO</span>
        )}
      </div>

      <p className="aws-status-message">
        {message}
      </p>
    </motion.div>
  );
};

export default AWSStatus;
