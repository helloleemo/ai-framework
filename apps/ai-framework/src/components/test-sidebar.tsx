import React from 'react';
// Update the import path to the correct relative path or ensure the module exists
import { useDnD } from './test-dnd-contest';

export default function TestSidebar() {
  const { setType } = useDnD(); // 使用解構賦值

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 border-r bg-white">
      <h3 className="text-lg font-semibold mb-4">工具箱</h3>
      <div className="space-y-2">
        {/* 可拖拽的節點 */}
        <div
          className="p-3 bg-blue-100 border border-blue-300 rounded cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(e) => onDragStart(e, 'input')}
        >
          輸入節點
        </div>

        <div
          className="p-3 bg-green-100 border border-green-300 rounded cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(e) => onDragStart(e, 'default')}
        >
          處理節點
        </div>

        <div
          className="p-3 bg-red-100 border border-red-300 rounded cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={(e) => onDragStart(e, 'output')}
        >
          輸出節點
        </div>
      </div>
    </div>
  );
}
