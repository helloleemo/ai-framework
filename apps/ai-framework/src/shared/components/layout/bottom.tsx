import { useAuthGuard } from '@/features/auth/hooks/use-auth';
import { CogIcon } from '@/shared/ui/icon/cog-icon';
import { LogoutIcon } from '@/shared/ui/icon/logout-icon';
import { UserIcon } from '@/shared/ui/icon/user-icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomMenu() {
  const navigator = useNavigate();
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const { redirectToLogin } = useAuthGuard();

  const bottomMenu = [
    {
      name: name,
      icon: <UserIcon />,
      linkTo: '/user',
      onclick: () => console.log('click user'),
      // onClick: (navigate: any) => navigate('/user'),
    },
    {
      name: 'Settings',
      icon: <CogIcon />,
      linkTo: '/settings',
      onclick: () => console.log('click settings'),
      // onClick: (navigate: any) => navigate('/settings'),
    },
    {
      name: 'Logout',
      icon: <LogoutIcon />,
      onClick: (navigate: any, handleLogout: any) => handleLogout(),
    },
  ];
  const removeItem = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('client_id');
    localStorage.removeItem('name');
    localStorage.removeItem('idToken');
    localStorage.removeItem('role');
  };

  const handleLogout = () => {
    window.location.href = 'http://192.168.0.103:7014/SLM/Logout';
    //
    setName('');
    removeItem();
    //
  };
  return (
    <div className="border-t pt-2">
      {bottomMenu.map((item, index) => {
        return (
          <div
            key={index}
            className="flex cursor-pointer items-center rounded-sm p-1 hover:bg-gray-100"
            onClick={() =>
              item.onClick && item.onClick(navigator, handleLogout)
            }
          >
            <div className="ml-2 cursor-pointer rounded-sm p-1 text-sm text-neutral-600">
              {item.icon}
            </div>
            <p className="ml-2 text-sm text-gray-500">{item.name}</p>
          </div>
        );
      })}
    </div>
  );
}
