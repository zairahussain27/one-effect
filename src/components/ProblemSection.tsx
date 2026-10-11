import { motion } from 'framer-motion';
import { PROBLEM_STEPS } from '../data/impactFactors';
export default function ProblemSection() {
  return (
    <section id="problem" className="section wrap">
      <p className="label">THE PROBLEM / 02</p>
      <h2>We see our action.<br />We don't see its effect.</h2>
      <p className="lead">One recycled bottle feels insignificant. One saved litre feels insignificant. But environmental change is rarely the result of one action.</p>
      <div className="steps">
        {PROBLEM_STEPS.map((s, k) => (
          <motion.div key={s.n} className="step" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: k * 0.25, duration: 0.8 }}>
            <div className="dotbox">
              {Array.from({ length: s.dots }, (_, i) => <i key={i} style={{ background: i === 0 ? '#F2C94C' : '#3E8E5A' }} />)}
            </div>
            <b className="num">{s.n.toLocaleString()}</b>
            <span className="label">{s.n === 1 ? 'PERSON · "1 bottle"' : `PEOPLE · "${s.n.toLocaleString()} ${s.n === 10000 ? 'actions' : 'bottles'}"`}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
