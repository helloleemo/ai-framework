import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { Outlet } from 'react-router-dom';
import { MenuProvider, useMenu } from '@/hooks/menu-toggle';
import { DnDProvider } from '@/hooks/use-dnd-flow';
// import { ReactFlowProvider } from '@xyflow/react';

function LayoutContent() {
  const { menuToggle } = useMenu();
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>
      <DnDProvider>
        <div className="flex w-fit pt-12">
          <Sidebar />
          <div
            className={`${
              menuToggle ? 'ml-0' : 'ml-[320px]'
            } fixed p-2 transition-all duration-100`}
          >
            <Outlet />
          </div>
        </div>
      </DnDProvider>
    </div>
  );
}
export default function Layout() {
  return (
    <MenuProvider>
      <LayoutContent />
    </MenuProvider>
  );
}
