import { ReactFlow, Background, Controls, Handle } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RightPanel from './right-panel/right-panel';
import TopTab from './top-tab';
import { useEffect } from 'react';

import {
  useArtboardNodes,
  PipelineProvider,
  usePipeline,
} from '@/features/pipeline/hooks/use-context-pipeline';

import PipelineDeploy from './prebuild-deploy';
import { usePipelineLoader } from '../../hooks/use-pipeline-loader';

// 轉換
// export function dagToNodes(tasks: any[]) {
//   return tasks.map((task) => ({
//     id: task.task_id,
//     type:
//       task.processor_stage === 'extract'
//         ? 'input'
//         : task.processor_stage === 'load'
//           ? 'output'
//           : 'transform',
//     position: {
//       x: task.position?.x ?? 0,
//       y: task.position?.y ?? 0,
//     },
//     data: {
//       label: task.task_id,
//       stage: task.processor_stage,
//       method: task.processor_method,
//       state: task.state,
//     },
//   }));
// }
// export function dagToEdges(tasks: any[]) {
//   const edges: any[] = [];
//   tasks.forEach((task) => {
//     if (Array.isArray(task.dependencies)) {
//       task.dependencies.forEach((dep: string) => {
//         edges.push({
//           id: `${dep}->${task.task_id}`,
//           source: dep,
//           target: task.task_id,
//         });
//       });
//     }
//   });
//   return edges;
// }
// 完美比例ㄉDAG
// const dag = {
//   dag_id: 'test_dag1',
//   schedule_interval: '@once',
//   start_date: '2025-06-25',
//   catchup: false,
//   owner: 'test',
//   tasks: [
//     {
//       task_id: 'extract_data_task',
//       operator: 'PythonOperator',
//       processor_stage: 'extract',
//       processor_method: 'np_reader.standard',
//       op_kwargs: { input_filename: 'test.npy' },
//       position: { x: 50, y: 400 },
//       state: 'success',
//     },
//     {
//       task_id: 'transform_data_task1',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['extract_data_task'],
//       position: { x: 450, y: 400 },
//       state: 'success',
//     },
//     {
//       task_id: 'transform_data_task2',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task1'],
//       position: { x: 850, y: 400 },
//       state: 'success',
//     },
//     {
//       task_id: 'transform_data_task3',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task2'],
//       position: { x: 1250, y: 400 },
//       state: 'success',
//     },
//     {
//       task_id: 'transform_data_task4',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task3'],
//       position: { x: 1650, y: 240 },
//       state: 'success',
//     },
//     {
//       task_id: 'transform_data_task5',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task3'],
//       position: { x: 1650, y: 400 },
//       state: 'failed',
//     },
//     {
//       task_id: 'transform_data_task6',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task3'],
//       position: { x: 1650, y: 560 },
//       state: 'failed',
//     },
//     {
//       task_id: 'transform_data_task7',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task3'],
//       position: { x: 1650, y: 720 },
//       state: 'failed',
//     },
//     {
//       task_id: 'transform_data_task8',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task6'],
//       position: { x: 2050, y: 560 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'transform_data_task9',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task6'],
//       position: { x: 2050, y: 720 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'transform_data_task10',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task7'],
//       position: { x: 2050, y: 880 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'transform_data_task11',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: [
//         'transform_data_task4',
//         'transform_data_task5',
//         'transform_data_task6',
//         'transform_data_task8',
//         'transform_data_task10',
//       ],
//       position: { x: 2450, y: 560 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'transform_data_task12',
//       operator: 'PythonOperator',
//       processor_stage: 'transform',
//       processor_method: 'array_processing.add_test',
//       op_kwargs: { number: 2 },
//       dependencies: ['transform_data_task9'],
//       position: { x: 2450, y: 720 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'load_data_task1',
//       operator: 'PythonOperator',
//       processor_stage: 'load',
//       processor_method: 'np_writer.standard',
//       op_kwargs: { output_filename: 'test_output.csv' },
//       dependencies: ['transform_data_task12'],
//       position: { x: 2850, y: 720 },
//       state: 'upstream_failed',
//     },
//     {
//       task_id: 'load_data_task2',
//       operator: 'PythonOperator',
//       processor_stage: 'load',
//       processor_method: 'np_writer.standard',
//       op_kwargs: { output_filename: 'test_output.csv' },
//       dependencies: ['transform_data_task11'],
//       position: { x: 2850, y: 560 },
//       state: 'upstream_failed',
//     },
//   ],
// };

