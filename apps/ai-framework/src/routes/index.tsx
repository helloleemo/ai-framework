import { Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/home';
import Login from '@/pages/login';
import Layout from '@/components/layout';
import Menu from '@/components/sidebar-menu';
import ArtboardRoot from '@/pages/artboard-root';
import Dashboard from '@/pages/dashboard';
import TempArtboard from '@/pages/artboard-temp';
import ReBuildLayout from '@/components/re-build/layout';
import Artboard from '@/components/re-build/artboard';

function returnToPrevious() {
  return (
    <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3">
      <div className="w-[200px]  rounded-lg overflow-hidden border">
        <img src="https://picsum.photos/600/400" alt="" />
      </div>
      <p className="text-lg font-semibold text-slate-800 pt-3 pb-2">
        Page not found
      </p>
      <button className="text-sm text-slate-500 border border-slate-300 px-3 py-1 rounded-lg hover:bg-slate-50 transition-all duration-200">
        <Link to="/">Go back</Link>
      </button>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* AI framework */}
      <Route element={<Layout />}>
        <Route path="/ai-framework" element={<Home />} />
        <Route path="/ai-framework/artboard" element={<ArtboardRoot />}>
          <Route index element={<Menu />} />
          <Route path="temp" element={<TempArtboard />} />
        </Route>
      </Route>
      {/* re-build */}
      <Route path="/re-build" element={<ReBuildLayout />}>
        <Route path="/re-build/ai-framework" element={<Artboard />} />
      </Route>

      {/* Others */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={returnToPrevious()} />
    </Routes>
  );
}

export default AppRoutes;
