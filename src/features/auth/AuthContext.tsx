/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  getIdTokenResult,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth, firebaseConfigured } from '../../lib/firebase';
import type { Role } from '../../types';
import { isRole } from './permissions';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  role: Role;
  isDemo: boolean;
}

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  firebaseConfigured: boolean;
  demoEnabled: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInDemo: (role: Exclude<Role, 'guest' | 'partner' | 'public'>) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const demoEnabled = import.meta.env.VITE_ENABLE_DEMO_AUTH === 'true';

function displayNameForRole(role: Role): string {
  const names: Record<Role, string> = {
    ceo: 'Marchette',
    coo: 'Keith McPherson',
    post: 'Brian Schwager',
    social: 'Ares Schwager',
    crew: 'Production Crew',
    guest: 'Guest',
    partner: 'Partner',
    public: 'Viewer',
  };
  return names[role];
}

async function mapFirebaseUser(firebaseUser: FirebaseUser): Promise<AppUser> {
  const token = await getIdTokenResult(firebaseUser, true);
  const role = isRole(token.claims.role) ? token.claims.role : 'public';

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || firebaseUser.email || displayNameForRole(role),
    role,
    isDemo: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async firebaseUser => {
      try {
        setError(null);
        setUser(firebaseUser ? await mapFirebaseUser(firebaseUser) : null);
      } catch (caught) {
        setUser(null);
        setError(caught instanceof Error ? caught.message : 'Unable to load the signed-in user.');
      } finally {
        setLoading(false);
      }
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    error,
    firebaseConfigured,
    demoEnabled,
    signIn: async (email, password) => {
      if (!auth) {
        throw new Error('Firebase Authentication is not configured.');
      }
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    },
    signInDemo: role => {
      if (!demoEnabled || firebaseConfigured) {
        throw new Error('Demo authentication is disabled.');
      }
      setError(null);
      setUser({
        uid: `demo-${role}`,
        email: `${role}@demo.majesticmusemedia.ai`,
        displayName: displayNameForRole(role),
        role,
        isDemo: true,
      });
    },
    signOut: async () => {
      setError(null);
      if (user?.isDemo || !auth) {
        setUser(null);
        return;
      }
      await firebaseSignOut(auth);
    },
  }), [error, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return value;
}
