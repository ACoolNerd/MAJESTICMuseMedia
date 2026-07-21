import { Link, Outlet } from 'react-router-dom';
import PublicNav from '../components/navigation/PublicNav';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#1B1734', color: '#F8F4EC' }}>
      <PublicNav />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <footer className="px-6 py-10 text-center text-sm" style={{ borderTop: '1px solid #8B2C6F33', color: '#D8A7B1' }}>
        <p className="mb-2 font-semibold" style={{ color: '#C9A227' }}>
          MAJESTIC Muse Podcast by Marchette
        </p>
        <p className="mb-4">Where faith, purpose, and identity find their voice.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-4 mb-4 text-xs">
          <Link to="/privacy" className="hover:underline" style={{ color: '#F8F4EC' }}>
            Privacy
          </Link>
          <Link to="/terms" className="hover:underline" style={{ color: '#F8F4EC' }}>
            Terms
          </Link>
          <Link to="/community-guidelines" className="hover:underline" style={{ color: '#F8F4EC' }}>
            Community Guidelines
          </Link>
          <Link to="/accessibility" className="hover:underline" style={{ color: '#F8F4EC' }}>
            Accessibility
          </Link>
        </nav>
        <p className="text-xs" style={{ color: '#D8A7B188' }}>
          © {new Date().getFullYear()} MAJESTICMuseMedia.ai. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
