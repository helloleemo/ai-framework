import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { usePipeline } from '@/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import InputStep from './input-setting-step';
import TopTitle from '../top-title';

export default function InputSetting({ activeNode }: { activeNode: any }) {
  const { getNode } = usePipeline();

  // form state
  const node = getNode(activeNode.id);
  const [form, setForm] = useState(() => ({
    ip: node?.config?.ip ?? '',
    port: node?.config?.port ?? '',
    tags: node?.config?.tags ?? [],
    buffer: node?.config?.buffer ?? '',
    date: node?.config?.date ?? undefined,
  }));

  useEffect(() => {
    setForm({
      ip: node?.config?.ip ?? '',
      port: node?.config?.port ?? '',
      tags: node?.config?.tags ?? [],
      buffer: node?.config?.buffer ?? '',
      date: node?.config?.date ?? undefined,
    });
  }, [activeNode, node]);

  return (
    <>
      <TopTitle
        title={activeNode.data.label}
        description={activeNode.data.description}
      />
      <div className="mb-4 h-[calc(100vh-175px)] border border-b border-amber-500">
        <InputStep activeNode={node} form={form} setForm={setForm} />
      </div>
    </>
  );
}
