import { motion } from 'framer-motion';
import { Scene } from './ImpactVisualization';
import { COMMUNITY_STAGES } from '../data/demoImpact';
const COUNTS = [1, 3, 7, 14, 24];
export default function CommunityEffect() {
  return (
    <section className="section wrap">
      <h2>One action becomes<br />something bigger.</h2>
      <div className="stages">
        {COMMUNITY_STAGES.map((s, k) => (
          <motion.div key={s.label} className="stage" initial={{ opacity: 0, scale: 0.94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.3, duration: 1 }}>
            <Scene people={s.people} count={COUNTS[k]} height={110} />
            <b>{s.label}</b><span className="label">{s.name.toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
