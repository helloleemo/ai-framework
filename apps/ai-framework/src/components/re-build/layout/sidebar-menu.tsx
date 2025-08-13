import { getMenuItemsAPI } from '@/api/menu';
import { MenuItem } from '@/api/types/menu';
import { ArrowDownIcon } from '@/components/icon/arrow-down-icon';
import { ArrowRightIcon } from '@/components/icon/arrow-right-icon';
import { useEffect, useState } from 'react';

export default function SidebarMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [toggleItems, setToggleItems] = useState<Set<string>>(new Set());

  const toggleExpand = (itemName: string) => {
    const newToggleItems = new Set(toggleItems);
    if (newToggleItems.has(itemName)) {
      newToggleItems.delete(itemName);
    } else {
      newToggleItems.add(itemName);
    }
    setToggleItems(newToggleItems);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = toggleItems.has(item.name);
    const paddingLeft = level * 16;

    return (
      <div key={item.name}>
        <div
          className="collapse-item p-3 hover:bg-neutral-100 cursor-pointer flex items-center justify-between"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => hasChildren && toggleExpand(item.name)}
          draggable={!hasChildren}
          onDragStart={(e) => {
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify({
                name: item.name,
                icon: item.icon,
                // type: item.type, // 等Gavin改好type
              })
            );
            console.log('Drag started for:', item);
          }}
        >
          <div className="flex items-center gap-2">
            <p className="text-base text-neutral-600">{item.name}</p>
          </div>
          {hasChildren && (
            <span className="text-base text-gray-400">
              {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {item.children!.map((child: any) =>
              renderMenuItem(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    getMenuItemsAPI()
      .then((res) => {
        if (res.success) {
          setMenu(res.data || []);
        }
        console.log('Menu items:', res);
      })
      .catch((error) => console.error('Error fetching menu items:', error))
      .finally(() => console.log('Menu items fetch completed'));
  }, []);
  return (
    <div className="collapse-menu relative h-[calc(100vh-250px)] scrollbar-fade overflow-y-auto ">
      {menu.map((item) => renderMenuItem(item))}
    </div>
  );
}
