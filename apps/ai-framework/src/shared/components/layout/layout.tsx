import BottomMenu from './bottom';
import SidebarMenu from './sidebar-menu';
import SwitchMenu from './switch-menu';
import HeaderTop from './header-top';
import { useEffect, useState } from 'react';
import { CollapseIcon } from '../../ui/icon/collapse-icon';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthGuard } from '@/features/auth/hooks/use-auth';

export default function ReBuildLayout() {
  const { checkAuth, redirectToLogin } = useAuthGuard();

  useEffect(() => {
    const isAuth = checkAuth();
    if (!isAuth) {
      console.log('YOU CANNOT PASS!');
      redirectToLogin();
    }
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);

  return (
    <div className="flex h-screen">
      <div
        style={{
          width: isCollapsed ? '0px' : '320px',
          transition: 'width 0.1s ease-in-out',
        }}
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
      <div className="content m-2 w-full bg-neutral-100">
        <Outlet />
      </div>
    </div>
  );
}
