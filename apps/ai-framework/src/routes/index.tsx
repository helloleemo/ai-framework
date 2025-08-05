import { Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/home';
import Page1 from '@/pages/page1';
import Details from '@/components/details';
import Login from '@/pages/login';
import Artboard from '@/pages/artboard';
import Layout from '@/components/layout';

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
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />`
        <Route path="/page-1" element={<Page1 />} />
        <Route path="details" element={<Details />} />
        <Route path="/artboard" element={<Layout />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={returnToPrevious()} />
    </Routes>
  );
}

export default AppRoutes;
