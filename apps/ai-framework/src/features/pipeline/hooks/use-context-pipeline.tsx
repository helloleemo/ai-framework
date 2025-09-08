import { PipelineEdgeConfig } from '@/features/pipeline/types/pipeline';
import { generateUUID } from '@/shared/utils/uuid';
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
  NodeChange,
} from '@xyflow/react';
import {
  edgeType,
  InputNode,
  OutputNode,
  TransformNode,
} from '@/features/pipeline/components/artboard/node-type';
import { MenuList } from '@/features/menu';

export interface PipelineNode {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  description: string;
  config: Record<string, unknown>;
  completed?: boolean;
  name?: string;
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
    name?: string;
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
  deleteNode: (nodeId: string, skipConfirm?: boolean) => void;
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

  // load pipeline data
  loadPipelineData: (data: {
    nodes: PipelineNode[];
    edges: PipelineEdgeConfig[];
  }) => void;
  loadFromDAG: (dagData: any) => void;
  loadFromAPIResponse: (apiResponse: any) => void;
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

  const [reactFlowNodes, setReactFlowNodes, onNodesChangeOriginal] =
    useNodesState(initialNodes);
  const [reactFlowEdges, setReactFlowEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  //
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
        setNodes((prevNodes) =>
          prevNodes.map((node) => {
            const positionChange = positionChanges.find(
              (change) => change.id === node.id,
            );
            if (positionChange) {
              return {
                ...node,
                position: positionChange.position,
              };
            }
            return node;
          }),
        );
      }
    },
    [onNodesChangeOriginal],
  );

  // set edge
  const setEdge = useCallback((edge: PipelineEdgeConfig) => {
    setEdges((prev) => [...prev, edge]);
  }, []);

  // add node
  const addNode = useCallback((reactFlowNode: ReactFlowNode) => {
    setNodes((prevNodes) => {
      const existingNode = prevNodes.find((n) => n.id === reactFlowNode.id);
      if (existingNode) return prevNodes;

      // console.log('Adding node:', reactFlowNode);
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

  // delete node
  const deleteNode = useCallback(
    (nodeId: string, skipConfirm = false) => {
      if (!skipConfirm) {
        const confirmDelete = window.confirm(
          '確定要刪除這個節點嗎？這將同時刪除所有相關的連接線。',
        );
        if (!confirmDelete) {
          return;
        }
      }

      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));

      setEdges((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      setReactFlowNodes((prevNodes) =>
        prevNodes.filter((node) => node.id !== nodeId),
      );

      setReactFlowEdges((prevEdges) =>
        prevEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId,
        ),
      );

      setActiveNodeState((prevActiveNode) =>
        prevActiveNode?.id === nodeId ? null : prevActiveNode,
      );
    },
    [setReactFlowNodes, setReactFlowEdges],
  );

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

  // get node
  const getNode = useCallback(
    (nodeId: string): PipelineNode | undefined => {
      return nodes.find((n) => n.id === nodeId);
    },
    [nodes],
  );
  // get node status
  const getNodeStatus = (nodeId: string): 'success' | 'failed' | 'pending' => {
    const node = getNode(nodeId);
    const status = node?.config?.status;
    if (status === 'success' || status === 'failed' || status === 'pending') {
      return status;
    }
    return 'pending';
  };

  // set node status
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

  //  set node completed
  const setNodeCompleted = (nodeId: string, completed: boolean) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, completed: completed } : node,
      ),
    );
  };

  // get node completed
  const getNodeCompleted = (nodeId: string): boolean => {
    const node = nodes.find((n) => n.id === nodeId);
    const completed = node?.completed;
    return typeof completed === 'boolean' ? completed : false;
  };

  // translate node type to processor_method
  // const getProcessorMethod = (nodeType: string, nodeLabel: string): string => {
  //   const processorMapping: Record<string, string> = {
  //     input: 'input_processor',
  //     transform: 'transform_processor',
  //     output: 'output_processor',
  //     opcua: 'opcua_processor',
  //     opcda: 'opcda_processor',
  //     database: 'database_processor',
  //     file: 'file_processor',
  //     api: 'api_processor',
  //   };

  //   // 優先使用 nodeType，如果沒有對應則用 nodeLabel 的小寫
  //   return (
  //     processorMapping[nodeType.toLowerCase()] ||
  //     processorMapping[nodeLabel.toLowerCase()] ||
  //     `${nodeLabel.toLowerCase()}_processor`
  //   );
  // };

  // build dependencies
  const buildDependencies = (nodeId: string): string[] => {
    return edges
      .filter((edge) => edge.target === nodeId)
      .map((edge) => edge.source);
  };

  // Exclude keys from object
  const excludeKeys = (
    obj: Record<string, unknown>,
    keysToExclude: string[],
  ) => {
    const result = { ...obj };
    keysToExclude.forEach((key) => delete result[key]);
    return result;
  };

  // turn node to dag task
  const transformNodeToDag = (node: PipelineNode) => {
    const dependencies = buildDependencies(node.id);
    const excludedKeys = ['start_date', 'schedule_interval'];
    const filteredConfig = excludeKeys(node.config, excludedKeys);

    return {
      task_id: node.id, // node id
      operator: 'PythonOperator',
      processor_stage: node.type, // node type
      processor_method: node.label,
      op_kwargs: {
        ...filteredConfig,
      },
      dependencies: dependencies,
      position: node.position,
    };
  };

  // React Flow drag and drop
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
      // console.log('Node double clicked:', node);
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

  // Pipeline config
  const buildPipelineConfig = (): PipelineConfigResult => {
    // turn nodes to dag tasks
    const tasks = nodes.map((node) => transformNodeToDag(node));

    const pipelineConfig = {
      dag_id: `pipeline_${generateUUID()}`,
      schedule_interval: findScheduleInterval(nodes),
      start_date: findStartDate(nodes),
      catchup: false,
      owner: localStorage.getItem('code') || 'unknown',
      tasks: tasks,
    };
    return pipelineConfig;
  };

  //
  const findScheduleInterval = (node: any) => {
    return node.find((n: any) => n.type === 'output')?.config
      ?.schedule_interval;
  };
  const findStartDate = (node: any) => {
    return node.find((n: any) => n.type === 'input')?.config?.start_date;
  };

  // load dags
  const loadPipelineData = useCallback(
    (data: { nodes: PipelineNode[]; edges: PipelineEdgeConfig[] }) => {
      //
      setNodes(data.nodes);
      setEdges(data.edges);

      // update react flow nodes and edges
      const reactFlowNodes = data.nodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          id: node.id,
          name: node.name,
          label: node.label,
          type: node.type,
          description: node.description,
          intro: node.description,
          completed: node.completed || false,
          status: node.config?.status || 'pending',
        },
      }));

      const reactFlowEdges = data.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'custom',
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      }));

      setReactFlowNodes(reactFlowNodes);
      setReactFlowEdges(reactFlowEdges);
    },
    [setReactFlowNodes, setReactFlowEdges],
  );

  // load from dag data
  const findLabel = (label: string) => {
    const searchInMenuItems = (items: any[]): any => {
      for (const item of items) {
        if (item.label === label) {
          return item;
        }
        if (item.children && Array.isArray(item.children)) {
          const found = searchInMenuItems(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    return searchInMenuItems(MenuList.menuList);
  };
  const loadFromDAG = useCallback(
    (dagData: any) => {
      const nodes: PipelineNode[] = dagData.tasks.map((task: any) => {
        const menuItem = findLabel(task.processor_method);

        let nodeConfig = {
          ...task.op_kwargs,
        };

        if (task.processor_stage === 'input') {
          nodeConfig = {
            ...nodeConfig,
            start_date: dagData.start_date || '',
          };
        } else if (task.processor_stage === 'output') {
          nodeConfig = {
            ...nodeConfig,
            schedule_interval: dagData.schedule_interval || '',
          };
        }

        return {
          id: task.task_id,
          type:
            task.processor_stage === 'input'
              ? 'input'
              : task.processor_stage === 'output'
                ? 'output'
                : 'transform',
          label: task.processor_method,
          position: task.position || { x: 0, y: 0 },
          description: menuItem?.description || 'No description found',
          name: menuItem?.name || task.task_id,
          config: nodeConfig,
          status: task.state || 'unknown',
        };
      });
      //  edges
      const edges: PipelineEdgeConfig[] = dagData.tasks.flatMap((task: any) =>
        (task.dependencies || []).map((dep: string) => ({
          id: `${dep}-${task.task_id}`,
          source: dep,
          target: task.task_id,
        })),
      );

      loadPipelineData({ nodes, edges });
    },
    [loadPipelineData],
  );

  // load from api
  const loadFromAPIResponse = useCallback(
    (apiResponse: any) => {
      if (apiResponse.success) {
        //
        console.log('API Response Data:', apiResponse.data);
        const dagData = apiResponse.data[0];
        loadFromDAG(dagData);
      } else {
        console.error('Invalid API response format');
      }
    },
    [loadFromDAG],
  );

  return (
    <PipelineContext.Provider
      value={{
        // Pipeline
        nodes,
        activeNode,

        // React Flow
        reactFlowNodes,
        reactFlowEdges,
        nodeTypes,
        edgeTypes,

        // Pipeline
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
        buildPipelineConfig,

        // React Flow
        setReactFlowNodes,
        onNodesChange,
        setReactFlowEdges,
        onEdgesChange,
        handleDrop,
        handleDragOver,
        onConnect,
        onNodeDoubleClick,
        onCanvasClick,

        // load pipeline data
        loadPipelineData,
        loadFromDAG,
        loadFromAPIResponse,
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
    deleteNode,
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
    deleteNode,
    handleDrop,
    handleDragOver,
    onConnect,
    onNodeDoubleClick,
    onCanvasClick,
  };
}
