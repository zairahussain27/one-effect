import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ACTIONS } from '../data/actions';
import { useImpact } from '../context/ImpactContext';
import AppNavbar from '../components/AppNavbar';
import Background from '../components/Background';
import ActionCard from '../components/ActionCard';

export default function Actions() {
  const navigate = useNavigate();
  const { selectedActionId, setSelectedActionId } = useImpact();

  const handleSelectAction = (actionId: string) => {
    setSelectedActionId(actionId);
    navigate(`/actions/${actionId}`);
  };

  return (
    <div className="app-layout">
      <Background />
      <AppNavbar />

      <main className="app-content wrap">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="label">CHOOSE YOUR ACTION / 01</span>
          <h1>What did you do?</h1>
          <p className="lead">
            Select an action below. Then take or upload a photo so our AI can verify your contribution.
          </p>
        </motion.div>

        <motion.div
          className="grid5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {ACTIONS.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              selected={action.id === selectedActionId}
              onSelect={() => handleSelectAction(action.id)}
            />
          ))}
        </motion.div>

        <div className="action-selection-footer">
          <p className="small-note">
            📸 Every verified action earns <b>+1 contribution</b> towards your environmental journey and the collective simulation.
          </p>
        </div>
      </main>
    </div>
  );
}
