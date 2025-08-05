import { CableIcon } from '@/components/icon/cable-icon';
import React, { useState } from 'react';
import { Selections } from '@/types/selections';
import { ArrowDownIcon } from './icon/arrow-down-icon';
import { ArrowRightIcon } from './icon/arrow-right-icon';
import { PipeLineIcon } from './icon/pipeline-icon';
import { MenuIcon } from './icon/menu-icon';
import { ArtboardIcon } from './icon/artboard-icon';
import { ReactFlow, Controls, Background } from '@xyflow/react';

export default function Sidebar({ menuToggle }: { menuToggle?: boolean }) {
  // REACT FLOW

  // Data

  const selections: Selections[] = [
    {
      name: '資料源管理',
      icon: <CableIcon className="text-slate-800" />,
      ui: 'left-[5%] w-[40%]',
      menu: {
        name: '既有Pipeline',
      },
    },
    {
      name: '畫布',
      icon: <ArtboardIcon />,
      ui: 'left-[60%] w-[35%]',
      menu: {
        name: '數據接口',
        children: [
          {
            name: 'shopfloor',
            children: ['OPC UA', 'OPC DA', 'Mobus TCP'],
          },
          {
            name: 'IoT',
            children: [
              'MQTT (in 訂閱 topic)',
              {
                name: 'Https (request) for DAQ',
                children: ['NIMAX API', 'SKF', 'ADLink'],
              },
              'MQTT (Out pub topic)',
              'Https (response) -> Data API',
            ],
          },
          {
            name: 'Storge',
            children: ['ODBC (in)', 'PostgreSQL (Out)', 'MongoDB (Out)'],
          },
          {
            name: 'Transform',
            children: ['Common', '頻譜 function'],
          },
        ],
      },
    },
  ];

  // Switch menu
  const [activeSelection, setActiveSelection] = useState<string>(
    selections[1].name
  );

  const handleSelectionChange = (selection: string) => {
    setActiveSelection(selection);
    console.log(`switch to ${selection}`);
  };

  // Toggle menu
  const initialOpenKeys = new Set<string>();
  selections.forEach((s) => {
    if (s.menu) {
      getAllExpandableKeys(s.menu).forEach((key) => initialOpenKeys.add(key));
    }
  });
  const [openedMenu, setOpenedMenu] = useState<Set<string>>(initialOpenKeys);
  const toggleOpen = (keyPath: string) => {
    setOpenedMenu((prev) => {
      const newSet = new Set(prev);
      newSet.has(keyPath) ? newSet.delete(keyPath) : newSet.add(keyPath);
      return newSet;
    });
  };

  function getAllExpandableKeys(menu: any, parentKey = ''): string[] {
    const keys: string[] = [];

    if (typeof menu === 'object' && menu !== null && 'name' in menu) {
      const keyPath = parentKey ? `${parentKey}/${menu.name}` : menu.name;

      if (Array.isArray(menu.children)) {
        keys.push(keyPath);
        for (const child of menu.children) {
          if (typeof child === 'object' && child !== null) {
            keys.push(...getAllExpandableKeys(child, keyPath));
          }
        }
      }
    }

    return keys;
  }

  function renderMenu(menu: any, parentKey = ''): React.ReactNode {
    if (typeof menu === 'object' && menu !== null && 'name' in menu) {
      const keyPath = parentKey ? `${parentKey}/${menu.name}` : menu.name;
      const isOpen = openedMenu.has(keyPath);
      const hasChildren = Array.isArray(menu.children);

      return (
        <li key={keyPath}>
          <div
            className="cursor-pointer flex justify-between items-center px-2 py-2 hover:bg-neutral-100 rounded-md"
            onClick={() => hasChildren && toggleOpen(keyPath)}
          >
            <div className="flex justify-start items-center gap-2">
              <MenuIcon />
              {menu.name}
            </div>
            {hasChildren && (isOpen ? <ArrowDownIcon /> : <ArrowRightIcon />)}
          </div>

          {hasChildren && isOpen && (
            <ul className="ml-4">
              {menu.children.map((child: any, idx: number) =>
                typeof child === 'string' ? (
                  <li
                    onClick={() => console.log(`selected ${child}`)}
                    key={idx}
                    className="pl-2 py-2 text-sm text-gray-600 flex items-center gap-2 hover:bg-neutral-100 rounded-md cursor-pointer"
                  >
                    <PipeLineIcon fill="#999" />
                    {child}
                  </li>
                ) : (
                  renderMenu(child, keyPath)
                )
              )}
            </ul>
          )}
        </li>
      );
    }

    return null;
  }

  return (
    //
    <div className="border-r bg-white overflow-y-auto scrollbar-thin">
      <div
        className={`${
          !menuToggle ? 'w-[320px]' : 'w-[0px]'
        } transition-all duration-100`}
      >
        {/* Switch menu */}
        {!menuToggle && (
          <div
            className={`w-[320px] switchMenu fixed bg-white flex gap-5 justify-center items-center pt-4 pb-3`}
          >
            {selections.map((selection, index) => {
              return (
                <div
                  className="cursor-pointer flex-1 flex justify-center items-center gap-1"
                  key={index}
                  onClick={() => handleSelectionChange(selection.name)}
                >
                  <div>{selection.icon}</div>
                  <p>{selection.name}</p>
                </div>
              );
            })}
            <div
              className={`absolute border-b-[3px] border-sky-500 top-[43px] transition-translate duration-100
          ${(() => {
            const found = selections.find((s) => s.name === activeSelection);
            return found && found.ui ? found.ui : '';
          })()}`}
            ></div>
            <div className="w-full border-b absolute top-[44px] -z-10"></div>
          </div>
        )}

        {/* Render menu */}
        {!menuToggle && (
          <ul className="flex-1 pt-13 px-2">
            {selections.map((selection, index) => {
              if (selection.name === activeSelection && selection.menu) {
                return renderMenu(selection.menu);
              }
              return null;
            })}
          </ul>
        )}
      </div>
    </div>
  );

  //
}
