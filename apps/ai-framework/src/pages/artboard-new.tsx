import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Node,
  type Edge,
  type OnConnect,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CloseIcon } from '@/components/icon/close-icon';
import { useDnD } from '../hooks/use-dnd-flow';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function NewArtboard() {
  // const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { type: nodeType } = useDnD();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      console.log('Drop triggered, nodeType:', nodeType);

      event.dataTransfer.dropEffect = 'move';

      if (!nodeType) {
        console.log('No nodeType available');
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: 'default', // 暫時固定
        position,
        data: { label: `${nodeType} 節點` },
        style: {
          backgroundColor: '#ffffff',
          border: '2px solid #1976d2',
          borderRadius: '8px',
          padding: '10px',
        },
      };
      console.log('Creating node:', newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    [nodeType, screenToFlowPosition, setNodes]
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          fitView
        >
          <Controls />
          <Background bgColor="#fff" />
        </ReactFlow>
      </div>
    </div>
  );
}

export default function TestFlow() {
  return (
    <ReactFlowProvider>
      <NewArtboard />
    </ReactFlowProvider>
  );
}
