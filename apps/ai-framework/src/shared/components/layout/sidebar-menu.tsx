import { MenuList } from '@/features/menu';
import { getMenuItemsAPI } from '@/shared/api/menu';
import { MenuItem } from '@/shared/api/types/menu';
import { ArrowDownIcon } from '@/shared/ui/icon/arrow-down-icon';
import { ArrowRightIcon } from '@/shared/ui/icon/arrow-right-icon';
import { FolderIcon } from '@/shared/ui/icon/folder';
import { PipeLineIcon } from '@/shared/ui/icon/pipeline-icon';
// import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Skeleton } from '@/shared/ui/skeleton';
// import Spinner from '@/components/ui/spinner';
import { useEffect, useState } from 'react';

export default function SidebarMenu({ activeMenu }: { activeMenu: number }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [toggleItems, setToggleItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const menuList = MenuList.menuList;
  const existingPipeline = MenuList.existingPipeline;

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
          className="collapse-item flex cursor-pointer items-center justify-between rounded-sm p-2 hover:bg-neutral-100"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => hasChildren && toggleExpand(item.name)}
          draggable={!hasChildren}
          onDragStart={(e) => {
            e.currentTarget.classList.add('opacity-50', 'shadow-lg');
            e.currentTarget.style.cursor = 'grabbing';
            console.log('Drag start:', item);
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify({
                name: item.name,
                type: item.type,
                label: item.label,
                intro: item.intro,
                description: item.description,
              }),
            );
            console.log('Drag started for:', item);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('opacity-50', 'shadow-lg');
            e.currentTarget.style.cursor = 'grab';
          }}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <FolderIcon className="h-3 w-3 text-sky-500" />
            ) : (
              <PipeLineIcon className="h-3 w-3 text-neutral-500" />
            )}
            <p className="text-sm text-neutral-600">{item.name}</p>
          </div>
          {hasChildren && (
            <span className="text-sm text-gray-400">
              {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && item.children && (
          <div>
            {item.children.map((child: any) =>
              renderMenuItem(child, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setMenu(menuList);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const res = await getMenuItemsAPI();
      if (res.success) {
        setMenu(res.data);
      } else {
        console.error('Failed to fetch menu items:', res.message);
      }
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-250px)] flex-col overflow-y-auto">
      {loading &&
        [0, 1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <div className="mb-5 flex flex-col" key={item + index}>
              <Skeleton className="h-[35px] w-full rounded-sm" />
            </div>
          );
        })}
      {!loading && activeMenu === 1 && (
        <div className="collapse-menu scrollbar-fade relative overflow-y-auto">
          {menu.map((item) => renderMenuItem(item))}
        </div>
      )}
      {!loading && activeMenu === 0 && (
        <div className="scrollbar-fade relative overflow-y-auto">
          {existingPipeline.map((item) => {
            return (
              <ul className="flex items-center gap-2" key={item.name}>
                <li className="w-full cursor-pointer rounded-sm p-2 text-sm text-neutral-600 hover:bg-neutral-100">
                  {item.name}
                </li>
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
}
