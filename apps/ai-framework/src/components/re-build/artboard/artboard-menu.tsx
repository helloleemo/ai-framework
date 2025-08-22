import { getMenuItemsAPI } from '@/api/menu';
import { PipeIcon } from '@/components/icon/pipe-icon';
import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDagTemplate } from '@/api/pipeline';
// 完美比例ㄉDAG
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
export default function ArtboardMenu() {
  const navigate = useNavigate();
  //
  const [openDialog, setOpenDialog] = useState(false);
  const handleCreateNew = () => {
    setOpenDialog(true);
  };
  const menus = [
    {
      name: '建立新畫布',
      description: '從空畫布開始新建Pipeline。',
      icon: <PipeIcon className="text-sky-500" />,
      linkTo: '/re-build/ai-framework/artboard',
    },
    {
      name: '從範本建立',
      description: '從範本建立新的Pipeline。',
      icon: <PipeLineIcon2 className="text-sky-500" />,
      onClick: handleCreateNew,
    },
  ];

  const handleSelectTemplate = async (templateIndex: number) => {
    try {
      const res = await getDagTemplate();
      const templateData = res[templateIndex];

      sessionStorage.setItem('selectedTemplate', JSON.stringify(templateData));

      setOpenDialog(false);
      navigate('/re-build/ai-framework/artboard-temp');
    } catch (error) {
      console.error('載入模板失敗:', error);
    }
  };

  return (
    <>
      <div className="absolute top-1/3 left-3/5 -translate-x-1/2 -translate-y-1/2">
        {menus.map((menuItem, index) => {
          if (menuItem.linkTo) {
            return (
              <Link to={menuItem.linkTo} key={index} className="mb-5 block">
                <div className="flex w-[380px] cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-10 py-5 hover:bg-neutral-50">
                  <div className="icon">{menuItem.icon}</div>
                  <div className="word">
                    <p className="text-lg">{menuItem.name}</p>
                    <p className="text-base text-neutral-500">
                      {menuItem.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <div
                key={index}
                onClick={menuItem.onClick}
                className="mb-5 flex w-[380px] cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-white px-10 py-5 hover:bg-neutral-50"
              >
                <div className="icon">{menuItem.icon}</div>
                <div className="word">
                  <p className="text-lg">{menuItem.name}</p>
                  <p className="text-base text-neutral-500">
                    {menuItem.description}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
      {/* Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>請選擇模板</DialogTitle>
            <DialogDescription>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="canvas-name">模板</Label>
              {/* 模板選擇 */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSelectTemplate(0)}
                  variant="outline"
                  className="w-fit"
                >
                  模板1
                </Button>
                <Button
                  onClick={() => handleSelectTemplate(1)}
                  variant="outline"
                  className="w-fit"
                >
                  模板2
                </Button>
                <Button
                  onClick={() => handleSelectTemplate(3)}
                  variant="outline"
                  className="w-fit"
                >
                  模板3
                </Button>
              </div>
            </div>
          </div>
          <div className="my-5 border-b border-b-neutral-200"></div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">取消</Button>
            </DialogClose>
            {/* <Button
              type="submit"
              onClick={() => {
                //
                setOpenDialog(false);
                // 導向到 artboard
                window.location.href = '/re-build/ai-framework/artboard';
              }}
            >
              建立
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
