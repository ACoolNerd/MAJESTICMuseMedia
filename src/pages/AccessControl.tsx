import { CheckCircle2, KeyRound, ShieldCheck, UserCog } from 'lucide-react';
import { AppShell } from '../components/Shell';
import { useAuth } from '../features/auth/AuthContext';
import { roleLabels, rolePermissions } from '../features/auth/permissions';

export default function AccessControl() {
  const { user, firebaseConfigured, demoEnabled } = useAuth();
  if (!user) return null;

  return <AppShell>
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><span className="inline-flex items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-semibold text-[#8B2C6F]"><UserCog size={14}/> Phase 2 access control</span><h1 className="mt-4 font-serif text-4xl">Users, roles and permissions</h1><p className="mt-3 max-w-3xl text-lg leading-8 text-[#1B1734]/60">The application now evaluates private routes against an explicit permission model. Firebase custom claims remain the production authority.</p></div>
      </div>

      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><ShieldCheck className="text-[#8B2C6F]"/><p className="mt-4 text-sm text-[#1B1734]/55">Current role</p><h2 className="mt-1 font-serif text-2xl">{roleLabels[user.role]}</h2><p className="mt-2 text-sm text-[#1B1734]/55">{user.displayName}</p></article>
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><KeyRound className="text-[#8B2C6F]"/><p className="mt-4 text-sm text-[#1B1734]/55">Authentication</p><h2 className="mt-1 font-serif text-2xl">{firebaseConfigured ? 'Firebase configured' : 'Connection required'}</h2><p className="mt-2 text-sm text-[#1B1734]/55">{user.isDemo ? 'Local demo session' : 'Firebase session'}</p></article>
        <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><CheckCircle2 className="text-[#8B2C6F]"/><p className="mt-4 text-sm text-[#1B1734]/55">Permissions granted</p><h2 className="mt-1 font-serif text-2xl">{rolePermissions[user.role].length}</h2><p className="mt-2 text-sm text-[#1B1734]/55">Demo capability: {demoEnabled ? 'enabled locally' : 'disabled'}</p></article>
      </section>

      <section className="mt-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#1B1734]/5"><h2 className="font-serif text-2xl">Granted permissions</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{rolePermissions[user.role].map(permission => <div key={permission} className="flex items-center gap-3 rounded-2xl border border-[#1B1734]/8 p-4"><CheckCircle2 size={18} className="text-green-700"/><code className="text-sm">{permission}</code></div>)}</div>{rolePermissions[user.role].length === 0 && <p className="mt-4 text-[#1B1734]/60">This role has no private operating-system permissions.</p>}</section>

      <section className="mt-5 rounded-3xl bg-[#1B1734] p-6 text-white"><h2 className="font-serif text-2xl">Production setup still required</h2><p className="mt-3 max-w-3xl leading-7 text-white/70">Create Firebase users, assign custom role claims through a trusted server or Admin SDK process, deploy the updated Firestore rules and keep <code className="rounded bg-white/10 px-2 py-1">VITE_ENABLE_DEMO_AUTH=false</code> in staging and production.</p></section>
    </div>
  </AppShell>;
}
