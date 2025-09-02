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

export default function Filter({ activeNode }: { activeNode: any }) {
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
    lowcut: number;
    highcut: number;
  }>(() => ({
    fs: 0,
    lowcut: 0,
    highcut: 0,
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        fs: (node.config.fs as number) || 0,
        lowcut: (node.config.lowcut as number) || 0,
        highcut: (node.config.highcut as number) || 0,
      });
    } else {
      setForm({
        fs: 0,
        lowcut: 0,
        highcut: 0,
      });
    }
  }, [activeNode, node]);

  // handler
  const handleConnect = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, form);
    if (form.fs <= 0 || form.lowcut <= 0 || form.highcut <= 0) {
      setErrorMsg('所有值必須大於0');
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
                  <Label className="text-sm" htmlFor="lowcut">
                    低頻截止頻率 (Hz)
                  </Label>
                  <Input
                    type="number"
                    id="lowcut"
                    placeholder="lowcut"
                    value={form.lowcut === 0 ? '' : form.lowcut}
                    onChange={(e) => handleFormChange('lowcut', e.target.value)}
                  />
                  <Label className="text-sm" htmlFor="highcut">
                    高頻截止頻率 (Hz)
                  </Label>
                  <Input
                    type="number"
                    id="highcut"
                    placeholder="highcut"
                    value={form.highcut === 0 ? '' : form.highcut}
                    onChange={(e) =>
                      handleFormChange('highcut', e.target.value)
                    }
                  />
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
