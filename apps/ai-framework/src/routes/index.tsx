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
        <Route path="/ai-framework/artboard/:id" element={<Artboard />} />
        {/* <Route path="/ai-framework/menu" element={<ArtboardMenu />} /> */}
        <Route path="/ai-framework/view-all" element={<ViewAll />} />
        <Route path="/ai-framework/logs" element={<ViewAll />} />
        {/* 其他資料夾的路由 */}
        <Route path="/ai-framework/view-all" element={<ViewAll />} />
        <Route path="/ai-framework/logs" element={<div>執行記錄頁面</div>} />

        {/* 系統管理資料夾的路由 */}
        <Route
          path="/ai-framework/settings"
          element={<div>系統設定頁面</div>}
        />
        <Route path="/ai-framework/users" element={<div>使用者管理頁面</div>} />
        <Route
          path="/ai-framework/permissions"
          element={<div>權限設定頁面</div>}
        />

        {/* 監控中心資料夾的路由 */}
        <Route
          path="/ai-framework/monitoring"
          element={<div>系統監控頁面</div>}
        />
        <Route
          path="/ai-framework/performance"
          element={<div>效能分析頁面</div>}
        />
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
