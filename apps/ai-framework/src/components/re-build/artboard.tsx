import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  OnConnect,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RightPanel from './artboard/right-panel';
import TopTab from './artboard/top-tab';
import { useCallback, useEffect } from 'react';
import {
  InputNode,
  TransformNode,
  OutputNode,
  edgeType,
} from './artboard/node-type';
import tokenTaker from '@/utils/token-taker';
import { Button } from '../ui/button';
import { createDag, getDagTemplate } from '@/api/pipeline';

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

// 轉換
export function dagToNodes(tasks: any[]) {
  return tasks.map((task) => ({
    id: task.task_id,
    type:
      task.processor_stage === 'extract'
        ? 'input'
        : task.processor_stage === 'load'
          ? 'output'
          : 'transform',
    position: {
      x: task.position?.x ?? 0,
      y: task.position?.y ?? 0,
    },
    data: {
      label: task.task_id,
      stage: task.processor_stage,
      method: task.processor_method,
      state: task.state,
    },
  }));
}
export function dagToEdges(tasks: any[]) {
  const edges: any[] = [];
  tasks.forEach((task) => {
    if (Array.isArray(task.dependencies)) {
      task.dependencies.forEach((dep: string) => {
        edges.push({
          id: `${dep}->${task.task_id}`,
          source: dep,
          target: task.task_id,
        });
      });
    }
  });
  return edges;
}

const dag = {
  dag_id: 'test_dag1',
  schedule_interval: '@once',
  start_date: '2025-06-25',
  catchup: false,
  owner: 'test',
  tasks: [
    {
      task_id: 'extract_data_task',
      operator: 'PythonOperator',
      processor_stage: 'extract',
      processor_method: 'np_reader.standard',
      op_kwargs: { input_filename: 'test.npy' },
      position: { x: 50, y: 400 },
      state: 'success',
    },
    {
      task_id: 'transform_data_task1',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['extract_data_task'],
      position: { x: 450, y: 400 },
      state: 'success',
    },
    {
      task_id: 'transform_data_task2',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task1'],
      position: { x: 850, y: 400 },
      state: 'success',
    },
    {
      task_id: 'transform_data_task3',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task2'],
      position: { x: 1250, y: 400 },
      state: 'success',
    },
    {
      task_id: 'transform_data_task4',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task3'],
      position: { x: 1650, y: 240 },
      state: 'success',
    },
    {
      task_id: 'transform_data_task5',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task3'],
      position: { x: 1650, y: 400 },
      state: 'failed',
    },
    {
      task_id: 'transform_data_task6',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task3'],
      position: { x: 1650, y: 560 },
      state: 'failed',
    },
    {
      task_id: 'transform_data_task7',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task3'],
      position: { x: 1650, y: 720 },
      state: 'failed',
    },
    {
      task_id: 'transform_data_task8',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task6'],
      position: { x: 2050, y: 560 },
      state: 'upstream_failed',
    },
    {
      task_id: 'transform_data_task9',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task6'],
      position: { x: 2050, y: 720 },
      state: 'upstream_failed',
    },
    {
      task_id: 'transform_data_task10',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task7'],
      position: { x: 2050, y: 880 },
      state: 'upstream_failed',
    },
    {
      task_id: 'transform_data_task11',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: [
        'transform_data_task4',
        'transform_data_task5',
        'transform_data_task6',
        'transform_data_task8',
        'transform_data_task10',
      ],
      position: { x: 2450, y: 560 },
      state: 'upstream_failed',
    },
    {
      task_id: 'transform_data_task12',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'array_processing.add_test',
      op_kwargs: { number: 2 },
      dependencies: ['transform_data_task9'],
      position: { x: 2450, y: 720 },
      state: 'upstream_failed',
    },
    {
      task_id: 'load_data_task1',
      operator: 'PythonOperator',
      processor_stage: 'load',
      processor_method: 'np_writer.standard',
      op_kwargs: { output_filename: 'test_output.csv' },
      dependencies: ['transform_data_task12'],
      position: { x: 2850, y: 720 },
      state: 'upstream_failed',
    },
    {
      task_id: 'load_data_task2',
      operator: 'PythonOperator',
      processor_stage: 'load',
      processor_method: 'np_writer.standard',
      op_kwargs: { output_filename: 'test_output.csv' },
      dependencies: ['transform_data_task11'],
      position: { x: 2850, y: 560 },
      state: 'upstream_failed',
    },
  ],
};

export default function Artboard() {
  useEffect(() => {
    tokenTaker();
  }, []);

  // nodes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 測試用
  const showPipeline = (sqc: number) => {
    getDagTemplate().then((res) => {
      const dag = res[sqc];
      setNodes(dagToNodes(dag.tasks));
      setEdges(dagToEdges(dag.tasks));
    });
  };

  const perfectRatioPipeline = () => {
    setNodes(dagToNodes(dag.tasks));
    setEdges(dagToEdges(dag.tasks));
  };

  const createAPipeline = () => {
    createDag(dag).then((res) => {
      console.log('Pipeline created:', res);
    });
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      console.log('Drop triggered');
      try {
        const data = JSON.parse(e.dataTransfer.getData('application/json'));
        console.log('Dataaaaaaaaa:', data);
        // position
        if (
          data.type === 'input' ||
          data.type === 'output' ||
          data.type === 'transform'
        ) {
          // position
          const position = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - position.left;
          const y = e.clientY - position.top;

          // new node
          const newNode: Node = {
            id: `${data.name}-${Date.now()}`,
            type: data.type,
            position: { x, y },
            data: { label: data.name, icon: data.icon },
          };
          console.log('Creating node:', newNode);
          setNodes((nodes) => [...nodes, newNode]);
        } else {
          console.log('Type does not match:', data.type);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [setNodes],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onConnect: OnConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <>
      {/* content */}
      <div className="h-full w-full">
        <TopTab />

        <div
          className="h-[calc(100vh-62px)] w-full border border-yellow-500"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactFlow
            className="h-full w-full"
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
          >
            <Controls />
            <Background bgColor="#fff" />
          </ReactFlow>
        </div>
        <div className="absolute top-5 left-5 z-10"></div>
      </div>
      <RightPanel />
    </>
  );
}

/**
 *         <div className="absolute z-10 flex gap-2 p-2">
          {[0, 1, 2].map((item, index) => {
            return (
              <Button variant={'outline'} onClick={() => showPipeline(item)}>
                get template{item + 1}
              </Button>
            );
          })}
          <Button variant={'outline'} onClick={perfectRatioPipeline}>
            perfect ratio
          </Button>{' '}
          <Button variant={'outline'} onClick={createAPipeline}>
            Create
          </Button>
        </div>
        <div className="absolute top-50 z-10">
          <Button variant={'outline'} onClick={createAPipeline}>
            get pipeline
          </Button>
        </div>
 */
