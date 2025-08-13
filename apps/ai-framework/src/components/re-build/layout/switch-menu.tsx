import { useState } from 'react';
import { CollapseIcon } from '../../icon/collapse-icon';

const switchMenu = [
  {
    name: '既有Pipeline',
    icon: <CollapseIcon className="w-4 h-4" />,
  },
  {
    name: '畫布',
    icon: <CollapseIcon className="w-4 h-4" />,
  },
];
export default function SwitchMenu() {
  // switch menu
  const [switchMenuActive, setSwitchMenuActive] = useState(0);
  const handleSwitchMenu = (index: number) => {
    setSwitchMenuActive(index);
  };
  return (
    <>
      <div className="switch-menu p-1 flex justify-evenly items-center gap-2">
        {switchMenu.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() => handleSwitchMenu(index)}
              className={`w-1/2 cursor-pointer border-b-[3px] flex justify-center items-center pb-2 transition-all duration-200 gap-2 ${
                switchMenuActive === index
                  ? 'border-b-sky-500'
                  : 'border-transparent'
              }`}
            >
              <div className="icon">{item.icon}</div>
              <p className="text-center">{item.name}</p>
            </div>
          );
        })}
      </div>
      <div className="border-b relative -top-[6px] -z-10"></div>
    </>
  );
}
