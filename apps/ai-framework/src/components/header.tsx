import { LogoutIcon } from '@/components/icon/logout-icon';
import { UserIcon } from '@/components/icon/user-icon';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { MenuToggleIcon } from './icon/menu-toggle-icon';
import { useMenu } from '@/hooks/menu-toggle';

export default function Header() {
  const { toggleMenu } = useMenu();
  const [isLogin, setLogin] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = () => {
    setLogin(true);
    setUserName('Pon Klementieff');
  };
  const handleLogout = () => {
    setLogin(false);
    setUserName('');
  };

  return (
    <header className="border-b bg-white px-4 py-2 flex justify-between items-center">
      {/* left */}
      <div className="flex items-center gap-4 ">
        {/* Removed redundant conditional rendering of MenuToggleIcon */}
        <MenuToggleIcon
          onClick={toggleMenu}
          className="cursor-pointer text-[24px] p-2 rounded-sm hover:bg-neutral-100"
        />
        <img className="w-[120px]" src="logo.svg" alt="" />
        <p className="text-lg font-bold text-slate-800">Project name</p>
      </div>
      {/* right */}
      <div className="flex items-center gap-4">
        {isLogin ? (
          <div className="user flex items-center gap-1">
            <UserIcon className="text-slate-800" />
            <p className="text-slate-800 text-sm ">{userName}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <LogoutIcon
                  className="ml-2 cursor-pointer text-3xl  rounded-sm p-1 hover:bg-gray-100"
                  onClick={handleLogout}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ) : (
          <div className="login">
            <Button size="sm" variant="outline" onClick={handleLogin}>
              Login
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
