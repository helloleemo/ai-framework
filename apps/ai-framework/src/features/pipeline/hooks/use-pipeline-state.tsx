import { useState, useCallback } from 'react';
import { PipelineNode, ReactFlowNode } from '../types/pipeline-context';
import { PipelineEdgeConfig } from '../types/pipeline';

export function usePipelineState() {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdgeConfig[]>([]);
  const [activeNode, setActiveNodeState] = useState<PipelineNode | null>(null);

  const setEdge = useCallback((edge: PipelineEdgeConfig) => {
    setEdges((prev) => [...prev, edge]);
  }, []);

  const addNode = useCallback((reactFlowNode: ReactFlowNode) => {
    setNodes((prevNodes) => {
      const existingNode = prevNodes.find((n) => n.id === reactFlowNode.id);
      if (existingNode) return prevNodes;

      const newNode: PipelineNode = {
        id: reactFlowNode.id,
        type: reactFlowNode.data?.type || 'default',
        label: reactFlowNode.data?.label || 'Unknown',
        position: reactFlowNode.position || { x: 0, y: 0 },
        description: reactFlowNode.data?.description || '',
        name: reactFlowNode.data?.name || 'unknown',
        config: {},
      };
      console.log('New Pipeline Node:', newNode);

      return [...prevNodes, newNode];
    });
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId,
      ),
    );
    setActiveNodeState((prevActiveNode) =>
      prevActiveNode?.id === nodeId ? null : prevActiveNode,
    );
  }, []);

  const setActiveNode = useCallback((node: PipelineNode | null) => {
    setActiveNodeState(node);
  }, []);

  const updateNodeConfig = useCallback(
    (nodeId: string, config: Record<string, unknown>) => {
      const newConfig =
        'config' in config
          ? { ...(config.config as Record<string, unknown>) }
          : { ...config };
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, config: { ...node.config, ...newConfig } }
            : node,
        ),
      );
    },
    [],
  );

  const getNode = useCallback(
    (nodeId: string): PipelineNode | undefined => {
      return nodes.find((n) => n.id === nodeId);
    },
    [nodes],
  );

  const getNodeStatus = (nodeId: string): 'success' | 'failed' | 'pending' => {
    const node = getNode(nodeId);
    const status = node?.config?.status;
    if (status === 'success' || status === 'failed' || status === 'pending') {
      return status;
    }
    return 'pending';
  };

  const setNodeStatus = (
    nodeId: string,
    status: 'success' | 'failed' | 'pending',
  ) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, config: { ...node.config, status: status } }
          : node,
      ),
    );
  };

  const setNodeCompleted = (nodeId: string, completed: boolean) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, completed: completed } : node,
      ),
    );
  };

  const getNodeCompleted = (nodeId: string): boolean => {
    const node = nodes.find((n) => n.id === nodeId);
    const completed = node?.completed;
    return typeof completed === 'boolean' ? completed : false;
  };

  return {
    nodes,
    edges,
    activeNode,
    setNodes,
    setEdges,
    setEdge,
    addNode,
    deleteNode,
    setActiveNode,
    updateNodeConfig,
    getNode,
    getNodeStatus,
    setNodeStatus,
    setNodeCompleted,
    getNodeCompleted,
  };
}
