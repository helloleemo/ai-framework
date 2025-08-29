import { useEffect, useState } from 'react';
import { CollapseIcon } from '@/shared/ui/icon/collapse-icon';
import { PipeIcon } from '@/shared/ui/icon/pipe-icon';
import { ArtboardIcon } from '@/shared/ui/icon/artboard-icon';
import { useLocation, useNavigate } from 'react-router-dom';

const switchMenu = [
  {
    name: '既有Pipeline',
    icon: <PipeIcon className="h-5 w-5 text-sky-500" />,
    path: '/re-build/ai-framework/view-all',
  },
  {
    name: '畫布',
    icon: <ArtboardIcon className="h-5 w-5 text-sky-500" />,
    path: '/re-build/ai-framework/artboard',
  },
];
export default function SwitchMenu({
  onSwitch,
}: {
  onSwitch: (index: number) => void;
}) {
  // switch menu
  const location = useLocation();
  const navigate = useNavigate();
  const [switchMenuActive, setSwitchMenuActive] = useState(0);

  useEffect(() => {
    const foundIndex = switchMenu.findIndex(
      (item) => location.pathname === item.path,
    );
    if (foundIndex !== -1) {
      setSwitchMenuActive(foundIndex);
      onSwitch(foundIndex);
    }
  }, [location.pathname, onSwitch]);
  const handleSwitchMenu = (index: number) => {
    setSwitchMenuActive(index);
    onSwitch(index); // send to outer
    navigate(switchMenu[index].path);
  };
  return (
    <>
      <div className="switch-menu flex items-center justify-evenly gap-2 p-1">
        {switchMenu.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => handleSwitchMenu(index)}
              className={`flex w-1/2 cursor-pointer items-center justify-center gap-2 border-b-[3px] pb-1 transition-all duration-200 ${
                switchMenuActive === index
                  ? 'border-b-sky-500'
                  : 'border-transparent'
              }`}
            >
              <div className="icon">{item.icon}</div>
              <p className="text-center text-sm">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="relative -top-[6px] -z-10 border-b"></div>
    </>
  );
}
