import React from 'react';
import Background from '../components/Background';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProblemSection from '../components/ProblemSection';
import ActionGrid from '../components/ActionGrid';
import ScanSection from '../components/ScanSection';
import ImpactPreview from '../components/ImpactPreview';
import WhatIfSimulator from '../components/WhatIfSimulator';
import ImpactVisualization from '../components/ImpactVisualization';
import CommunityEffect from '../components/CommunityEffect';
import FinalCTA from '../components/FinalCTA';
import { ImpactProvider } from '../context/ImpactContext';

export default function Landing() {
  return (
    <ImpactProvider>
      <Background />
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ActionGrid />
        <ScanSection />
        <ImpactPreview />
        <WhatIfSimulator />
        <ImpactVisualization />
        <CommunityEffect />
        <FinalCTA />
      </main>
    </ImpactProvider>
  );
}
