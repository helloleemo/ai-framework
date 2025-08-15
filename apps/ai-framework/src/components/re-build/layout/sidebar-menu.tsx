import { getMenuItemsAPI } from '@/api/menu';
import { MenuItem } from '@/api/types/menu';
import { ArrowDownIcon } from '@/components/icon/arrow-down-icon';
import { ArrowRightIcon } from '@/components/icon/arrow-right-icon';
import { FolderIcon } from '@/components/icon/folder';
import { PipeLineIcon } from '@/components/icon/pipeline-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Skeleton } from '@/components/ui/skeleton';
import Spinner from '@/components/ui/spinner';
import { useEffect, useState } from 'react';

const menuList: MenuItem[] = [
  {
    name: '數據接口',
    icon: 'default',
    children: [
      {
        name: 'Shopfloor',
        icon: 'default',
        children: [
          {
            name: 'OPC UA',
            icon: 'default',
            children: null,
            type: 'input',
          },
          {
            name: 'OPC DA',
            icon: 'default',
            children: null,
            type: 'input',
          },
          {
            name: 'Mobus TCP',
            icon: 'default',
            children: null,
            type: 'input',
          },
        ],
      },
      {
        name: 'IoT',
        icon: 'default',
        children: [
          {
            name: 'MQTT',
            icon: 'default',
            children: null,
            type: 'input',
          },
          {
            name: 'Https (request) for DAQ',
            icon: 'default',
            children: [
              {
                name: 'NIMAX API',
                icon: 'default',
                children: null,
                type: 'input',
              },
              {
                name: 'SKF',
                icon: 'default',
                children: null,
                type: 'input',
              },
              {
                name: 'ADLink',
                icon: 'default',
                children: null,
                type: 'input',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Storage',
    icon: null,
    children: [
      {
        name: 'ODBC (in)',
        icon: 'default',
        children: null,
        type: 'input',
      },
      {
        name: 'PostgreSQL (Out)',
        icon: 'default',
        children: null,
        type: 'output',
      },
      {
        name: 'MongoDB (Out)',
        icon: 'output',
        children: null,
        type: 'output',
      },
    ],
  },
  {
    name: 'Transform',
    icon: null,
    children: [
      {
        name: 'Common',
        icon: 'default',
        children: null,
        type: 'transform',
      },
      {
        name: '頻譜 function',
        icon: 'default',
        children: null,
        type: 'transform',
      },
    ],
  },
];

const existingPipeline = [
  {
    name: '既有Pipeline',
  },
];

export default function SidebarMenu({ activeMenu }: { activeMenu: number }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [toggleItems, setToggleItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

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
            console.log('Drag start:', item.name);
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify({
                name: item.name,
                type: item.type,
                // type: item.type, // 等Gavin改好type
              }),
            );
            console.log('Drag started for:', item);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('opacity-50', 'shadow-lg');
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
    setMenu(menuList); // 暫時放置假資料，等Gavin改好再改
    setLoading(false);
    /**
    getMenuItemsAPI()
      .then((res) => {
        if (res.success) {
          setMenu(res.data);
        }
        console.log('Menu items:', res);
      })
      .catch((error) => {
        console.error('Failed to fetch menu items:', error);
        setMenu(menuList);
      })

      .finally(() => {
        console.log('Menu items fetch completed');
        setLoading(false);
      });
       */
  }, []);

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
