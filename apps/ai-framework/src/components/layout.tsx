import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { useState } from 'react';

export default function Layout() {
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((prev) => !prev);
  };

  return (
    <div className="bg-neutral-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header toggleMenu={toggleMenu} />
      </div>
      <div className="flex overflow-auto w-fit pt-12 h-screen scrollbar-fade">
        <Sidebar menuToggle={menuToggle} />
      </div>
    </div>
  );
}
