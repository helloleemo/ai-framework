import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PipelineNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  description: string;
  config: any;
}

interface PipelineContextType {
  nodes: PipelineNode[];
  activeNode: PipelineNode | null;

  addNode: (reactFlowNode: any) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  setActiveNode: (node: PipelineNode | null) => void;
  getNode: (nodeId: string) => PipelineNode | undefined;
  getNodeStatus: (nodeId: string) => 'success' | 'failed' | 'pending';
  setNodeStatus: (
    nodeId: string,
    status: 'success' | 'failed' | 'pending',
  ) => void;
  setNodeCompleted: (nodeId: string, completed: boolean) => void;
  getNodeCompleted: (nodeId: string) => boolean;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [activeNode, setActiveNodeState] = useState<PipelineNode | null>(null);

  // 新增 node
  const addNode = (reactFlowNode: any) => {
    const existingNode = nodes.find((n) => n.id === reactFlowNode.id);
    if (existingNode) return;
    console.log('Adding node:', reactFlowNode);
    const newNode: PipelineNode = {
      id: reactFlowNode.id,
      type: reactFlowNode.data?.type || 'default',
      label: reactFlowNode.data?.label || 'Unknown',
      position: reactFlowNode.position || { x: 0, y: 0 },
      description: reactFlowNode.data?.description || '',
      config: {},
    };

    setNodes((prev) => [...prev, newNode]);
  };

  // active node
  const setActiveNode = (node: PipelineNode | null) => {
    setActiveNodeState(node);
  };

  // 更新 node 設定
  const updateNodeConfig = (nodeId: string, config: any) => {
    const newConfig = config.config ? { ...config.config } : { ...config };
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, config: { ...node.config, ...newConfig } }
          : node,
      ),
    );

    // active node
    // if (activeNode?.id === nodeId) {
    //   setActiveNodeState((prev) =>
    //     prev ? { ...prev, config: { ...prev.config, ...config } } : null,
    //   );
    // }
  };

  // 取得 node
  const getNode = (nodeId: string): PipelineNode | undefined => {
    return nodes.find((n) => n.id === nodeId);
  };

  // 取得 node 狀態
  const getNodeStatus = (nodeId: string): 'success' | 'failed' | 'pending' => {
    const node = getNode(nodeId);
    return node?.config?.status ?? 'pending';
  };

  // 設定node狀態
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

  // 設定node完成狀態
  const setNodeCompleted = (nodeId: string, completed: boolean) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId
          ? { ...node, config: { ...node.config, completed: completed } }
          : node,
      ),
    );
  };

  // 取得node完成狀態
  const getNodeCompleted = (nodeId: string): boolean => {
    return nodes.find((n) => n.id === nodeId)?.config?.completed ?? false;
  };

  return (
    <PipelineContext.Provider
      value={{
        nodes,
        activeNode,
        addNode,
        setActiveNode,
        updateNodeConfig,
        getNode,
        getNodeStatus,
        setNodeStatus,
        setNodeCompleted,
        getNodeCompleted,
      }}
    >
      {children}
    </PipelineContext.Provider>
  );
}

export function usePipeline() {
  const context = useContext(PipelineContext);
  if (!context) {
    throw new Error('usePipeline must be used within a PipelineProvider');
  }
  return context;
}
