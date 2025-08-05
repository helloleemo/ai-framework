import Header from '@/components/header1';
import Sidebar from '@/components/sidebar1';
import { useState } from 'react';

export default function Layout() {
  const [menuToggle, setMenuToggle] = useState(false);

  const toggleMenu = () => {
    setMenuToggle((pre) => !pre);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
        {/* <Header /> */}
      </div>
      <div className="flex overflow-auto w-fit  pt-12 h-screen scrollbar-fade">
        <Sidebar />
        {/* <Sidebar /> */}
      </div>
      {/* Artboard */}
    </>
  );
}
