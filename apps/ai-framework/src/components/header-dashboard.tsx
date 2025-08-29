import { logoutAPI } from '@/api/auth';
import { LogoutIcon } from '@/shared/ui/icon/logout-icon';
import { UserIcon } from '@/shared/ui/icon/user-icon';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeaderDashboard() {
  const [isLogin, setLogin] = useState(true);
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || '',
  );
  const navigator = useNavigate();

  const handleLogout = () => {
    logoutAPI()
      .then(() => {
        setLogin(false);
        setUserName('');
        localStorage.removeItem('code');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userName');
        navigator('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      })
      .finally(() => {
        navigator('/');
        console.log('Logout process completed');
      });
  };

  return (
    <header className="fixed z-50 flex w-full items-center justify-between border-b bg-white px-4 py-2">
      {/* left */}
      <div className="flex items-center gap-4">
        <img className="w-[120px]" src="logo.svg" alt="" />
      </div>
      {/* right */}
      <div className="flex items-center gap-4">
        <div className="user flex items-center gap-1">
          <UserIcon className="text-xl text-slate-800" />
          <p className="text-sm text-slate-800">{userName || 'User name'}</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <LogoutIcon
                className="ml-2 cursor-pointer rounded-sm p-1 text-3xl hover:bg-gray-100"
                onClick={handleLogout}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
