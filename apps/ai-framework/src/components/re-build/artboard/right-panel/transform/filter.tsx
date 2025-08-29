import { usePipeline } from '@/hooks/use-pipeline/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import InputStep from '../input/input-setting-step';
import { Button } from '@/components/ui/button';
import { useToaster } from '@/hooks/use-toaster';
import { useSpinner } from '@/hooks/use-spinner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Filter({ activeNode }: { activeNode: any }) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // step
  const [step, setStep] = useState(1);

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState(() => ({
    fs: node?.config?.fs ?? '',
    type: node?.config?.type ?? '',
  }));

  useEffect(() => {
    setForm({
      fs: node?.config?.fs ?? '',
      type: node?.config?.type ?? '',
    });
  }, [activeNode, node]);

  // handler
  const handleConnect = async () => {
    setLoading(true);
    try {
      await updateNodeConfig(activeNode.id, form);
      showSuccess('Connected successfully');
    } catch (error) {
      showError('Failed to connect');
    } finally {
      setLoading(false);
      console.log('form', form);
      setNodeCompleted(activeNode.id, true);
      setActiveNode(null);
    }
  };

  return (
    <>
      <TopTitle title={activeNode.name} description={activeNode.description} />
      <div className="mb-4 h-[calc(100vh-175px)] border border-b border-amber-500">
        {/*  */}
        <div className="flex h-full flex-col justify-between">
          {step === 1 && (
            <>
              <div className="form">
                <Label className="text-sm" htmlFor="fs">
                  窗函數類型
                </Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => handleFormChange('type', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="窗函數類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>窗函數類型</SelectLabel>
                      <SelectItem value="hanning">
                        hanning: 漢寧窗，常用的平滑窗函數
                      </SelectItem>
                      <SelectItem value="flattop">
                        flattop: 平頂窗，提供更準確的振幅測量
                      </SelectItem>
                      <SelectItem value="rectangular">
                        rectangular: 矩形窗，不做任何修改（全為1）
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleConnect}
                variant={'default'}
                className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
                disabled={loading}
              >
                {loading ? Spinner : '設定'}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
