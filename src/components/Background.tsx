const CLOUDS = [
  { top: '5%', w: 320, dur: 160, delay: -20, o: 0.5 },
  { top: '16%', w: 240, dur: 210, delay: -120, o: 0.4 },
  { top: '32%', w: 380, dur: 260, delay: -60, o: 0.35 },
  { top: '50%', w: 260, dur: 190, delay: -150, o: 0.3 },
];
function Cloud({ w }: { w: number }) {
  const puffs: [number, number, number][] = [[60, 80, 40], [120, 58, 52], [190, 68, 46], [240, 86, 32], [150, 90, 50]];
  return (
    <svg width={w} viewBox="0 0 300 130">
      {puffs.map(([x, y, r], i) => <circle key={`s${i}`} cx={x} cy={y + 9} r={r} fill="#C9E3F2" />)}
      {puffs.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" />)}
    </svg>
  );
}
export default function Background() {
  return (
    <div className="bg" aria-hidden>
      {CLOUDS.map((c, i) => <div key={i} className="cloud" style={{ top: c.top, opacity: c.o, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}><Cloud w={c.w} /></div>)}
      <svg className="hills" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
        <path d="M0 200 Q250 90 520 170 T1040 140 T1440 190 V420 H0Z" fill="#9CCB7F" />
        <path d="M0 250 Q300 160 600 240 T1200 210 T1440 250 V420 H0Z" fill="#6FB070" />
        <path d="M0 320 Q350 250 700 310 T1440 300 V420 H0Z" fill="#3E8E5A" />
        <path d="M0 380 Q400 340 800 375 T1440 365 V420 H0Z" fill="#2B6B45" />
        {[180, 420, 980, 1260].map((x, i) => <g key={x}><rect x={x - 3} y={300 + (i % 2) * 20} width="6" height="26" fill="#5B4A32" /><circle cx={x} cy={290 + (i % 2) * 20} r="24" fill="#2F7048" /><circle cx={x - 14} cy={300 + (i % 2) * 20} r="16" fill="#3E8E5A" /></g>)}
      </svg>
    </div>
  );
}
