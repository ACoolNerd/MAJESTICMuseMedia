import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import type { Permission } from './features/auth/permissions';
import { OperationsProvider } from './features/operations/OperationsContext';
import { MediaProvider } from './features/media/MediaContext';
import { PlatformProvider } from './features/platforms/PlatformContext';
import { GrowthProvider } from './features/intelligence/GrowthContext';
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
import LiveControl from './pages/LiveControl';
import Distribution from './pages/Distribution';
import YouTubeCenter from './pages/YouTubeCenter';
import MuseIntelligence from './pages/MuseIntelligence';
import Analytics from './pages/Analytics';
import Leads from './pages/Leads';
import Repurposing from './pages/Repurposing';

const publicPaths = ['live','episodes','clips','guests','articles','community','about','privacy','terms','community-guidelines','accessibility'];
const publicFormPaths = ['submit-your-story','be-a-guest','suggest-a-guest','work-with-us','partners','newsletter'];

const appRoutes = [
  ['calendar', 'calendar.manage'],
  ['community', 'community.manage'],
  ['rights', 'rights.manage'],
  ['tasks', 'tasks.manage'],
  ['approvals', 'approvals.manage'],
  ['settings', 'settings.manage'],
] satisfies readonly (readonly [string, Permission])[];

export default function App() {
  return <AuthProvider><OperationsProvider><MediaProvider><PlatformProvider><GrowthProvider><Routes>
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
    <Route path="/app/live" element={<ProtectedRoute permission="live.manage"><LiveControl/></ProtectedRoute>}/>
    <Route path="/app/distribution" element={<ProtectedRoute permission="distribution.manage"><Distribution/></ProtectedRoute>}/>
    <Route path="/app/youtube" element={<ProtectedRoute permission="youtube.manage"><YouTubeCenter/></ProtectedRoute>}/>
    <Route path="/app/repurposing" element={<ProtectedRoute permission="ai.use"><Repurposing/></ProtectedRoute>}/>
    <Route path="/app/leads" element={<ProtectedRoute permission="leads.manage"><Leads/></ProtectedRoute>}/>
    <Route path="/app/analytics" element={<ProtectedRoute permission="analytics.view"><Analytics/></ProtectedRoute>}/>
    <Route path="/app/ai" element={<ProtectedRoute permission="ai.use"><MuseIntelligence/></ProtectedRoute>}/>
    <Route path="/app/settings/access" element={<ProtectedRoute permission="users.manage"><AccessControl/></ProtectedRoute>}/>
    {appRoutes.map(([path, permission]) => <Route key={path} path={`/app/${path}`} element={<ProtectedRoute permission={permission}><Module/></ProtectedRoute>}/>) }

    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes></GrowthProvider></PlatformProvider></MediaProvider></OperationsProvider></AuthProvider>;
}
