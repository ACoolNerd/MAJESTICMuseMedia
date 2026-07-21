import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import type { Permission } from './features/auth/permissions';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Module from './pages/Module';
import Login from './pages/Login';
import AccessControl from './pages/AccessControl';

const publicPaths = ['live','episodes','clips','guests','articles','community','submit-your-story','be-a-guest','suggest-a-guest','work-with-us','partners','newsletter','about','privacy','terms','community-guidelines','accessibility'];

const appRoutes = [
  ['calendar', 'calendar.manage'],
  ['guests', 'guests.view'],
  ['live', 'live.manage'],
  ['media', 'media.view'],
  ['review', 'review.manage'],
  ['capcut', 'capcut.manage'],
  ['distribution', 'distribution.manage'],
  ['youtube', 'youtube.manage'],
  ['community', 'community.manage'],
  ['leads', 'leads.manage'],
  ['analytics', 'analytics.view'],
  ['rights', 'rights.manage'],
  ['tasks', 'tasks.manage'],
  ['approvals', 'approvals.manage'],
  ['ai', 'ai.use'],
  ['settings', 'settings.manage'],
] satisfies readonly (readonly [string, Permission])[];

export default function App() {
  return <AuthProvider><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    {publicPaths.map(path => <Route key={path} path={`/${path}`} element={<Module/>}/>)}
    <Route path="/episodes/:slug" element={<Module/>}/>
    <Route path="/guests/:slug" element={<Module/>}/>

    <Route path="/app" element={<ProtectedRoute permission="dashboard.view"><Dashboard/></ProtectedRoute>}/>
    <Route path="/app/executive" element={<ProtectedRoute permission="dashboard.view"><Dashboard/></ProtectedRoute>}/>
    <Route path="/app/episodes" element={<ProtectedRoute permission="episodes.view"><Module/></ProtectedRoute>}/>
    <Route path="/app/settings/access" element={<ProtectedRoute permission="users.manage"><AccessControl/></ProtectedRoute>}/>
    {appRoutes.map(([path, permission]) => <Route key={path} path={`/app/${path}`} element={<ProtectedRoute permission={permission}><Module/></ProtectedRoute>}/>)}

    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></AuthProvider>;
}
