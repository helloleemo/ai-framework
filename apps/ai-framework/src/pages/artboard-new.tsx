import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CloseIcon } from '@/components/icon/close-icon';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function NewArtboard() {
  const defaultNodes = [
    {
      id: '1',
      type: 'input',
      data: { label: 'Input Node' },
      position: { x: 250, y: 25 },
    },

    {
      id: '2',
      data: {
        label: (
          <div>
            <p>Default Node</p>
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
          </div>
        ),
      },
      position: { x: 100, y: 125 },
    },
    {
      id: '3',
      type: 'output',
      data: { label: 'Output Node' },
      position: { x: 250, y: 250 },
    },
  ];
  const defaultEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full h-[calc(100%-40px)]">
        <div className="h-[40px - 1px] ">
          <div className="bg-white  rounded-t-md py-2 pl-5 pr-4 w-fit">
            <div className="activeFile flex items-center gap-x-2">
              <div className="unSaved bg-sky-500 rounded-full w-2.5 h-2.5"></div>
              <div className="text">
                <p className="text-sm text-neutral-600">2025-08-06 - Draft</p>
              </div>
              <div className="icon hover:bg-neutral-100 rounded-full p-1 cursor-pointer">
                <CloseIcon className="fill-neutral-800" size="1.3em" />
              </div>
            </div>
            <div className="others"></div>
          </div>
        </div>
        <ReactFlow
          nodes={initialNodes}
          edges={initialEdges}
          defaultNodes={defaultNodes}
          defaultEdges={defaultEdges}
          fitView
        >
          <Controls />{' '}
          <Background
            color="#ddd"
            bgColor="#fff"
            variant={BackgroundVariant.Dots}
            gap={20}
            size={2}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
