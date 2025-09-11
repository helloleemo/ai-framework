import { MenuList } from '@/features/menu';
import { getMenuItemsAPI } from '@/shared/api/menu';
import { MenuItem } from '@/shared/api/types/menu';
import { ArrowDownIcon } from '@/shared/ui/icon/arrow-down-icon';
import { ArrowRightIcon } from '@/shared/ui/icon/arrow-right-icon';
import { FolderIcon } from '@/shared/ui/icon/folder';
import { PipeLineIcon } from '@/shared/ui/icon/pipeline-icon';
import { Skeleton } from '@/shared/ui/skeleton';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FolderItem {
  name: string;
  id: string;
  defaultPath: string;
  hasRoute: boolean; // 新增屬性
  children: {
    name: string;
    path: string;
    hasRoute: boolean; // 新增屬性
  }[];
}

interface OtherMenuItem {
  name: string;
  path: string;
  hasRoute: boolean; // 新增屬性
  icon?: string;
}

export default function SidebarMenu({ activeMenu }: { activeMenu: number }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [toggleItems, setToggleItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  const navigate = useNavigate();
  const location = useLocation();

  const menuList = MenuList.menuList;
  const folders: FolderItem[] = MenuList.folders || [];

  //
  const getCurrentFolder = () => {
    return folders.find((folder) =>
      folder.children.some(
        (child) => child.hasRoute && location.pathname === child.path,
      ),
    );
  };

  //
  const isInFolder = (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    return (
      folder?.children.some(
        (child) => child.hasRoute && location.pathname === child.path,
      ) || false
    );
  };

  //
  useEffect(() => {
    const currentFolder = getCurrentFolder();
    if (currentFolder) {
      setExpandedFolders((prev) => new Set([...prev, currentFolder.id]));
    }
  }, [location.pathname]);

  const toggleExpand = (itemName: string) => {
    const newToggleItems = new Set(toggleItems);
    if (newToggleItems.has(itemName)) {
      newToggleItems.delete(itemName);
    } else {
      newToggleItems.add(itemName);
    }
    setToggleItems(newToggleItems);
  };

  const handleFolderClick = (folder: FolderItem) => {
    //
    const newExpandedFolders = new Set(expandedFolders);
    if (newExpandedFolders.has(folder.id)) {
      newExpandedFolders.delete(folder.id);
    } else {
      newExpandedFolders.add(folder.id);
    }
    setExpandedFolders(newExpandedFolders);

    //
    if (folder.hasRoute && folder.defaultPath) {
      navigate(folder.defaultPath);
    }
  };

  const handleFolderItemClick = (item: OtherMenuItem) => {
    //
    if (item.hasRoute) {
      navigate(item.path);
    }
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

  const renderFolderItem = (item: OtherMenuItem) => {
    const isActive = item.hasRoute && location.pathname === item.path;
    const isDisabled = !item.hasRoute;

    return (
      <div
        key={item.name}
        className={`flex items-center gap-2 rounded-sm p-2 pl-8 ${
          isDisabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-neutral-100'
        }`}
        onClick={() => !isDisabled && handleFolderItemClick(item)}
        // title={isDisabled ? '此功能尚未開放' : ''}
      >
        <PipeLineIcon
          className={`h-3 w-3 ${
            isActive
              ? 'text-sky-500'
              : isDisabled
                ? 'text-gray-300'
                : 'text-neutral-500'
          }`}
        />
        <p
          className={`text-sm ${
            isActive
              ? 'font-medium text-sky-500'
              : isDisabled
                ? 'text-gray-400'
                : 'text-neutral-600'
          }`}
        >
          {item.name}
          {/* {isDisabled && (
            <span className="ml-1 text-xs text-gray-400">(開發中)</span>
          )} */}
        </p>
      </div>
    );
  };

  const renderFolder = (folder: FolderItem) => {
    const isExpanded = expandedFolders.has(folder.id);
    const isInThisFolder = isInFolder(folder.id);
    const isDisabled = !folder.hasRoute;

    return (
      <div key={folder.id} className="mb-2">
        <div
          className={`flex items-center justify-between rounded-sm p-2 ${
            isDisabled
              ? 'cursor-default'
              : 'cursor-pointer hover:bg-neutral-100'
          } ${isInThisFolder ? 'text-sky-500' : ''}`}
          onClick={() => handleFolderClick(folder)}
          title={isDisabled && !isExpanded ? '' : ''}
        >
          <div className="flex items-center gap-2">
            <FolderIcon
              className={`h-3 w-3 ${
                isInThisFolder ? 'text-sky-500' : 'text-neutral-500'
              }`}
            />
            <p className={`text-sm text-neutral-700`}>{folder.name}</p>
          </div>
          <span className="text-sm text-gray-400">
            {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-1">
            {folder.children.map((item) => renderFolderItem(item))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setMenu(menuList);
    setLoading(false);
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
          {folders.map((folder) => renderFolder(folder))}
        </div>
      )}
    </div>
  );
}
