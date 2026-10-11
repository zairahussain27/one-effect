import { motion } from 'framer-motion';
import type { Action } from '../types';
export default function ActionCard({ action, selected, onSelect }: { action: Action; selected: boolean; onSelect: () => void }) {
  return (
    <motion.button className={`card ${selected ? 'on' : ''}`} onClick={onSelect} whileHover={{ y: -5 }} transition={{ duration: 0.4 }} aria-pressed={selected}>
      <span className="ico">{action.icon}</span>
      <span className="label">{action.category.toUpperCase()}</span>
      <b>{action.name}</b>
      <small>{action.blurb}</small>
      {selected && <span className="tick">Selected</span>}
    </motion.button>
  );
}
