import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PipelineNode {
  id: string;
  type: string;
  label: string;
  config: any;
}

interface PipelineContextType {
  nodes: PipelineNode[];
  activeNode: PipelineNode | null;

  addNode: (reactFlowNode: any) => void;
  updateNodeConfig: (nodeId: string, config: any) => void;
  // setActiveNodeInPipeline: (node: PipelineNode | null) => void;
  getNode: (nodeId: string) => PipelineNode | undefined;
  getNodeStatus: (nodeId: string) => 'connected' | 'disconnected' | 'pending';
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [activeNode, setActiveNodeState] = useState<PipelineNode | null>(null);

  // 新增 node
  const addNode = (reactFlowNode: any) => {
    const existingNode = nodes.find((n) => n.id === reactFlowNode.id);
    if (existingNode) return;

    const newNode: PipelineNode = {
      id: reactFlowNode.id,
      type: reactFlowNode.type || 'default',
      label: reactFlowNode.data?.label || 'Unknown',
      config: {},
    };

    setNodes((prev) => [...prev, newNode]);
    console.log('Node added:', newNode);
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
    if (activeNode?.id === nodeId) {
      setActiveNodeState((prev) =>
        prev ? { ...prev, config: { ...prev.config, ...newConfig } } : null,
      );
    }
  };

  // 取得 node
  const getNode = (nodeId: string): PipelineNode | undefined => {
    return nodes.find((n) => n.id === nodeId);
  };

  // 取得 node 狀態
  const getNodeStatus = (
    nodeId: string,
  ): 'connected' | 'disconnected' | 'pending' => {
    const node = getNode(nodeId);
    if (!node || !node.config) return 'disconnected';

    if (node.config.connectStatus === true) return 'connected';
    if (node.config.connectionString && !node.config.connectStatus)
      return 'pending';
    return 'disconnected';
  };

  return (
    <PipelineContext.Provider
      value={{
        nodes,
        activeNode,
        addNode,
        updateNodeConfig,
        getNode,
        getNodeStatus,
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
