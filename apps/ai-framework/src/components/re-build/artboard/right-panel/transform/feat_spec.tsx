import { usePipeline } from '@/hooks/use-pipeline/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
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

export default function FeatSpec({ activeNode }: { activeNode: any }) {
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
    rpm: node?.config?.rpm ?? '',
    type: node?.config?.type ?? '',
  }));

  useEffect(() => {
    setForm({
      fs: node?.config?.fs ?? '',
      rpm: node?.config?.rpm ?? '',
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
      <div className="mb-4 h-[calc(100vh-280px)] border border-b border-amber-500">
        {/*  */}
        <div className="flex h-full flex-col justify-between">
          {step === 1 && (
            <>
              <div className="form">
                {/*  */}
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
                </div>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="rpm">
                    轉速 (RPM)
                  </Label>
                  <Input
                    type="number"
                    id="rpm"
                    placeholder="rpm"
                    value={form.rpm ? form.rpm : ''}
                    onChange={(e) => handleFormChange('rpm', e.target.value)}
                  />
                </div>
                <div className="form pt-2">
                  <Label className="text-sm" htmlFor="fs">
                    軸承缺陷頻率字典 (可選)
                  </Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) => handleFormChange('type', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="軸承缺陷頻率字典" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>軸承缺陷頻率字典</SelectLabel>
                        <SelectItem value="hanning">
                          OA (Overall Amplitude): 總振幅特徵
                        </SelectItem>
                        <SelectItem value="flattop">
                          轉速相關特徵: 0.25X 至 16X 轉速諧波振幅
                        </SelectItem>
                        <SelectItem value="bearing_fault">
                          軸承缺陷特徵: BPFO、BPFI、BSF、FTF 及其諧波振幅
                        </SelectItem>
                        <SelectItem value="statistical">
                          頻域統計特徵: 重心頻率、頻率標準差、頻率偏度等
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
