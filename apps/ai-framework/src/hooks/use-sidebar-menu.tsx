import { useState } from 'react';
import { useMenu } from '@/hooks/menu-toggle';
import { useDnD } from '@/hooks/use-dnd-flow';
import { Selections } from '@/types/selections';

export function useSidebarMenu(selections: Selections[]) {
  // DnD
  const { setType } = useDnD();

  // Switch menu
  const { menuToggle } = useMenu();
  const [activeSelection, setActiveSelection] = useState<string>(
    selections[1]?.name || selections[0]?.name || ''
  );
  const handleSelectionChange = (selection: string) => {
    setActiveSelection(selection);
    // 可加 log 或其他 side effect
  };

  // 展開/收合 menu
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

  // 拖曳事件
  const onDragStart = (
    event: React.DragEvent<HTMLElement>,
    nodeType: string,
    label: string
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('nodeType', nodeType);
    event.dataTransfer.setData('nodeLabel', label);
  };

  return {
    menuToggle,
    activeSelection,
    handleSelectionChange,
    openedMenu,
    toggleOpen,
    onDragStart,
  };
}
export default useSidebarMenu;
