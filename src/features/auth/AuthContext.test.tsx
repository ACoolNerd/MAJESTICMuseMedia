import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { AuthProvider } from './AuthContext';

vi.mock('../../config/firebase', () => ({
  auth: null,
  db: null,
  storage: null,
  isFirebaseConfigured: () => false,
  default: null,
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    callback(null);
    return () => {};
  }),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

function TestConsumer() {
  const { user, isAuthenticated, firebaseReady } = useAuth();
  return (
    <div>
      <div data-testid="authenticated">{String(isAuthenticated)}</div>
      <div data-testid="firebase-ready">{String(firebaseReady)}</div>
      <div data-testid="user-name">{user?.name ?? 'none'}</div>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides demo user when Firebase is not configured', async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });

    expect(screen.getByTestId('firebase-ready').textContent).toBe('false');
    expect(screen.getByTestId('user-name').textContent).toBe('Marchette');
  });
});
