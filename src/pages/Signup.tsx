import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Background from '../components/Background';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <Background />
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <span className="auth-logo">🌱</span>
          <h1>Join ONE EFFECT</h1>
          <p className="lead">Start turning your small actions into collective power.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">FULL NAME</label>
            <input
              type="text"
              className="form-input"
              value={name}
              placeholder="e.g. Zaira"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">EMAIL</label>
            <input
              type="email"
              className="form-input"
              value={email}
              placeholder="you@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">PASSWORD</label>
            <input
              type="password"
              className="form-input"
              value={password}
              placeholder="••••••••"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="label">CONFIRM PASSWORD</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              placeholder="••••••••"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