const apiResponse = {
  dag_id: 'template_dag_pipeline1',
  schedule_interval: '@once',
  start_date: '2025-06-25',
  catchup: false,
  owner: 'test',
  tasks: [
    {
      task_id: 'extract_data_task',
      operator: 'PythonOperator',
      processor_stage: 'input',
      processor_method: 'indata_reader.standard',
      op_kwargs: {
        tags: ['932ff8dd-dc1c-4dc5-9525-01e4551d920c'],
        buffer: 3000,
      },
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_preproc.mean',
      op_kwargs: {
        fs: 6400,
        type: 'RMS平均',
      },
      dependencies: ['extract_data_task'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task2',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_preproc.windows',
      op_kwargs: {
        type: 'hanning',
      },
      dependencies: ['transform_data_task'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task3',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_preproc.filter',
      op_kwargs: {
        fs: 6400,
        lowcut: 2,
        highcut: 1000,
      },
      dependencies: ['transform_data_task2'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task4',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '111',
      },
      dependencies: ['transform_data_task3'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task5',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.fft',
      op_kwargs: {
        fs: 6400,
      },
      dependencies: ['transform_data_task3'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task6',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.dwt',
      op_kwargs: {},
      dependencies: ['transform_data_task3'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task7',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '333',
      },
      dependencies: ['transform_data_task5'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task8',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '222',
      },
      dependencies: ['transform_data_task6'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task9',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_vel.integ',
      op_kwargs: {
        fs: 6400,
      },
      dependencies: ['transform_data_task3'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task10',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '333',
      },
      dependencies: ['transform_data_task9'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task11',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.dwt',
      op_kwargs: {},
      dependencies: ['transform_data_task9'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task12',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '555',
      },
      dependencies: ['transform_data_task11'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task13',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.fft',
      op_kwargs: {
        fs: 6400,
      },
      dependencies: ['transform_data_task9'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task14',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_spec',
      op_kwargs: {
        fs: 6400,
        rpm: 1200,
        Bearing: {
          BPFO: 5.2789,
          BPFI: 7.5303,
          BSF: 2.6805,
          FTF: 0.4064,
        },
        alias: '444',
      },
      dependencies: ['transform_data_task13'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task15',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_enve.hilbert',
      op_kwargs: {
        fs: 6400,
        rpm: 1200,
      },
      dependencies: ['transform_data_task3'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task16',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.dwt',
      op_kwargs: {},
      dependencies: ['transform_data_task15'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task17',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_sta',
      op_kwargs: {
        alias: '777',
      },
      dependencies: ['transform_data_task16'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task18',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_freq.fft',
      op_kwargs: {
        fs: 6400,
      },
      dependencies: ['transform_data_task15'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'transform_data_task19',
      operator: 'PythonOperator',
      processor_stage: 'transform',
      processor_method: 'pdm_features.feat_spec',
      op_kwargs: {
        fs: 6400,
        rpm: 1200,
        alias: '888',
      },
      dependencies: ['transform_data_task18'],
      position: {
        x: 123,
        y: 456,
      },
    },
    {
      task_id: 'load_data_task',
      operator: 'PythonOperator',
      processor_stage: 'output',
      processor_method: 'csv_writer.standard',
      op_kwargs: {
        output_filename: 'test_output.csv',
      },
      dependencies: [
        'transform_data_task4',
        'transform_data_task7',
        'transform_data_task8',
        'transform_data_task10',
        'transform_data_task12',
        'transform_data_task17',
        'transform_data_task14',
        'transform_data_task19',
      ],
      position: {
        x: 123,
        y: 456,
      },
    },
  ],
};

function ArtboardRoot() {
  const { loadPipelineFromData } = usePipelineLoader();
  // useEffect(() => {
  //   // 取pipeline token ，之後記得拿掉
  //   // tokenTaker();
  //   const apiData = {
  //     success: true,
  //     message: 'Retrieve successful',
  //     data: [apiResponse],
  //   };
  //   loadPipelineFromData(apiData);
  // }, [loadPipelineFromData]);

  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    nodeTypes,
    edgeTypes,
    handleDrop,
    handleDragOver,
    onConnect,
    onNodeDoubleClick,
    onCanvasClick,
  } = useArtboardNodes();

  const { activeNode } = usePipeline();

  return (
    <>
      {/* TEST */}
      <div className="absolute top-16 left-[360px] z-10">
        <PipelineDeploy />
      </div>

      {/* content */}
      <div className="h-full w-full" onClick={onCanvasClick}>
        {/* <TopTab /> */}

        <div
          className="h-[calc(100vh-18px)] w-full border border-yellow-500"
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
            onNodeDoubleClick={onNodeDoubleClick}
          >
            <Controls />
            <Background bgColor="#fff" />
          </ReactFlow>
        </div>
        <div className="absolute top-5 left-5 z-10"></div>
      </div>
      <RightPanel activeNode={activeNode} />
      {/*  */}
    </>
  );
}

export default function Artboard() {
  return (
    <PipelineProvider>
      <ArtboardRoot />
    </PipelineProvider>
  );
}
