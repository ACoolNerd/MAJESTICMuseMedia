import { LogOut, Menu, Radio, Search, ShieldCheck, Sparkles, X } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { navModules } from '../data';
import { useAuth } from '../features/auth/AuthContext';
import { hasPermission, roleLabels, routePermissions } from '../features/auth/permissions';

export function PublicHeader() {
  return <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-[#F8F4EC] md:px-10">
    <Link to="/" className="font-serif text-lg font-semibold tracking-wide">MAJESTIC <span className="text-[#D8A7B1]">Muse</span></Link>
    <nav className="hidden gap-7 text-sm md:flex"><Link to="/episodes">Episodes</Link><Link to="/live">Live</Link><Link to="/about">About</Link><Link to="/work-with-us">Work With Us</Link></nav>
    <Link to="/app" className="rounded-full border border-[#C9A227]/60 px-4 py-2 text-sm">Control Center</Link>
  </header>;
}

function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'MM';
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const visibleModules = useMemo(() => {
    if (!user) return [];
    return navModules.filter(([, path]) => {
      const permission = routePermissions[path];
      return !permission || hasPermission(user.role, permission);
    });
  }, [user]);

  async function leave() {
    await signOut();
    navigate('/login', { replace: true });
  }

  const displayName = user?.displayName ?? 'MAJESTIC Muse';
  const roleLabel = user ? roleLabels[user.role] : 'Signed out';

  return <div className="min-h-screen bg-[#F8F4EC] text-[#1B1734]">
    <aside className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#1B1734] text-[#F8F4EC] transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between border-b border-white/10 p-5"><Link to="/app" className="font-serif text-xl">MAJESTIC <span className="text-[#D8A7B1]">Muse</span></Link><button aria-label="Close menu" onClick={() => setOpen(false)} className="lg:hidden"><X /></button></div>
      <nav className="h-[calc(100vh-166px)] overflow-y-auto p-3">{visibleModules.map(([label, path]) => <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => `mb-1 block rounded-xl px-4 py-2.5 text-sm ${isActive ? 'bg-[#8B2C6F] text-white' : 'text-[#F8F4EC]/75 hover:bg-white/10'}`}>{label}</NavLink>)}{user && hasPermission(user.role, 'users.manage') && <NavLink to="/app/settings/access" onClick={() => setOpen(false)} className={({ isActive }) => `mb-1 block rounded-xl px-4 py-2.5 text-sm ${isActive ? 'bg-[#8B2C6F] text-white' : 'text-[#F8F4EC]/75 hover:bg-white/10'}`}>Access Control</NavLink>}</nav>
      <div className="border-t border-white/10 p-3"><button onClick={leave} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-white/75 hover:bg-white/10"><LogOut size={17}/> Sign out</button></div>
    </aside>
    <div className="lg:pl-72">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-[#1B1734]/10 bg-[#F8F4EC]/90 px-4 backdrop-blur md:px-7"><button aria-label="Open menu" onClick={() => setOpen(true)} className="lg:hidden"><Menu /></button><div className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#1B1734]/55"><Search size={16} /> Search episodes, guests, assets, comments...</div><div className="hidden items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-2 text-xs font-semibold text-[#8B2C6F] xl:flex"><ShieldCheck size={14} /> {roleLabel}</div><div className="hidden items-center gap-2 rounded-full bg-[#8B2C6F]/10 px-3 py-2 text-xs font-semibold text-[#8B2C6F] sm:flex"><Radio size={14} /> No live event</div><div title={`${displayName} — ${roleLabel}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227] text-xs font-bold">{initials(displayName)}</div></header>
      <main className="p-4 md:p-7">{children}</main>
    </div>
  </div>;
}

export function MuseBadge() { return <span className="inline-flex items-center gap-1 rounded-full bg-[#8B2C6F]/10 px-3 py-1 text-xs font-semibold text-[#8B2C6F]"><Sparkles size={13}/> Muse Intelligence</span>; }
