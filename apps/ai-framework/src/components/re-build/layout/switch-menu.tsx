import { useState } from 'react';
import { CollapseIcon } from '../../icon/collapse-icon';
import { PipeIcon } from '@/components/icon/pipe-icon';
import { ArtboardIcon } from '@/components/icon/artboard-icon';

const switchMenu = [
  {
    name: '既有Pipeline',
    icon: <PipeIcon className="h-5 w-5 text-sky-500" />,
  },
  {
    name: '畫布',
    icon: <ArtboardIcon className="h-5 w-5 text-sky-500" />,
  },
];
export default function SwitchMenu({
  onSwitch,
}: {
  onSwitch: (index: number) => void;
}) {
  // switch menu
  const [switchMenuActive, setSwitchMenuActive] = useState(0);
  const handleSwitchMenu = (index: number) => {
    setSwitchMenuActive(index);
    onSwitch(index); // send to outer
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
