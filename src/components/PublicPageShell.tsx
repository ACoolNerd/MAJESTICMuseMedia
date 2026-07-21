import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  ['Episodes', '/episodes'],
  ['Live', '/live'],
  ['Guests', '/guests'],
  ['Articles', '/articles'],
  ['Community', '/community'],
  ['About', '/about'],
] as const;

export function PublicPageShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#F8F4EC] text-[#1B1734]">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
    <header className="border-b border-white/10 bg-[#1B1734] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between md:px-10">
        <Link to="/" className="font-serif text-xl font-semibold">MAJESTIC <span className="text-[#D8A7B1]">Muse</span></Link>
        <nav aria-label="Primary" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">{links.map(([label, path]) => <NavLink key={path} to={path} className={({ isActive }) => isActive ? 'text-[#C9A227]' : 'text-white/70 hover:text-white'}>{label}</NavLink>)}</nav>
        <Link to="/newsletter" className="rounded-full bg-[#C9A227] px-4 py-2 text-center text-sm font-semibold text-[#1B1734]">Join the community</Link>
      </div>
    </header>
    <main id="main-content">{children}</main>
    <footer className="mt-20 bg-[#1B1734] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:px-10"><div><p className="font-serif text-2xl">MAJESTIC Muse Podcast by Marchette</p><p className="mt-2 max-w-xl text-sm leading-6 text-white/55">Where faith, purpose, and identity find their voice.</p></div><div className="flex flex-wrap gap-4 text-xs text-white/55"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/community-guidelines">Community Guidelines</Link><Link to="/accessibility">Accessibility</Link></div></div>
    </footer>
  </div>;
}
