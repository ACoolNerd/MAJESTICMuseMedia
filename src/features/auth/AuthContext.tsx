import { createContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../config/firebase';
import { getPermissionsForRole } from '../../lib/permissions';
import type { User, UserRole } from '../../types';

interface AuthContextValue {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  firebaseReady: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_USER: User = {
  id: 'demo-founder',
  name: 'Marchette',
  email: 'marchette@majesticmusemedia.ai',
  role: 'founder',
  permissions: getPermissionsForRole('founder'),
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

function mapFirebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  const role: UserRole = 'founder';
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName ?? firebaseUser.email ?? 'User',
    email: firebaseUser.email ?? '',
    role,
    permissions: getPermissionsForRole(role),
    avatarUrl: firebaseUser.photoURL ?? undefined,
    createdAt: new Date(firebaseUser.metadata.creationTime ?? Date.now()),
    updatedAt: new Date(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const firebaseReady = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(() => (firebaseReady ? null : DEMO_USER));
  const [loading, setLoading] = useState(firebaseReady && Boolean(auth));

  useEffect(() => {
    if (!firebaseReady) {
      return;
    }
    if (!auth) {
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setFirebaseUser(nextUser);
      setUser(nextUser ? mapFirebaseUserToAppUser(nextUser) : null);
      setLoading(false);
    });

    return unsubscribe;
  }, [firebaseReady]);

  async function signIn(email: string, password: string): Promise<void> {
    if (!firebaseReady) {
      setUser(DEMO_USER);
      return;
    }
    if (!auth) {
      throw new Error('Firebase authentication is unavailable.');
    }
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut(): Promise<void> {
    if (!firebaseReady) {
      setUser(null);
      return;
    }
    if (!auth) {
      return;
    }
    await firebaseSignOut(auth);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: Boolean(user),
        firebaseReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
