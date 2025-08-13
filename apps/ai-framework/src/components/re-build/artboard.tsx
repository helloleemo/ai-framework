import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RightPanel from './artboard/right-panel';
import TopTab from './artboard/top-tab';
import { useCallback } from 'react';

export default function Artboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        // position
        if (data.type === 'menu-item') {
          // 暫時放

          // position
          const position = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - position.left;
          const y = e.clientY - position.top;

          // new node
          const newNode: Node = {
            id: `${data.name}-${Date.now()}`,
            type: 'default', // 暫時放
            position: { x, y },
            data: { label: data.name, icon: data.icon },
          };
          setNodes((nds) => [...nds, newNode]);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [setNodes]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <>
      {/* content */}
      <div className="w-full h-full">
        <TopTab />
        <div
          className="border border-yellow-500 h-[calc(100vh-62px)] w-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactFlow
            className="h-full w-full"
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background bgColor="#fff" />
          </ReactFlow>
        </div>
        <div className="absolute top-5 left-5 z-10"></div>
      </div>
      <RightPanel />
    </>
  );
}
