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

export default function SignalPreprocess({ activeNode }: { activeNode: any }) {
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
      showSuccess(`設定成功！`);
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
                <p className="text-sm font-bold text-neutral-800">
                  Basic information
                </p>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="fs">
                    採樣頻率 (Hz)
                  </Label>
                  <Input
                    type="number"
                    id="fs"
                    placeholder="fs"
                    value={form.fs ? form.fs : ''}
                    onChange={(e) => handleFormChange('fs', e.target.value)}
                  />
                  {/*  */}
                  <Label className="text-sm" htmlFor="fs">
                    處理類型
                  </Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => handleFormChange('type', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="處理類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>處理類型</SelectLabel>
                        <SelectItem value="線性平均">
                          線性平均: 三個區段取算術平均
                        </SelectItem>
                        <SelectItem value="RMS平均">
                          RMS平均: 三個區段取RMS平均
                        </SelectItem>
                        <SelectItem value="重疊平均">
                          重疊平均: 20%重疊率的重疊平均
                        </SelectItem>
                        <SelectItem value="處理峰值保持">
                          處理峰值保持: 保持三個區段中的最大值
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
