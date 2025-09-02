import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import InputStep from '../input/input-setting-step';
import { Button } from '@/shared/ui/button';
import { useToaster } from '@/shared/hooks/use-toaster';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

export default function SignalPreprocess({ activeNode }: { activeNode: any }) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // step
  const [step, setStep] = useState(1);

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState<{
    fs: number;
    type: string;
  }>(() => ({
    fs: 0,
    type: '線性平均',
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        fs: (node.config.fs as number) || 0,
        type: (node.config.type as string) || '線性平均',
      });
    } else {
      setForm({
        fs: 0,
        type: '線性平均',
      });
    }
  }, [activeNode, node]);

  // handler
  const handleConnect = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, form);
    if (form.fs <= 0) {
      setErrorMsg('採樣頻率(Hz) 必須大於0');
      setLoading(false);
      return;
    }
    showSuccess('設定成功！');
    setNodeCompleted(activeNode.id, true);
    setLoading(false);
    console.log('form', form);
    setActiveNode(null);
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
                    value={form.fs === 0 ? '' : form.fs}
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
                  <p className="p-2 text-sm text-red-500">{errorMsg}</p>
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
