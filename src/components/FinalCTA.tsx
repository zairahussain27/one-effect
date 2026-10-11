import { go } from '../utils/calculator';
export default function FinalCTA() {
  return (
    <section id="about" className="section wrap final">
      <h2>It starts with one.</h2>
      <p className="lead">ONE EFFECT turns a small choice into a visible, collective one. Pick an action and watch it grow.</p>
      <button className="btn btn-primary" onClick={() => go('actions')}>Start an action</button>
      <small>Prototype for Environmental Hacks · All figures are illustrative.</small>
    </section>
  );
}
