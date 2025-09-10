import { useCallback } from 'react';
import { PipelineNode } from '../types/pipeline-context';
import { PipelineEdgeConfig } from '../types/pipeline';
import { MenuList } from '@/features/menu';

export function usePipelineLoader(
  setNodes: (nodes: PipelineNode[]) => void,
  setEdges: (edges: PipelineEdgeConfig[]) => void,
  setReactFlowNodes: React.Dispatch<React.SetStateAction<any[]>>,
  setReactFlowEdges: React.Dispatch<React.SetStateAction<any[]>>,
) {
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

  const loadPipelineData = useCallback(
    (data: { nodes: PipelineNode[]; edges: PipelineEdgeConfig[] }) => {
      setNodes(data.nodes);
      setEdges(data.edges);

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
    [setNodes, setEdges, setReactFlowNodes, setReactFlowEdges],
  );

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

  const loadFromAPIResponse = useCallback(
    (apiResponse: any) => {
      if (apiResponse.success) {
        console.log('API Response Data:', apiResponse.data);
        const dagData = apiResponse.data[0];
        loadFromDAG(dagData);
      } else {
        console.error('Invalid API response format');
      }
    },
    [loadFromDAG],
  );

  return {
    loadPipelineData,
    loadFromDAG,
    loadFromAPIResponse,
  };
}
