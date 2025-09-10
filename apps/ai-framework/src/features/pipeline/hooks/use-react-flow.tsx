import { useState, useCallback } from 'react';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  OnConnect,
  NodeChange,
} from '@xyflow/react';
import { generateUUID } from '@/shared/utils/uuid';
import { PipelineEdgeConfig } from '../types/pipeline';
import {
  edgeType,
  InputNode,
  OutputNode,
  TransformNode,
} from '../components/artboard/node-type';

export function useReactFlow(
  addNode: (node: any) => void,
  setEdge: (edge: PipelineEdgeConfig) => void,
  deleteNode: (nodeId: string, skipConfirm?: boolean) => void,
  getNode: (nodeId: string) => any,
  setActiveNode: (node: any) => void,
  updatePipelineNodePosition: (
    nodeId: string,
    position: { x: number; y: number },
  ) => void,
) {
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

  const [reactFlowNodes, setReactFlowNodes, onNodesChangeOriginal] =
    useNodesState(initialNodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChangeOriginal(changes);
      const positionChanges = changes.filter(
        (
          change,
        ): change is NodeChange & {
          type: 'position';
          position: { x: number; y: number };
        } =>
          change.type === 'position' &&
          'position' in change &&
          change.position !== undefined,
      );

      if (positionChanges.length > 0) {
        positionChanges.forEach((change) => {
          updatePipelineNodePosition(change.id, change.position);
        });
      }
    },
    [onNodesChangeOriginal, updatePipelineNodePosition],
  );

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
              intro: data.intro,
            },
          };
          setReactFlowNodes((nodes: Node[]) => [...nodes, newNode]);
          addNode(newNode);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [setReactFlowNodes, addNode],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect: OnConnect = useCallback(
    (params) => {
      const customParams = { ...params, type: 'custom' };
      setReactFlowEdges((eds) => addEdge(customParams, eds));

      const pipelineEdge: PipelineEdgeConfig = {
        id: `${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
      };
      setEdge(pipelineEdge);
    },
    [setEdge, setReactFlowEdges],
  );

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const pipelineNode = getNode(node.id);
      setActiveNode(pipelineNode || null);
      console.log('Active node set to:', node);
      event.stopPropagation();
    },
    [getNode, setActiveNode],
  );

  const onCanvasClick = useCallback(() => {
    setActiveNode(null);
  }, [setActiveNode]);

  const handleDeleteNode = useCallback(
    (nodeId: string, skipConfirm = false) => {
      if (!skipConfirm) {
        const confirmDelete = window.confirm(
          '確定要刪除這個節點嗎？這將同時刪除所有相關的連接線。',
        );
        if (!confirmDelete) {
          return;
        }
      }

      setReactFlowNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeId),
      );

      setReactFlowEdges((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      deleteNode(nodeId, true);
    },
    [setReactFlowNodes, setReactFlowEdges, deleteNode],
  );

  return {
    reactFlowNodes,
    reactFlowEdges,
    nodeTypes,
    edgeTypes,
    setReactFlowNodes,
    onNodesChange,
    setReactFlowEdges,
    onEdgesChange,
    handleDrop,
    handleDragOver,
    onConnect,
    onNodeDoubleClick,
    onCanvasClick,
    deleteNode: handleDeleteNode,
  };
}
