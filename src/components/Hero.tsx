import { motion } from 'framer-motion';
import OrganicImpactVisual from './OrganicImpactVisual';
import { go } from '../utils/calculator';
export default function Hero() {
  return (
    <section className="hero wrap">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <p className="label">ENVIRONMENTAL IMPACT / 01</p>
        <h1>Your action is small.<br />Its impact isn't.</h1>
        <p className="lead">One bottle. One litre. One small choice. See what happens when thousands of people make the same choice.</p>
        <div className="row">
          <button className="btn btn-primary" onClick={() => go('impact')}>See Your Impact →</button>
          <button className="btn btn-ghost" onClick={() => go('what-if')}>What If Everyone?</button>
        </div>
      </motion.div>
      <OrganicImpactVisual />
    </section>
  );
}
