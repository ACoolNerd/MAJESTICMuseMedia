import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export default function LoginPage() {
  const [email, setEmail] = useState('marchette@majesticmusemedia.ai');
  const [password, setPassword] = useState('majestic8');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, firebaseReady } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? 'Please check your login details.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/app');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#1B1734' }}>
      <div className="w-full max-w-md rounded-2xl px-8 py-12" style={{ backgroundColor: '#13102A', border: '1px solid #8B2C6F33' }}>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#C9A227' }}>
            MAJESTIC Muse
          </h1>
          <p className="text-sm" style={{ color: '#D8A7B1' }}>
            Where faith, purpose, and identity find their voice.
          </p>
        </div>

        {!firebaseReady && (
          <div className="mb-6 rounded-lg px-4 py-3 text-sm text-center" style={{ backgroundColor: '#8B2C6F22', border: '1px solid #8B2C6F', color: '#F8F4EC' }}>
            Running in demo mode. Firebase is not configured.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Sign in form">
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm mb-2" style={{ color: '#F8F4EC' }}>
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: '#2A2150', border: '1px solid #8B2C6F', color: '#F8F4EC' }}
              aria-label="Email address"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm mb-2" style={{ color: '#F8F4EC' }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 text-sm outline-none focus:ring-2"
              style={{ backgroundColor: '#2A2150', border: '1px solid #8B2C6F', color: '#F8F4EC' }}
              aria-label="Password"
            />
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-center" style={{ color: '#FCA5A5' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-3 text-sm font-semibold transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#C9A227', color: '#1B1734' }}
            aria-label="Sign in"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-xs" style={{ color: '#D8A7B1' }}>
          <a href="/" style={{ color: '#C9A227' }}>
            ← Back to site
          </a>
        </p>
      </div>
    </div>
  );
}
