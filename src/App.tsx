import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ImpactProvider } from './context/ImpactContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Actions from './pages/Actions';
import ActionInput from './pages/ActionInput';
import ActionDetails from './pages/ActionDetails';
import Capture from './pages/Capture';
import Analyzing from './pages/Analyzing';
import VerificationResult from './pages/VerificationResult';
import ImpactResult from './pages/ImpactResult';
import History from './pages/History';
import MyImpact from './pages/MyImpact';
import Simulator from './pages/Simulator';
import Sources from './pages/Sources';
import Community from './pages/Community';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="loading-screen">Loading ONE EFFECT…</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function P({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <AuthProvider>
      <ImpactProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route path="/dashboard" element={<P><Dashboard /></P>} />

            {/* Action flow — new route with dynamic input form */}
            <Route path="/actions" element={<P><Actions /></P>} />
            <Route path="/actions/:actionId" element={<P><ActionInput /></P>} />
            <Route path="/actions/:actionId/capture" element={<P><Capture /></P>} />
            <Route path="/actions/:actionId/analyzing" element={<P><Analyzing /></P>} />
            <Route path="/actions/:actionId/result" element={<P><VerificationResult /></P>} />

            {/* Impact result */}
            <Route path="/impact" element={<P><ImpactResult /></P>} />

            {/* History & Impact summary */}
            <Route path="/history" element={<P><History /></P>} />
            <Route path="/my-impact" element={<P><MyImpact /></P>} />

            {/* Community (new) */}
            <Route path="/community" element={<P><Community /></P>} />

            {/* Simulator */}
            <Route path="/simulator" element={<P><Simulator /></P>} />

            {/* Sources / Methodology (new) */}
            <Route path="/sources" element={<P><Sources /></P>} />

            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ImpactProvider>
    </AuthProvider>
  );
}
