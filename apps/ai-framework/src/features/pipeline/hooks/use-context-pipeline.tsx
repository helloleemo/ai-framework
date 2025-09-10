import { createContext, useContext, ReactNode, useCallback } from 'react';
import { PipelineContextType } from '../types/pipeline-context';
import { usePipelineState } from './use-pipeline-state';
import { useReactFlow } from './use-react-flow';
import { usePipelineLoader } from './use-pipeline-loader';
import { buildPipelineConfig } from './pipeline-utils';

const PipelineContext = createContext<PipelineContextType | null>(null);

export function PipelineProvider({ children }: { children: ReactNode }) {
  const pipelineState = usePipelineState();

  const updatePipelineNodePosition = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      pipelineState.setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId ? { ...node, position } : node,
        ),
      );
    },
    [pipelineState.setNodes],
  );

  const reactFlow = useReactFlow(
    pipelineState.addNode,
    pipelineState.setEdge,
    pipelineState.deleteNode,
    pipelineState.getNode,
    pipelineState.setActiveNode,
    updatePipelineNodePosition,
  );

  const loader = usePipelineLoader(
    pipelineState.setNodes,
    pipelineState.setEdges,
    reactFlow.setReactFlowNodes,
    reactFlow.setReactFlowEdges,
  );

  const handleBuildPipelineConfig = useCallback(() => {
    return buildPipelineConfig(pipelineState.nodes, pipelineState.edges);
  }, [pipelineState.nodes, pipelineState.edges]);

  return (
    <PipelineContext.Provider
      value={{
        // Pipeline 狀態
        nodes: pipelineState.nodes,
        activeNode: pipelineState.activeNode,

        // React Flow 狀態
        reactFlowNodes: reactFlow.reactFlowNodes,
        reactFlowEdges: reactFlow.reactFlowEdges,
        nodeTypes: reactFlow.nodeTypes,
        edgeTypes: reactFlow.edgeTypes,

        // Pipeline 操作
        setEdge: pipelineState.setEdge,
        addNode: pipelineState.addNode,
        deleteNode: reactFlow.deleteNode,
        updateNodeConfig: pipelineState.updateNodeConfig,
        setActiveNode: pipelineState.setActiveNode,
        getNode: pipelineState.getNode,
        getNodeStatus: pipelineState.getNodeStatus,
        setNodeStatus: pipelineState.setNodeStatus,
        setNodeCompleted: pipelineState.setNodeCompleted,
        getNodeCompleted: pipelineState.getNodeCompleted,
        buildPipelineConfig: handleBuildPipelineConfig,

        // React Flow 操作
        setReactFlowNodes: reactFlow.setReactFlowNodes,
        onNodesChange: reactFlow.onNodesChange,
        setReactFlowEdges: reactFlow.setReactFlowEdges,
        onEdgesChange: reactFlow.onEdgesChange,
        handleDrop: reactFlow.handleDrop,
        handleDragOver: reactFlow.handleDragOver,
        onConnect: reactFlow.onConnect,
        onNodeDoubleClick: reactFlow.onNodeDoubleClick,
        onCanvasClick: reactFlow.onCanvasClick,

        // 數據載入
        loadPipelineData: loader.loadPipelineData,
        loadFromDAG: loader.loadFromDAG,
        loadFromAPIResponse: loader.loadFromAPIResponse,
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
