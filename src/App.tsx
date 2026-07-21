import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import type { Permission } from './features/auth/permissions';
import { OperationsProvider } from './features/operations/OperationsContext';
import { MediaProvider } from './features/media/MediaContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Module from './pages/Module';
import Login from './pages/Login';
import AccessControl from './pages/AccessControl';
import Episodes from './pages/Episodes';
import Guests from './pages/Guests';
import PublicForm from './pages/PublicForm';
import Media from './pages/Media';
import Review from './pages/Review';
import CapCut from './pages/CapCut';

const publicPaths = ['live','episodes','clips','guests','articles','community','about','privacy','terms','community-guidelines','accessibility'];
const publicFormPaths = ['submit-your-story','be-a-guest','suggest-a-guest','work-with-us','partners','newsletter'];

const appRoutes = [
  ['calendar', 'calendar.manage'],
  ['live', 'live.manage'],
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
  return <AuthProvider><OperationsProvider><MediaProvider><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    {publicPaths.map(path => <Route key={path} path={`/${path}`} element={<Module/>}/>) }
    {publicFormPaths.map(path => <Route key={path} path={`/${path}`} element={<PublicForm/>}/>) }
    <Route path="/episodes/:slug" element={<Module/>}/>
    <Route path="/guests/:slug" element={<Module/>}/>

    <Route path="/app" element={<ProtectedRoute permission="dashboard.view"><Dashboard/></ProtectedRoute>}/>
    <Route path="/app/executive" element={<ProtectedRoute permission="dashboard.view"><Dashboard/></ProtectedRoute>}/>
    <Route path="/app/episodes" element={<ProtectedRoute permission="episodes.view"><Episodes/></ProtectedRoute>}/>
    <Route path="/app/guests" element={<ProtectedRoute permission="guests.view"><Guests/></ProtectedRoute>}/>
    <Route path="/app/media" element={<ProtectedRoute permission="media.view"><Media/></ProtectedRoute>}/>
    <Route path="/app/review" element={<ProtectedRoute permission="review.manage"><Review/></ProtectedRoute>}/>
    <Route path="/app/capcut" element={<ProtectedRoute permission="capcut.manage"><CapCut/></ProtectedRoute>}/>
    <Route path="/app/settings/access" element={<ProtectedRoute permission="users.manage"><AccessControl/></ProtectedRoute>}/>
    {appRoutes.map(([path, permission]) => <Route key={path} path={`/app/${path}`} element={<ProtectedRoute permission={permission}><Module/></ProtectedRoute>}/>) }

    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></MediaProvider></OperationsProvider></AuthProvider>;
}
