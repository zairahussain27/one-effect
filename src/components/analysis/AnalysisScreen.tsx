import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Action, ScanResult } from '../../types';
import { useImpact } from '../../context/ImpactContext';
import { ANALYSIS_STAGES } from './AnalysisMessages';
import AnalysisProgress from './AnalysisProgress';
import AnalysisStep, { StepState } from './AnalysisStep';
import AWSStatus from './AWSStatus';

interface AnalysisScreenProps {
  action: Action;
  imageSrc: string | null;
  onComplete: (result: ScanResult) => void;
  onError?: (msg: string) => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  action,
  imageSrc,
  onComplete,
  onError
}) => {
  const { startAnalysis } = useImpact();
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(10);
  const [awsMessage, setAwsMessage] = useState('Initiating secure AWS Bedrock session...');
  const [isFinished, setIsFinished] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScanResult | null>(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    // Start background AI Analysis (AWS or local fallback)
    const analysisPromise = startAnalysis(action.id);

    // Realistic multi-stage timeline sequence
    const t1 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setCurrentStageIdx(1);
      setProgress(35);
      setAwsMessage(ANALYSIS_STAGES[1].awsText);
    }, 850);

    const t2 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setCurrentStageIdx(2);
      setProgress(58);
      setAwsMessage(ANALYSIS_STAGES[2].awsText);
    }, 1900);

    const t3 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setCurrentStageIdx(3);
      setProgress(78);
      setAwsMessage(ANALYSIS_STAGES[3].awsText);
    }, 3100);

    const t4 = setTimeout(() => {
      if (!isMountedRef.current) return;
      setCurrentStageIdx(4);
      setProgress(92);
      setAwsMessage(ANALYSIS_STAGES[4].awsText);
    }, 4100);

    // Combine visual sequence with the actual API/AI response
    Promise.all([
      analysisPromise,
      new Promise((res) => setTimeout(res, 4600))
    ]).then(([result]) => {
      if (!isMountedRef.current) return;
      if (result) {
        setAnalysisResult(result);
        setCurrentStageIdx(5);
        setProgress(100);
        setIsFinished(true);
        setAwsMessage(
          result.source === 'aws'
            ? '✓ Verified by Amazon Bedrock (Claude 3 Vision)'
            : '✓ Verified by intelligent action engine'
        );

        // Transition gracefully after showing 100% complete
        setTimeout(() => {
          if (isMountedRef.current) {
            onComplete(result);
          }
        }, 850);
      }
    }).catch((err) => {
      console.warn('Analysis caught exception:', err);
      if (isMountedRef.current && onError) {
        onError("We couldn't reach the AI service. Using fallback analysis.");
      }
    });

    return () => {
      isMountedRef.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [action.id]);

  const currentConfig = ANALYSIS_STAGES[Math.min(currentStageIdx, ANALYSIS_STAGES.length - 1)];

  return (
    <motion.div
      className="analysis-screen-split"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.6 }}
    >
      {/* LEFT COLUMN: Uploaded Image with Nature Scanning Beam */}
      <div className="analysis-image-pane">
        <div className="pane-header">
          <span className="label">UPLOADED PHOTO</span>
          <span className="action-tag-pill">{action.name}</span>
        </div>

        <div className="image-scanner-box">
          {imageSrc ? (
            <div className="scanner-frame">
              <img
                src={imageSrc}
                alt="Environmental item under analysis"
                className="scanner-img"
              />

              {/* Nature-inspired Scanning Beam & Ripple */}
              {!isFinished && (
                <>
                  <motion.div
                    className="scanner-beam"
                    animate={{ y: ['0%', '100%', '0%'] }}
                    transition={{
                      duration: 2.8,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                  <div className="scanner-corner tl" />
                  <div className="scanner-corner tr" />
                  <div className="scanner-corner bl" />
                  <div className="scanner-corner br" />
                </>
              )}

              {isFinished && (
                <motion.div
                  className="scanner-overlay-verified"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <span className="verified-large-check">✓</span>
                  <b>PHOTO VERIFIED</b>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="scanner-placeholder">
              <span>📷</span>
              <small>No image loaded</small>
            </div>
          )}

          <div className="image-caption">
            <span className="leaf-dot">🌱</span>
            <span>AI is identifying material and verifying action integrity</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: AI & AWS Multi-Stage Progress */}
      <div className="analysis-status-pane">
        <div className="pane-header">
          <span className="label">REAL-TIME VERIFICATION</span>
          <span className="live-pulse-badge">
            <span className="pulse-dot" /> LIVE
          </span>
        </div>

        <h2>AI Analysis in Progress</h2>

        <AnalysisProgress
          progress={progress}
          currentLabel={currentConfig.detail}
          isComplete={isFinished}
        />

        {/* Sequential Step Checklist */}
        <div className="analysis-steps-list">
          {ANALYSIS_STAGES.slice(0, 5).map((s, idx) => {
            let state: StepState = 'pending';
            if (currentStageIdx > idx) state = 'completed';
            else if (currentStageIdx === idx) state = 'active';

            return (
              <AnalysisStep
                key={s.stage}
                label={s.label}
                detail={s.detail}
                state={state}
              />
            );
          })}
        </div>

        {/* AWS Status Badge */}
        <div className="aws-section-footer">
          <AWSStatus
            message={awsMessage}
            isComplete={isFinished}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisScreen;
