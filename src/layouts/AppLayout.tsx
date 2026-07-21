import { Outlet } from 'react-router-dom';
import AppSidebar from '../components/navigation/AppSidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen lg:flex" style={{ backgroundColor: '#0F0D26', color: '#F8F4EC' }}>
      <AppSidebar />
      <main id="main-content" className="flex-1 overflow-auto p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
