import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import { Button } from '@/shared/ui/button';
import { useToaster } from '@/shared/hooks/use-toaster';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';

export default function Dwt({ activeNode }: { activeNode: any }) {
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
  const totalSteps = 1;
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState(() => ({
    fs: node?.config?.fs ?? '',
  }));

  useEffect(() => {
    setForm({
      fs: node?.config?.fs ?? '',
    });
  }, [activeNode, node]);

  // handler
  const handleConnect = async () => {
    setLoading(true);
    try {
      await updateNodeConfig(activeNode.id, form);
      showSuccess(`${getNode(activeNode.id)?.label}設定成功！`);
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
      11
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
          {/* Steps */}
          {step === 1 && (
            <>
              <div className="form">
                <p className="text-sm font-bold text-neutral-800">
                  Basic information
                </p>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="fs">
                    沒有東西
                  </Label>
                  {/* <Input
                    type="number"
                    id="fs"
                    placeholder="fs"
                    value={form.fs ? form.fs : ''}
                    onChange={(e) => handleFormChange('fs', e.target.value)}
                  /> */}
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
