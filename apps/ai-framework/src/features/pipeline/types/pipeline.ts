import {
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
} from '@xyflow/react';

export interface PipelineConfig {
  id: string;
  name: string;
  description?: string;
  nodes: PipelineNodeConfig[];
  edges: PipelineEdgeConfig[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface PipelineNodeConfig {
  id: string;
  type: string;
  label: string;
  config: Record<any, any>;
  position: { x: number; y: number };
}

export interface PipelineEdgeConfig {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

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
  position?: { x: number; y: number }; // 添加位置屬性
}

export interface PipelineConfigResult {
  dag_id: string;
  schedule_interval: string | null;
  start_date: string;
  catchup: boolean;
  owner: string;
  tasks: (DagTask & { position?: { x: number; y: number } })[]; // 更新 tasks 類型以包含位置
}

export interface ReactFlowNode {
  id: string;
  data?: {
    type?: string;
    label?: string;
    description?: string;
    name?: string;
  };
  position?: { x: number; y: number };
}

export interface PipelineContextType {
  // Pipeline 狀態
  nodes: PipelineNode[];
  activeNode: PipelineNode | null;

  // React Flow 狀態
  reactFlowNodes: Node[];
  reactFlowEdges: Edge[];
  nodeTypes: NodeTypes;
  edgeTypes: EdgeTypes;

  // Pipeline 操作
  setEdge: (edge: any) => void;
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
  buildPipelineConfig: (dagId?: string) => PipelineConfigResult;

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
  loadPipelineData: (data: { nodes: PipelineNode[]; edges: any[] }) => void;
  loadFromDAG: (dagData: any) => void;
  loadFromAPIResponse: (apiResponse: any) => void;
  clearCanvas: () => void;
}
