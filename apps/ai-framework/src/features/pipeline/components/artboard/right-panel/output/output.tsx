import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import { Button } from '@/shared/ui/button';
import { useToaster } from '@/shared/hooks/use-toaster';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Value } from '@radix-ui/react-select';
import { Input } from '@/shared/ui/input';

export default function Output({ activeNode }: { activeNode: any }) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');
  const intervalItem = [
    { value: '@once', label: '只執行一次' },
    { value: '*/10 * * * *', label: '每十分鐘執行一次' },
    { value: '59 * * * *', label: '每小時尾端執行一次' },
    { value: '0 6 * * *', label: '每天早上6點執行一次' },
    { value: '0 0 * * *', label: '每天半夜12點執行一次' },
  ];

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
    schedule_interval: string;
    output_filename?: string;
  }>(() => ({
    schedule_interval: '@once',
    output_filename: '',
  }));

  useEffect(() => {
    if (node?.config) {
      setForm({
        schedule_interval: String(node.config.schedule_interval ?? '@once'),
        output_filename: (node.config.output_filename as string) || '',
      });
    } else {
      setForm({
        schedule_interval: '@once',
        output_filename: '',
      });
    }
  }, [activeNode, node]);

  // handler
  const handleConnect = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, form);
    if (form.output_filename === '') {
      setErrorMsg('別名欄位不得為空');
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
          {/* Steps */}
          {step === 1 && (
            <>
              <div className="form">
                <p className="text-sm font-bold text-neutral-800">
                  Basic information
                </p>
                <div className="form pt-2">
                  <Label className="text-sm" htmlFor="fs">
                    執行頻率
                  </Label>
                  <Select
                    value={form.schedule_interval}
                    onValueChange={(value) =>
                      handleFormChange('schedule_interval', value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="執行頻率" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>執行頻率</SelectLabel>
                        {intervalItem.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label className="text-sm" htmlFor="output_filename">
                    檔案名稱
                  </Label>
                  <Input
                    type="text"
                    id="output_filename"
                    placeholder="output_filename"
                    value={
                      form.output_filename === undefined
                        ? ''
                        : form.output_filename
                    }
                    onChange={(e) =>
                      handleFormChange('output_filename', e.target.value)
                    }
                  />
                  <p className="mt-1 text-sm text-red-500">{errorMsg}</p>
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
