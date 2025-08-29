import { Routes, Route, Link } from 'react-router-dom';
import Login from '@/pages/login';
import Dashboard from '@/pages/dashboard';
import ReBuildLayout from '@/components/layout';
import Artboard from '@/components/artboard/artboard';
import ViewAll from '@/components/view-all/view-all';
import ArtboardMenu from '@/components/artboard/artboard-menu';
import ArtboardTemp from '@/components/artboard/artboard-temp';

function returnToPrevious() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 transform text-center">
      <div className="w-[200px] overflow-hidden rounded-lg border">
        <img src="https://picsum.photos/600/400" alt="" />
      </div>
      <p className="pt-3 pb-2 text-lg font-semibold text-slate-800">
        Page not found
      </p>
      <button className="rounded-lg border border-slate-300 px-3 py-1 text-sm text-slate-500 transition-all duration-200 hover:bg-slate-50">
        <Link to="/">Go back</Link>
      </button>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/re-build" element={<ReBuildLayout />}>
        <Route path="/re-build/ai-framework/artboard" element={<Artboard />} />
        <Route
          path="/re-build/ai-framework/artboard-temp"
          element={<ArtboardTemp />}
        />
        <Route path="/re-build/ai-framework/menu" element={<ArtboardMenu />} />
        <Route path="/re-build/ai-framework/view-all" element={<ViewAll />} />
        <Route
          path="/re-build/ai-framework/artboard-temp"
          element={<ArtboardTemp />}
        />
      </Route>

      {/* Others */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={returnToPrevious()} />
    </Routes>
  );
}

export default AppRoutes;
