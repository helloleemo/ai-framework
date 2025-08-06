import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import Artboard from '@/pages/artboard';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
  };

  return (
    <div className="bg-neutral-50 ">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header toggleMenu={toggleMenu} />
      </div>
      <div className="flex w-fit pt-12">
        <Sidebar menuToggle={menuToggle} />
        <div className="p-3 ml-[320px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
