import { PipelineNode, DagTask } from '@/features/pipeline/types/pipeline';
import { generateUUID } from '@/shared/utils/uuid';

const excludeKeys = (obj: Record<string, unknown>, keysToExclude: string[]) => {
  const result = { ...obj };
  keysToExclude.forEach((key) => delete result[key]);
  return result;
};

const buildDependencies = (nodeId: string, edges: any[]): string[] => {
  return edges
    .filter((edge) => edge.target === nodeId)
    .map((edge) => edge.source);
};

const transformNodeToDag = (node: PipelineNode, edges: any[]): DagTask => {
  const dependencies = buildDependencies(node.id, edges);
  const excludedKeys = ['start_date', 'schedule_interval'];
  const filteredConfig = excludeKeys(node.config, excludedKeys);

  return {
    task_id: node.id,
    operator: 'PythonOperator',
    processor_stage: node.type,
    processor_method: node.label,
    op_kwargs: {
      ...filteredConfig,
    },
    dependencies: dependencies,
  };
};

const findScheduleInterval = (nodes: PipelineNode[]) => {
  return nodes.find((n) => n.type === 'output')?.config?.schedule_interval;
};

const findStartDate = (nodes: PipelineNode[]) => {
  return nodes.find((n) => n.type === 'input')?.config?.start_date;
};

const buildPipelineConfig = (nodes: PipelineNode[], edges: any[]) => {
  const tasks = nodes.map((node) => transformNodeToDag(node, edges));

  return {
    dag_id: `pipeline_${generateUUID()}`,
    schedule_interval: findScheduleInterval(nodes),
    start_date: findStartDate(nodes),
    catchup: false,
    owner: localStorage.getItem('client_id') || 'unknown',
    tasks: tasks,
  };
};

export { transformNodeToDag, buildPipelineConfig };
