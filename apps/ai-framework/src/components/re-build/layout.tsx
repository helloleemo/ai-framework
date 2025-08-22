import BottomMenu from './layout/bottom';
import SidebarMenu from './layout/sidebar-menu';
import SwitchMenu from './layout/switch-menu';
import HeaderTop from './layout/header-top';
import { useState } from 'react';
import { CollapseIcon } from '../icon/collapse-icon';
import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/use-auth';

export default function ReBuildLayout() {
  // useAuthGuard();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);

  return (
    <div className="flex h-screen">
      <div
        className={`relative border-r transition-all duration-100 ${
          isCollapsed ? 'w-[0px]' : 'min-w-[320px]'
        }`}
      >
        <button
          className="absolute top-2 right-2 z-10"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <div
            className={`cursor-pointer rounded-md p-1 ${
              isCollapsed
                ? 'absolute top-0 left-5 hover:bg-blue-50'
                : 'hover:bg-neutral-100'
            }`}
          >
            <CollapseIcon
              className={`relative h-7 w-7 ${
                isCollapsed ? 'text-blue-500' : 'text-neutral-500'
              }`}
              fill="currentColor"
            />
          </div>
        </button>
        <div className="p-2">
          {!isCollapsed && (
            <>
              <HeaderTop />
              <SwitchMenu onSwitch={setActiveMenu} />
              <SidebarMenu activeMenu={activeMenu} />
              <BottomMenu />
            </>
          )}
        </div>
      </div>
      <div className="content m-2 w-full border border-red-500 bg-neutral-100">
        <Outlet />
      </div>
    </div>
  );
}
