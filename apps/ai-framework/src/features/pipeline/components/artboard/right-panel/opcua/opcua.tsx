import { DashboardIcon } from '@/shared/ui/icon/dashboard-icon';
import { useEffect, useState } from 'react';
import OpcUaStep from './opc-ua-step';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';

export default function OPCUA({ activeNode }: { activeNode: any }) {
  const { getNode } = usePipeline();
  console.log('OPCUA node:', getNode(activeNode.id));

  // form state
  const [form, setForm] = useState({
    connectionString: '',
    account: '',
    password: '',
    selectedTags: [],
    connectStatus: false,
  });

  useEffect(() => {
    if (activeNode) {
      console.log('OPCUA activeNode:', activeNode);
      setForm((prev) => ({
        ...prev,
        connectionString: activeNode.config?.connectionString || '',
        account: activeNode.config?.account || '',
        password: activeNode.config?.password || '',
        selectedTags: activeNode.config?.selectedTags || [],
        connectStatus: activeNode.config?.connectStatus || false,
      }));
    }
  }, [activeNode]);

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
        <OpcUaStep activeNode={activeNode} form={form} setForm={setForm} />
      </div>
    </>
  );
}
