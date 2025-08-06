import { useState, useCallback } from 'react';
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CloseIcon } from '@/components/icon/close-icon';

const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function NewArtboard() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
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
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          {' '}
          <Background
            color="#ddd"
            bgColor="#fff"
            variant={BackgroundVariant.Dots}
            gap={20}
            size={3}
          />
        </ReactFlow>
      </div>
    </div>
  );
}
