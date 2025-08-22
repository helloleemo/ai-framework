import { useCallback, useState } from 'react';
import {
  addEdge,
  Edge,
  Node,
  OnConnect,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import {
  edgeType,
  InputNode,
  OutputNode,
  TransformNode,
} from '@/components/re-build/artboard/node-type';

export function useArtboardNodes() {
  const initialNodes: Node[] = [];
  const initialEdges: Edge[] = [];

  const nodeTypes = {
    input: InputNode,
    transform: TransformNode,
    output: OutputNode,
  };
  const edgeTypes = {
    custom: edgeType,
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [activeNode, setActiveNode] = useState<any>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        if (
          data.type === 'input' ||
          data.type === 'output' ||
          data.type === 'transform'
        ) {
          const position = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - position.left;
          const y = e.clientY - position.top;
          const newNode: Node = {
            id: `${data.name}-${Date.now()}`,
            type: data.type,
            position: { x, y },
            data: { label: data.name, icon: data.icon },
          };
          setNodes((nodes: Node[]) => [...nodes, newNode]);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [setNodes],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect: OnConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    setActiveNode(node);
    event.stopPropagation();
  }, []);

  const onCanvasClick = () => {
    setActiveNode(null);
  };

  return {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    nodeTypes,
    edgeTypes,
    activeNode,
    setActiveNode,
    handleDrop,
    handleDragOver,
    onConnect,
    onNodeDoubleClick,
    onCanvasClick,
  };
}
