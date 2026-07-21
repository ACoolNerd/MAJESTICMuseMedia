import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Module from './pages/Module';

const publicPaths = ['live','episodes','clips','guests','articles','community','submit-your-story','be-a-guest','suggest-a-guest','work-with-us','partners','newsletter','about','privacy','terms','community-guidelines','accessibility'];
const appPaths = ['calendar','guests','live','media','review','capcut','distribution','youtube','community','leads','analytics','rights','tasks','approvals','ai','settings'];

export default function App() {
  return <Routes>
    <Route path="/" element={<Home/>}/>
    {publicPaths.map(path => <Route key={path} path={`/${path}`} element={<Module/>}/>)}
    <Route path="/episodes/:slug" element={<Module/>}/>
    <Route path="/guests/:slug" element={<Module/>}/>
    <Route path="/app" element={<Dashboard/>}/>
    <Route path="/app/executive" element={<Dashboard/>}/>
    <Route path="/app/episodes" element={<Module/>}/>
    {appPaths.map(path => <Route key={path} path={`/app/${path}`} element={<Module/>}/>)}
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
