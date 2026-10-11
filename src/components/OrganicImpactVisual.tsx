import { motion } from 'framer-motion';
const N = 150, GOLD = Math.PI * (3 - Math.sqrt(5));
const COLORS = ['#1F4D36', '#3E8E5A', '#7FB08A', '#A9C4A0'];
export default function OrganicImpactVisual() {
  const dots = Array.from({ length: N }, (_, i) => {
    const r = 17 * Math.sqrt(i + 1), a = i * GOLD;
    return { x: 260 + r * Math.cos(a), y: 260 + r * Math.sin(a), c: COLORS[i % 4], s: 3 + Math.min(5, i / 28), i };
  });
  return (
    <div className="hero-visual" aria-hidden>
      <svg viewBox="0 0 520 520">
        {[0, 1, 2].map((k) => (
          <motion.circle key={k} cx="260" cy="260" fill="none" stroke="#3E8E5A" strokeWidth="1"
            initial={{ r: 8, opacity: 0.6 }} animate={{ r: 250, opacity: 0 }}
            transition={{ duration: 7, repeat: Infinity, delay: k * 2.3, ease: 'easeOut' }} />
        ))}
        {dots.slice(1).map((d) => (
          <motion.circle key={d.i} cx={d.x} cy={d.y} r={d.s} fill={d.c}
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.85 }}
            transition={{ delay: 0.8 + d.i * 0.02, duration: 0.9, ease: 'easeOut' }}
            style={{ transformOrigin: `${d.x}px ${d.y}px` }} />
        ))}
        <motion.circle cx="260" cy="260" r="10" fill="#F2C94C" animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '260px 260px' }} />
      </svg>
      <span className="vtag" style={{ left: '50%', top: '53%' }}>1 person</span>
      <span className="vtag" style={{ right: '2%', bottom: '8%' }}>10,000 people</span>
    </div>
  );
}
