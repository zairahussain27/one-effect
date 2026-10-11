import React from 'react';
import { go } from '../utils/calculator';

const LINKS = [
  ['HOW IT WORKS', 'problem'],
  ['ACTIONS', 'actions'],
  ['IDENTIFY', 'scan'],
  ['YOUR IMPACT', 'impact'],
  ['WHAT IF?', 'what-if']
];

export default function Navbar() {
  return (
    <header className="nav">
      <button
        type="button"
        className="brand"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <b>ONE EFFECT</b>
        <small>Environmental Impact Simulator</small>
      </button>
      <nav className="nav-links">
        {LINKS.map(([label, id]) => (
          <button key={id} type="button" onClick={() => go(id)}>
            {label}
          </button>
        ))}
      </nav>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => go('actions')}
      >
        START AN ACTION
      </button>
    </header>
  );
}
