import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarLink {
  to: string;
  label: string;
  icon: string;
}

const sections: Array<{ heading: string; links: SidebarLink[] }> = [
  {
    heading: 'Overview',
    links: [
      { to: '/app', label: 'Dashboard', icon: '⬡' },
      { to: '/app/executive', label: 'Executive View', icon: '◈' },
      { to: '/app/calendar', label: 'Calendar', icon: '◷' },
    ],
  },
  {
    heading: 'Production',
    links: [
      { to: '/app/episodes', label: 'Episodes', icon: '◉' },
      { to: '/app/guests', label: 'Guests', icon: '◎' },
      { to: '/app/media', label: 'Media Library', icon: '◫' },
      { to: '/app/review', label: 'Review & Feedback', icon: '◍' },
      { to: '/app/capcut', label: 'CapCut Handoff', icon: '◈' },
      { to: '/app/rights', label: 'Rights & Clearance', icon: '◇' },
    ],
  },
  {
    heading: 'Publishing',
    links: [
      { to: '/app/distribution', label: 'Distribution', icon: '◐' },
      { to: '/app/youtube', label: 'YouTube', icon: '▶' },
      { to: '/app/live', label: 'Live Studio', icon: '◌' },
    ],
  },
  {
    heading: 'Community',
    links: [
      { to: '/app/community', label: 'Community', icon: '◙' },
      { to: '/app/leads', label: 'Leads & CRM', icon: '◆' },
    ],
  },
  {
    heading: 'Intelligence',
    links: [
      { to: '/app/analytics', label: 'Analytics', icon: '◱' },
      { to: '/app/ai', label: 'AI Assist', icon: '✦' },
    ],
  },
  {
    heading: 'Workflow',
    links: [
      { to: '/app/tasks', label: 'Tasks', icon: '◻' },
      { to: '/app/approvals', label: 'Approvals', icon: '◼' },
      { to: '/app/settings', label: 'Settings', icon: '⚙' },
    ],
  },
];

const mobileLinks = sections.flatMap((section) => section.links).slice(0, 8);

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <>
      <div className="lg:hidden sticky top-0 z-10 mb-6" style={{ backgroundColor: '#13102A', borderBottom: '1px solid #8B2C6F33' }}>
        <div className="px-5 py-4">
          <h1 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#C9A227' }}>
            MAJESTIC Muse Studio
          </h1>
          <p className="text-xs mt-1" style={{ color: '#D8A7B166' }}>
            Production operating system for Marchette
          </p>
        </div>
        <nav aria-label="Mobile app navigation" className="flex gap-2 overflow-x-auto px-4 pb-4">
          {mobileLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/app'}
              className="whitespace-nowrap rounded-full px-3 py-2 text-xs"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#8B2C6F33' : '#FFFFFF11',
                color: isActive ? '#C9A227' : '#F8F4ECCC',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <aside aria-label="Application navigation" className="hidden lg:flex flex-col w-64 flex-shrink-0 h-screen sticky top-0 overflow-y-auto" style={{ backgroundColor: '#13102A', borderRight: '1px solid #8B2C6F33' }}>
        <div className="px-5 py-6" style={{ borderBottom: '1px solid #8B2C6F33' }}>
          <h1 className="text-sm font-bold tracking-widest uppercase" style={{ color: '#C9A227' }}>
            MAJESTIC Muse
          </h1>
          <p className="text-xs mt-1" style={{ color: '#D8A7B166' }}>
            Studio
          </p>
        </div>

        <nav aria-label="App sections" className="flex-1 px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.heading}>
              <p className="px-2 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B2C6F' }}>
                {section.heading}
              </p>
              <ul role="list" className="space-y-0.5">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/app'}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all"
                      style={({ isActive }) => ({
                        backgroundColor: isActive ? '#8B2C6F22' : 'transparent',
                        color: isActive ? '#C9A227' : '#F8F4EC99',
                        fontWeight: isActive ? '600' : '400',
                      })}
                    >
                      <span aria-hidden="true" className="text-base">
                        {link.icon}
                      </span>
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-4 py-4" style={{ borderTop: '1px solid #8B2C6F33' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: '#8B2C6F', color: '#F8F4EC' }} aria-hidden="true">
              {user?.name?.[0] ?? 'M'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#F8F4EC' }}>
                {user?.name}
              </p>
              <p className="text-xs truncate" style={{ color: '#D8A7B166' }}>
                {user?.role}
              </p>
            </div>
          </div>
          <button type="button" onClick={handleSignOut} className="w-full text-xs py-2 rounded text-left px-2 transition-opacity hover:opacity-70" style={{ color: '#D8A7B1' }} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
