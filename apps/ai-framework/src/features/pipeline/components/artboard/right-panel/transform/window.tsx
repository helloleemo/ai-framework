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

export default function Window({ activeNode }: { activeNode: any }) {
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
    type: string;
  }>(() => ({
    type: 'hanning',
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        type: (node.config.type as string) || 'hanning',
      });
    } else {
      setForm({
        type: 'hanning',
      });
    }
  }, [activeNode, node]);

  // handler
  const handleConnect = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, form);
    // if (form.fs <= 0) {
    //   setErrorMsg('fs必須大於0');
    //   setLoading(false);
    //   return;
    // }
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
                <p className="p-2 text-sm">{errorMsg}</p>
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
