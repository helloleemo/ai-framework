import BottomMenu from './layout/bottom';
import SidebarMenu from './layout/sidebar-menu';
import SwitchMenu from './layout/switch-menu';
import HeaderTop from './layout/header-top';
import { useState } from 'react';
import { CollapseIcon } from '../icon/collapse-icon';
import { Outlet } from 'react-router-dom';
import { useAuthGuard } from '@/hooks/use-auth';

export default function ReBuildLayout() {
  useAuthGuard();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="h-screen flex">
      {/* sidebar all */}

      <div
        className={`border-r relative transition-all duration-100 ${
          isCollapsed ? 'w-[0px]' : 'min-w-[340px]'
        }`}
      >
        <button
          className="absolute top-2 right-2 z-10"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          <div
            className={`p-1 rounded-md cursor-pointer ${
              isCollapsed
                ? 'absolute top-0 left-5 hover:bg-blue-50'
                : 'hover:bg-neutral-100'
            }`}
          >
            <CollapseIcon
              className={`w-7 h-7 relative ${
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
              <SwitchMenu />
              <SidebarMenu />
              <BottomMenu />
            </>
          )}
        </div>
      </div>
      <div className="content m-2 border-red-500 border w-full bg-neutral-100">
        <Outlet />
      </div>
    </div>
  );
}
