import type { User } from '../types';

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';
const USE_AWS = import.meta.env.VITE_USE_AWS === 'true';

const STORAGE_KEY_USER = 'one_effect_auth_user';

export const DEFAULT_DEMO_USER: User = {
  id: 'user_zaira_01',
  name: 'Zaira',
  firstName: 'Zaira',
  email: 'demo@oneeffect.app',
  avatar: '🌱',
  createdAt: '2026-09-15T08:00:00.000Z'
};

export async function getCurrentUser(): Promise<User | null> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      return JSON.parse(raw) as User;
    }
    // Default logged in user in demo mode
    if (DEMO_MODE || !USE_AWS) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_DEMO_USER));
      return DEFAULT_DEMO_USER;
    }
    return null;
  } catch {
    return DEFAULT_DEMO_USER;
  }
}

export async function signIn(email: string, password?: string): Promise<User> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 450));

  if (!email) {
    throw new Error('Please enter a valid email address');
  }

  const rawName = email.split('@')[0];
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const user: User = {
    id: `user_${Date.now()}`,
    name: displayName || 'User',
    firstName: displayName.split(' ')[0] || displayName,
    email,
    avatar: '🌱',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  return user;
}

export async function signUp(name: string, email: string, password?: string): Promise<User> {
  await new Promise((r) => setTimeout(r, 500));

  if (!name || !email) {
    throw new Error('Name and email are required');
  }

  const trimmedName = name.trim();
  const user: User = {
    id: `user_${Date.now()}`,
    name: trimmedName,
    firstName: trimmedName.split(' ')[0] || trimmedName,
    email: email.trim(),
    avatar: '🌱',
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  return user;
}

export async function signOut(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY_USER);
}
