import { MenuIcon } from './icon/menu-icon';
import { ArrowDownIcon } from './icon/arrow-down-icon';
import { ArrowRightIcon } from './icon/arrow-right-icon';
import { PipeLineIcon } from './icon/pipeline-icon';

export function SidebarMenu({
  selections,
  activeSelection,
  onSelect,
}: {
  selections: any[];
  activeSelection: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="w-[318px] switchMenu fixed bg-white flex gap-5 justify-center items-center pt-4 pb-3">
      {selections.map((selection, index) => (
        <div
          className={`cursor-pointer flex-1 flex justify-center items-center gap-1`}
          key={index}
          onClick={() => onSelect(selection.name)}
        >
          <div>{selection.icon}</div>
          <p>{selection.name}</p>
        </div>
      ))}

      <div
        className={`absolute border-b-[3px] border-sky-500 top-[48px] transition-translate duration-100
          ${(() => {
            const found = selections.find((s) => s.name === activeSelection);
            return found && found.ui ? found.ui : '';
          })()}`}
      ></div>
      <div className="w-full border-b absolute top-[50px] -z-10"></div>
    </div>
  );
}

// SidebarMenuTree
export function SidebarMenuTree({
  menu,
  openedMenu,
  toggleOpen,
  onDragStart,
  parentKey = '',
}: {
  menu: any;
  openedMenu: Set<string>;
  toggleOpen: (key: string) => void;
  onDragStart: (
    event: React.DragEvent<HTMLElement>,
    nodeType: string,
    label: string
  ) => void;
  parentKey?: string;
}) {
  if (!menu) return null;

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
                  draggable
                  onDragStart={(e) => {
                    const nodeType = menu.nodeType || 'default';
                    onDragStart(e, nodeType, child);
                  }}
                  key={idx}
                  className="pl-2 py-2 text-sm text-gray-600 flex items-center gap-2 hover:bg-neutral-100 rounded-md cursor-grab active:cursor-grabbing
                   active:bg-neutral-50 active:border-blue-200 active:scale-[0.98]
                   active:shadow-md
                   transition-all duration-150 ease-out
                   select-none"
                >
                  <PipeLineIcon fill="#999" />
                  {child}
                </li>
              ) : (
                <SidebarMenuTree
                  menu={child}
                  openedMenu={openedMenu}
                  toggleOpen={toggleOpen}
                  onDragStart={onDragStart}
                  parentKey={keyPath}
                />
              )
            )}
          </ul>
        )}
      </li>
    );
  }
  return null;
}
