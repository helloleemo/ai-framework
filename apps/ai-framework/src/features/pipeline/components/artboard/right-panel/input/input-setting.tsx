import { usePipeline } from '../../../../hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import InputStep from './input-setting-step';
import TopTitle from '../top-title';

export default function InputSetting({ activeNode }: { activeNode: any }) {
  const { getNode } = usePipeline();
  console.log('InputSetting activeNode', activeNode);

  // setForm
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState<{
    tags: string[];
    date: string | Date;
    buffer: string;
  }>(() => ({
    tags: [],
    date: '',
    buffer: '',
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        tags: (node.config.tags as string[]) || [],
        date: (node.config.date as Date) || '',
        buffer: (node.config.buffer as string) || '',
      });
    } else {
      setForm({
        tags: [],
        date: '',
        buffer: '',
      });
    }
  }, [activeNode, node]);

  return (
    <>
      <TopTitle title={activeNode.name} description={activeNode.description} />
      <div className="mb-4 border border-b border-amber-500">
        <InputStep activeNode={node} form={form} setForm={setForm} />
      </div>
    </>
  );
}
