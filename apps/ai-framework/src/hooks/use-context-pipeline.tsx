import { PipelineEdgeConfig } from '@/types/pipeline';
import { generateUUID } from '@/utils/uuid';
import { createContext, useContext, useState, ReactNode } from 'react';

export interface PipelineNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  description: string;
  config: Record<string, unknown>;
  completed?: boolean;
}

export interface DagTask {
  task_id: string;
  operator: string;
  processor_stage: string;
  processor_method: string;
  op_kwargs: Record<string, unknown>;
  dependencies: string[];
}

export interface PipelineConfigResult {
  dag_id: string;
  schedule_interval: string | null;
  start_date: string;
  catchup: boolean;
  owner: string;
  tasks: DagTask[];
  // pipeline_info: {
  //   total_nodes: number;
  //   total_edges: number;
  //   created_at: string;
  //   node_types: string[];
  // };
}

interface ReactFlowNode {
  id: string;
  data?: {
    type?: string;
    label?: string;
    description?: string;
  };
  position?: { x: number; y: number };
}

interface PipelineContextType {
  nodes: PipelineNode[];
  activeNode: PipelineNode | null;

  setEdge: (edge: PipelineEdgeConfig) => void;
  addNode: (reactFlowNode: ReactFlowNode) => void;
  updateNodeConfig: (nodeId: string, config: Record<string, unknown>) => void;
  setActiveNode: (node: PipelineNode | null) => void;
  getNode: (nodeId: string) => PipelineNode | undefined;
  getNodeStatus: (nodeId: string) => 'success' | 'failed' | 'pending';
  setNodeStatus: (
    nodeId: string,
    status: 'success' | 'failed' | 'pending',
  ) => void;
  setNodeCompleted: (nodeId: string, completed: boolean) => void;
  getNodeCompleted: (nodeId: string) => boolean;
  buildPipelineConfig: () => PipelineConfigResult;
  validatePipeline: () => { isValid: boolean; errors: string[] };
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdgeConfig[]>([]);
  const [activeNode, setActiveNodeState] = useState<PipelineNode | null>(null);

  // set edge
  const setEdge = (edge: PipelineEdgeConfig) => {
    setEdges((prev) => [...prev, edge]);
  };

  // 新增 node
  const addNode = (reactFlowNode: ReactFlowNode) => {
    const existingNode = nodes.find((n) => n.id === reactFlowNode.id);
    // console.log('React Flow Node:', reactFlowNode.id);
    // console.log('Existing Node:', existingNode?.id);
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
  const updateNodeConfig = (
    nodeId: string,
    config: Record<string, unknown>,
  ) => {
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
  };

  // 取得 node
  const getNode = (nodeId: string): PipelineNode | undefined => {
    return nodes.find((n) => n.id === nodeId);
  };

  // 取得node狀態
  const getNodeStatus = (nodeId: string): 'success' | 'failed' | 'pending' => {
    const node = getNode(nodeId);
    const status = node?.config?.status;
    if (status === 'success' || status === 'failed' || status === 'pending') {
      return status;
    }
    return 'pending';
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

  // node設定完成狀態(right panel的設定)
  const setNodeCompleted = (nodeId: string, completed: boolean) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, completed: completed } : node,
      ),
    );
  };

  // 取得node完成狀態
  const getNodeCompleted = (nodeId: string): boolean => {
    const node = nodes.find((n) => n.id === nodeId);
    const completed = node?.completed;
    return typeof completed === 'boolean' ? completed : false;
  };

  // 轉換 processor_method 對應表
  const getProcessorMethod = (nodeType: string, nodeLabel: string): string => {
    const processorMapping: Record<string, string> = {
      input: 'input_processor',
      transform: 'transform_processor',
      output: 'output_processor',
      opcua: 'opcua_processor',
      opcda: 'opcda_processor',
      database: 'database_processor',
      file: 'file_processor',
      api: 'api_processor',
    };

    // 優先使用 nodeType，如果沒有對應則用 nodeLabel 的小寫
    return (
      processorMapping[nodeType.toLowerCase()] ||
      processorMapping[nodeLabel.toLowerCase()] ||
      `${nodeLabel.toLowerCase()}_processor`
    );
  };

  // 建立 dependencies 關係
  const buildDependencies = (nodeId: string): string[] => {
    return edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => edge.source);
  };

  // 轉換單個 node 為 DAG task 格式
  const transformNodeToDag = (node: PipelineNode) => {
    const dependencies = buildDependencies(node.id);

    return {
      task_id: node.id, // node id
      operator: 'PythonOperator',
      processor_stage: node.type, // node type
      processor_method: node.label, // node label
      op_kwargs: {
        ...node.config,
      },
      dependencies: dependencies,
      position: node.position,
    };
  };

  // Pipeline 格式
  const buildPipelineConfig = (): PipelineConfigResult => {
    // 轉換所有 nodes 為 DAG tasks
    const tasks = nodes.map((node) => transformNodeToDag(node));

    const pipelineConfig = {
      dag_id: `pipeline_${generateUUID()}`,
      schedule_interval: '@once',
      start_date: new Date().toISOString().split('T')[0],
      catchup: false,
      owner: localStorage.getItem('code') || 'unknown',
      tasks: tasks,
    };

    console.log('Pipeline Config:', pipelineConfig);
    return pipelineConfig;
  };

  // 驗證 pipeline 完整性
  const validatePipeline = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // 檢查是否有 nodes
    if (nodes.length === 0) {
      errors.push('Pipeline 必須至少包含一個 node');
    }

    // 檢查每個 node 是否已完成設定
    const incompleteNodes = nodes.filter((node) => !getNodeCompleted(node.id));
    if (incompleteNodes.length > 0) {
      errors.push(
        `以下 nodes 尚未完成設定: ${incompleteNodes.map((n) => n.label).join(', ')}`,
      );
    }

    // 檢查是否有孤立的 nodes (沒有連接的)
    const connectedNodeIds = new Set([
      ...edges.map((e) => e.source),
      ...edges.map((e) => e.target),
    ]);
    const isolatedNodes = nodes.filter(
      (node) => !connectedNodeIds.has(node.id) && nodes.length > 1,
    );
    if (isolatedNodes.length > 0) {
      errors.push(
        `以下 nodes 沒有連接: ${isolatedNodes.map((n) => n.label).join(', ')}`,
      );
    }

    // 檢查是否有循環依賴
    const hasCycle = checkForCycles();
    if (hasCycle) {
      errors.push('Pipeline 中存在循環依賴');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  // 檢查循環依賴
  const checkForCycles = (): boolean => {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const dependencies = buildDependencies(nodeId);
      for (const dep of dependencies) {
        if (!visited.has(dep)) {
          if (dfs(dep)) return true;
        } else if (recStack.has(dep)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  };

  return (
    <PipelineContext.Provider
      value={{
        nodes,
        activeNode,
        setEdge,
        addNode,
        setActiveNode,
        updateNodeConfig,
        getNode,
        getNodeStatus,
        setNodeStatus,
        setNodeCompleted,
        getNodeCompleted,
        buildPipelineConfig,
        validatePipeline,
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
