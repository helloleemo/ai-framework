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

export function useArtboardNodes() {
  const { addNode, getNode } = usePipeline();

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
            id: generateUUID(),
            type: data.type,
            position: { x, y },
            data: { label: data.name },
          };
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
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeDoubleClick = useCallback((event: any, node: any) => {
    console.log('Node double clicked:', node);
    const pipelineNode = getNode(node.id);
    if (!pipelineNode) {
      console.log('Pipeline node not found, creating one...');
      addNode(node);
      setActiveNode(node);
      console.log('Active node set to:', node);
    }
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
