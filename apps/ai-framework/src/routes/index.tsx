import { Routes, Route, Link } from 'react-router-dom';
import Login from '../features/auth/pages/login';
import Dashboard from '../features/dashboard/pages/dashboard';
import ReBuildLayout from '../shared/components/layout/layout';
import Artboard from '../features/pipeline/components/artboard/artboard';
import ViewAll from '../features/pipeline/components/view-all/view-all';
import ArtboardMenu from '../features/pipeline/components/artboard/artboard-menu';
import ArtboardTemp from '../features/pipeline/components/artboard/artboard-temp';
import CallbackPage from '@/features/auth/pages/call-back-page';

function checkAuth() {
  const token = localStorage.getItem('accessToken');
  return token ? true : false;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/ai-framework" element={<ReBuildLayout />}>
        <Route path="/ai-framework/artboard" element={<Artboard />} />
        {/* <Route path="/ai-framework/menu" element={<ArtboardMenu />} /> */}
        <Route path="/ai-framework/view-all" element={<ViewAll />} />
      </Route>

      {/* Others */}
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<CallbackPage />} />
    </Routes>
  );
}

export default AppRoutes;
