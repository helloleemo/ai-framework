import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CloseIcon } from '@/components/icon/close-icon';

export default function NewArtboard() {
  const initialNodes = [
    {
      id: 'n1',
      data: { label: 'Node 1' },
      position: { x: 0, y: 0 },
      type: 'input',
    },
    {
      id: 'n2',
      data: { label: 'Node 2' },
      position: { x: 100, y: 100 },
    },
  ];

  const initialEdges: any[] = [];
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="h-full w-full">
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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className=""
        >
          <Background bgColor="#fff" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
