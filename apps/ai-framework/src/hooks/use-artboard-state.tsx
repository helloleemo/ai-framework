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
import { generateUUID } from '@/utils/uuid';
import { usePipeline } from './use-context-pipeline';
import { describe } from 'node:test';

export function useArtboardNodes() {
  const {
    addNode,
    getNode,
    setActiveNode: setActiveNode2,
    setEdge: setEdges2,
  } = usePipeline();

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
          const id = generateUUID();
          const newNode: Node = {
            id,
            position: { x, y },
            type: data.type,
            data: {
              id,
              name: data.name,
              label: data.label,
              position: { x, y },
              type: data.type,
              description: data.description,
            },
          };
          // console.log('Dropped node:', newNode);
          setNodes((nodes: Node[]) => [...nodes, newNode]);
          addNode(newNode);
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
    (params: any) => {
      params.type = 'custom';
      setEdges((eds: any) => addEdge(params, eds));
      setEdges2(params);
    },
    [setEdges, setEdges2],
  );

  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    console.log('Node double clicked:', node);
    // addNode(node);
    setActiveNode2(node);
    console.log('Active node set to:', node);
    event.stopPropagation();
  }, []);

  const onCanvasClick = () => {
    setActiveNode(null);
    setActiveNode2(null);
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
