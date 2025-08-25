import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { usePipeline } from '@/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import InputStep from './input-setting-step';

export default function InputSetting({ activeNode }: { activeNode: any }) {
  console.log('activeNode:', activeNode);
  const { getNode } = usePipeline();
  console.log('Input node:', getNode(activeNode.id));

  // form state
  const node = getNode(activeNode.id);
  const [form, setForm] = useState({
    id: activeNode.id,
    name: node?.label || '',
    type: node?.type || '',
    config: node?.config || {},
  });

  useEffect(() => {
    setForm({
      id: activeNode.id,
      name: getNode(activeNode.id)?.label || '',
      type: getNode(activeNode.id)?.type || '',
      config: getNode(activeNode.id)?.config || {},
    });
  }, [activeNode, getNode]);
  return (
    <>
      <div className="title mb-2 flex items-center justify-start gap-3">
        <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
          <DashboardIcon className="h-5 w-5 text-sky-500" />
        </div>
        <p className="text-lg font-bold">{activeNode.data.label}</p>
      </div>
      <p className="mb-4 text-sm text-gray-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
        illum.
      </p>
      <div className="mb-4 h-[calc(100vh-175px)] border border-b border-amber-500">
        <InputStep activeNode={node} form={form} setForm={setForm} />
      </div>
    </>
  );
}
