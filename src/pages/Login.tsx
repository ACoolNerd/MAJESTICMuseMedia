import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { roleLabels } from '../features/auth/permissions';
import type { Role } from '../types';

const demoRoles: Exclude<Role, 'guest' | 'partner' | 'public'>[] = ['ceo', 'coo', 'post', 'social', 'crew'];

export default function Login() {
  const { user, signIn, signInDemo, firebaseConfigured, demoEnabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const from = (location.state as { from?: string } | null)?.from ?? '/app';

  if (user) {
    return <Navigate to={from} replace />;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Sign-in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  function enterDemo(role: Exclude<Role, 'guest' | 'partner' | 'public'>) {
    try {
      signInDemo(role);
      navigate(from, { replace: true });
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Demo sign-in failed.');
    }
  }

  return <main className="muse-gradient min-h-screen px-5 py-12 text-[#F8F4EC]">
    <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
      <section>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm"><Sparkles size={16} className="text-[#C9A227]"/> MAJESTICMuseMedia.ai</span>
        <h1 className="mt-7 max-w-3xl font-serif text-5xl leading-tight md:text-7xl">Enter the media operating system.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Private production, approvals, rights, distribution, community, analytics and Muse Intelligence—governed by role and recorded action.</p>
        <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/15 bg-white/8 p-4"><ShieldCheck className="text-[#D8A7B1]"/><p className="mt-3 font-semibold">Authority preserved</p><p className="mt-1 text-sm text-white/60">Marchette retains final editorial and release authority.</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/8 p-4"><KeyRound className="text-[#C9A227]"/><p className="mt-3 font-semibold">Access by role</p><p className="mt-1 text-sm text-white/60">Every private module checks a defined permission.</p></div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#F8F4EC] p-6 text-[#1B1734] shadow-2xl md:p-8">
        <h2 className="font-serif text-3xl">Control Center sign in</h2>
        <p className="mt-2 text-sm leading-6 text-[#1B1734]/60">Use the account assigned by the MAJESTIC Muse administrator.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="block text-sm font-semibold">Email<input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 bg-white px-4 py-3 outline-none focus:border-[#8B2C6F]" autoComplete="email"/></label>
          <label className="block text-sm font-semibold">Password<input required type="password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#1B1734]/15 bg-white px-4 py-3 outline-none focus:border-[#8B2C6F]" autoComplete="current-password"/></label>
          {message && <p role="alert" className="rounded-2xl bg-red-50 p-3 text-sm text-red-800">{message}</p>}
          <button disabled={submitting || !firebaseConfigured} className="w-full rounded-full bg-[#1B1734] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-45">{submitting ? 'Signing in…' : firebaseConfigured ? 'Sign in securely' : 'Firebase connection required'}</button>
        </form>

        {!firebaseConfigured && <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-6 text-amber-900">Firebase Authentication is not configured. Add the approved environment values before production use.</p>}

        {demoEnabled && !firebaseConfigured && <div className="mt-6 border-t border-[#1B1734]/10 pt-6"><p className="text-sm font-semibold">Local development demo</p><p className="mt-1 text-xs leading-5 text-[#1B1734]/55">Demo mode is explicitly enabled and must remain disabled in production.</p><div className="mt-3 grid gap-2">{demoRoles.map(role => <button key={role} type="button" onClick={() => enterDemo(role)} className="rounded-xl border border-[#1B1734]/10 bg-white px-4 py-2 text-left text-sm hover:border-[#8B2C6F]">Continue as {roleLabels[role]}</button>)}</div></div>}
      </section>
    </div>
  </main>;
}
