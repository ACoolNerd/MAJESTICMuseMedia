import { useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';

interface MobileMenuProps {
  links: Array<{ to: string; label: string }>;
  onClose: () => void;
}

export default function MobileMenu({ links, onClose }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    menuRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#1B1734' }}
      tabIndex={-1}
    >
      <div className="flex justify-between items-center px-6 py-4" style={{ borderBottom: '1px solid #8B2C6F33' }}>
        <span className="text-xl font-bold" style={{ color: '#C9A227' }}>
          MAJESTIC Muse
        </span>
        <button type="button" onClick={onClose} aria-label="Close mobile menu" style={{ color: '#F8F4EC' }} className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <nav aria-label="Mobile navigation" className="flex-1 px-6 py-8">
        <ul className="space-y-4" role="list">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={onClose}
                className="text-2xl font-light block py-2"
                style={({ isActive }) => ({ color: isActive ? '#C9A227' : '#F8F4EC' })}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-8 space-y-3">
          <Link to="/newsletter" onClick={onClose} className="block text-center py-3 rounded font-medium" style={{ border: '1px solid #C9A227', color: '#C9A227' }}>
            Subscribe to Newsletter
          </Link>
          <Link to="/login" onClick={onClose} className="block text-center py-3 rounded font-medium" style={{ backgroundColor: '#8B2C6F', color: '#F8F4EC' }}>
            Sign In
          </Link>
        </div>
      </nav>
    </div>
  );
}
