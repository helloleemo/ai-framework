import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import { Button } from '@/shared/ui/button';
import { useToaster } from '@/shared/hooks/use-toaster';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';

export default function Integ({ activeNode }: { activeNode: any }) {
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
  const totalSteps = 1;
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState<{
    fs: number;
  }>(() => ({
    fs: 0,
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        fs: (node.config.fs as number) || 0,
      });
    } else {
      setForm({
        fs: 0,
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
      <div className="mb-4 h-[calc(100vh-220px)] border border-b border-amber-500">
        {/* Progress Bar */}
        <div className="step flex items-start gap-2">
          {totalSteps > 1 &&
            Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`my-2 w-full border-b-2 ${
                  idx < step ? 'border-sky-500' : 'border-gray-300'
                }`}
              ></div>
            ))}
        </div>
        <div className="flex h-full flex-col justify-between">
          {/* Steps */}{' '}
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
                </div>
                <p className="p-2 text-sm text-red-500">{errorMsg}</p>
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
