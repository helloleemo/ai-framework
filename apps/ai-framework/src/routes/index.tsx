import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home';
import Page1 from '../pages/page1';
import Details from '../components/details';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/page-1" element={<Page1 />}>
        <Route path="details" element={<Details />} />
      </Route>
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}

export default AppRoutes;
