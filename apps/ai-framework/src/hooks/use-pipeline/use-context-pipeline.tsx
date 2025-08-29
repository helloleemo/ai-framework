import { PipelineEdgeConfig } from '@/types/pipeline';
import { generateUUID } from '@/utils/uuid';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import {
  addEdge,
  Edge,
  Node,
  OnConnect,
  useEdgesState,
  useNodesState,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
} from '@xyflow/react';
import {
  edgeType,
  InputNode,
  OutputNode,
  TransformNode,
} from '@/components/artboard/node-type';

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
  // Pipeline 狀態
  nodes: PipelineNode[];
  activeNode: PipelineNode | null;

  // React Flow 狀態
  reactFlowNodes: Node[];
  reactFlowEdges: Edge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;

  // Pipeline 操作
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

  // React Flow 操作
  setReactFlowNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  setReactFlowEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  onConnect: OnConnect;
  onNodeDoubleClick: (event: React.MouseEvent, node: Node) => void;
  onCanvasClick: () => void;
}

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [edges, setEdges] = useState<PipelineEdgeConfig[]>([]);
  const [activeNode, setActiveNodeState] = useState<PipelineNode | null>(null);

  // React Flow 狀態管理
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

  const [reactFlowNodes, setReactFlowNodes, onNodesChange] =
    useNodesState(initialNodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  // set edge
  const setEdge = useCallback((edge: PipelineEdgeConfig) => {
    setEdges((prev) => [...prev, edge]);
  }, []);

  // add node
  const addNode = useCallback((reactFlowNode: ReactFlowNode) => {
    setNodes((prevNodes) => {
      const existingNode = prevNodes.find((n) => n.id === reactFlowNode.id);
      if (existingNode) return prevNodes;

      console.log('Adding node:', reactFlowNode);
      const newNode: PipelineNode = {
        id: reactFlowNode.id,
        type: reactFlowNode.data?.type || 'default',
        label: reactFlowNode.data?.label || 'Unknown',
        position: reactFlowNode.position || { x: 0, y: 0 },
        description: reactFlowNode.data?.description || '',
        config: {},
      };
      console.log('New Pipeline Node:', newNode);

      return [...prevNodes, newNode];
    });
  }, []);

  // active node
  const setActiveNode = useCallback((node: PipelineNode | null) => {
    setActiveNodeState(node);
  }, []);

  //
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

  // 取得 node
  const getNode = useCallback(
    (nodeId: string): PipelineNode | undefined => {
      return nodes.find((n) => n.id === nodeId);
    },
    [nodes],
  );

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
      processor_method: getProcessorMethod(node.type, node.label), // 使用智能對應
      op_kwargs: {
        ...node.config,
      },
      dependencies: dependencies,
      position: node.position,
    };
  };

  // React Flow 事件處理
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

      // 轉換為 PipelineEdgeConfig 格式
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
      console.log('Node double clicked:', node);
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

  // Pipeline 格式
  const buildPipelineConfig = (): PipelineConfigResult => {
    // 轉換所有 nodes 為 DAG tasks
    const tasks = nodes.map((node) => transformNodeToDag(node));

    const pipelineConfig = {
      dag_id: `pipeline_${generateUUID()}`,
      schedule_interval: findScheduleInterval(nodes),
      start_date: new Date().toISOString().split('T')[0],
      catchup: false,
      owner: localStorage.getItem('code') || 'unknown',
      tasks: tasks,
    };
    return pipelineConfig;
  };

  //
  const findScheduleInterval = (node: any) => {
    return node.find((n: any) => n.type === 'output')?.config?.scheduleInterval;
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
        // Pipeline 狀態
        nodes,
        activeNode,

        // React Flow 狀態
        reactFlowNodes,
        reactFlowEdges,
        nodeTypes,
        edgeTypes,

        // Pipeline 操作
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

        // React Flow 操作
        setReactFlowNodes,
        onNodesChange,
        setReactFlowEdges,
        onEdgesChange,
        handleDrop,
        handleDragOver,
        onConnect,
        onNodeDoubleClick,
        onCanvasClick,
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

//
export function useArtboardNodes() {
  const {
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
    activeNode,
    setActiveNode,
  } = usePipeline();

  return {
    nodes: reactFlowNodes,
    setNodes: setReactFlowNodes,
    onNodesChange,
    edges: reactFlowEdges,
    setEdges: setReactFlowEdges,
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
