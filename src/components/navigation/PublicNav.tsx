import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import MobileMenu from './MobileMenu';

const navLinks = [
  { to: '/episodes', label: 'Episodes' },
  { to: '/live', label: 'Live' },
  { to: '/clips', label: 'Clips' },
  { to: '/guests', label: 'Guests' },
  { to: '/articles', label: 'Articles' },
  { to: '/community', label: 'Community' },
  { to: '/about', label: 'About' },
];

export default function PublicNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header role="banner" style={{ borderBottom: '1px solid #8B2C6F33' }}>
      <a
        href="#main-content"
        className="absolute left-4 top-4 -translate-y-20 rounded px-3 py-2 text-sm focus:translate-y-0"
        style={{ backgroundColor: '#C9A227', color: '#1B1734' }}
      >
        Skip to content
      </a>
      <nav aria-label="Main navigation" className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link to="/" className="text-xl font-bold tracking-wide" style={{ color: '#C9A227' }} aria-label="MAJESTIC Muse – Home">
          MAJESTIC Muse
        </Link>

        <ul className="hidden lg:flex gap-6 text-sm" role="list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className="transition-colors hover:opacity-80"
                style={({ isActive }) => ({ color: isActive ? '#C9A227' : '#F8F4EC' })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex gap-3">
          <Link to="/newsletter" className="px-4 py-2 rounded text-sm font-medium transition-opacity hover:opacity-80" style={{ color: '#C9A227', border: '1px solid #C9A227' }}>
            Subscribe
          </Link>
          <Link to="/login" className="px-4 py-2 rounded text-sm font-medium" style={{ backgroundColor: '#8B2C6F', color: '#F8F4EC' }}>
            Sign In
          </Link>
        </div>

        <button
          type="button"
          aria-label="Open mobile menu"
          aria-expanded={menuOpen}
          className="lg:hidden p-2"
          style={{ color: '#F8F4EC' }}
          onClick={() => setMenuOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </nav>

      {menuOpen && <MobileMenu links={navLinks} onClose={() => setMenuOpen(false)} />}
    </header>
  );
}
