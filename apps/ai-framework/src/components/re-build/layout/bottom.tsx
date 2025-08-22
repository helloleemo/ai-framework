import { logoutAPI } from '@/api/auth';
import { CogIcon } from '@/components/icon/cog-icon';
import { LogoutIcon } from '@/components/icon/logout-icon';
import { UserIcon } from '@/components/icon/user-icon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BottomMenu() {
  const navigator = useNavigate();
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || '',
  );

  const bottomMenu = [
    {
      name: userName,
      icon: <UserIcon />,
      linkTo: '/user',
      onClick: (navigate: any) => navigate('/user'),
    },
    {
      name: 'Settings',
      icon: <CogIcon />,
      linkTo: '/settings',
      onClick: (navigate: any) => navigate('/settings'),
    },
    {
      name: 'Logout',
      icon: <LogoutIcon />,
      linkTo: '/logout',
      onClick: (navigate: any, handleLogout: any) => handleLogout(),
    },
  ];

  const [login, setLogin] = useState(false);

  const handleLogout = () => {
    logoutAPI()
      .then(() => {
        setLogin(false);
        setUserName('');
        localStorage.removeItem('code');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigator('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      })
      .finally(() => console.log('Logout process completed'));
  };
  return (
    <div className="border-t pt-2">
      {bottomMenu.map((item, index) => {
        return (
          <div
            key={index}
            className="flex cursor-pointer items-center rounded-sm p-1 hover:bg-gray-100"
            onClick={() => item.onClick(navigator, handleLogout)}
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
