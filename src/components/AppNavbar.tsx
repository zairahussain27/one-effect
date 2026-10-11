import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useImpact } from '../context/ImpactContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/actions',   label: 'Actions'   },
  { path: '/history',   label: 'History'   },
  { path: '/my-impact', label: 'My Impact' },
  { path: '/community', label: 'Community' },
  { path: '/simulator', label: 'What If?'  },
  { path: '/sources',   label: 'Methodology' }
];

export default function AppNavbar() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user, logout } = useAuth();
  const { stats } = useImpact();

  // Always use dynamic name — never hardcoded
  const displayName = user?.firstName || user?.name?.split(' ')[0] || '…';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === '/actions' && location.pathname.startsWith('/actions'));

  return (
    <header className="app-nav">
      <div className="app-nav-wrap">
        <Link to="/dashboard" className="brand">
          <b>ONE EFFECT</b>
          <small>Environmental Journey</small>
        </Link>

        <nav className="app-nav-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`app-nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="app-nav-user">
          <Link to="/dashboard" className="user-badge" title="Your environmental profile">
            <span className="user-avatar">{user?.avatar || '🌱'}</span>
            {/* Dynamic name — from auth context */}
            <span className="user-name">{displayName}</span>
            <span className="user-count-pill">{stats.totalActions}</span>
          </Link>

          <button
            type="button"
            className="btn-logout"
            onClick={handleLogout}
            title="Sign Out"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
