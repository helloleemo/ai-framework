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
