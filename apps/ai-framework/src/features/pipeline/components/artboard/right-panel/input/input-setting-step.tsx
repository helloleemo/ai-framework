import { useSpinner } from '@/shared/hooks/use-spinner';
import { useToaster } from '@/shared/hooks/use-toaster';
import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { getInputAPI, getTagsIndataAPI } from '@/features/pipeline/api/input';
import turnToMs from '@/shared/utils/turn-to-ms';
import formatDateToYYYYMMDD from '@/shared/utils/format-date';

type InputProps = {
  activeNode: any;
  form: any;
  setForm: (form: any) => void;
};

export default function InputStep({ activeNode, form, setForm }: InputProps) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner } = useSpinner();
  const { showSuccess, showError } = useToaster();

  // step
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // buffer
  const handleBufferChange = (valueInSeconds: number) => {
    const valueInMs = turnToMs(valueInSeconds);
    handleFormChange('buffer', valueInMs);
  };

  const getDisplayBufferValue = () => {
    const bufferInMs = form.buffer ?? 0;
    return bufferInMs / 1000; // displayed
  };

  // date time
  const getCombinedDateTime = () => {
    if (!form.date) return null;
    return new Date(form.date).toISOString().split('T')[0];
  };

  // useEffect

  useEffect(() => {
    // fetchTagsData();
  }, []);

  // api
  const fetchData = async () => {
    setLoading(true);
    // const base_url = `http://${form.ip}:${form.port}`;
    try {
      const res = await getInputAPI(
        'api-client',
        'api-client',
        'password',
        'sa',
        '0x90133115',
        // form.client_id,
        // form.client_secret,
        // form.grant_type,
        // form.username,
        // form.password,
      );
      // console.log('res', res);
      showSuccess('連線成功！');
    } catch (error) {
      // console.error(error);
      showError('連線失敗！');
    } finally {
      setLoading(false);
    }
  };

  const fetchTagsData = async () => {
    setLoading(true);
    try {
      const body = {
        tags: null,
        searchNodeName: '',
        searchPage: 1,
        pages: 1000,
      };
      const res = await getTagsIndataAPI(body);
      console.log('res', res);
      showSuccess('取得成功！');
    } catch (error) {
      // console.error(error);
      showError('取得失敗！');
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, {
      // tags: form.tags ? [] : '932ff8dd-dc1c-4dc5-9525-01e4551d920c',
      tags: ['932ff8dd-dc1c-4dc5-9525-01e4551d920c'],
    });
    setLoading(false);
    setStep(2);
  };

  const handleSetNode = () => {
    setLoading(true);
    const combinedDateTime = getCombinedDateTime();

    updateNodeConfig(activeNode.id, {
      ...form.config,
      buffer: form.buffer,
      start_date: combinedDateTime,
      // selectedDate: form.date,
      // selectedTime: form.time,
    });
    setLoading(false);
    showSuccess(`設定成功！`);
    //
    setActiveNode(null);
    setNodeCompleted(activeNode.id, true);
  };
  console.log('Updated node config:', getNode(activeNode.id));
  const [open, setOpen] = useState(false);

  return (
    <>
      {' '}
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
              <p className="text-sm font-bold text-neutral-800">Select tags</p>
              <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                <button onClick={fetchTagsData} className="border">
                  get tags test
                </button>
                {/* <Label className="text-sm" htmlFor="tags">
                Tags
              </Label>
              <Input
                type="text"
                id="tags"
                placeholder="tags"
                value={form.tags?.join(', ') ?? ''}
                onChange={(e) =>
                  handleFormChange('tags', e.target.value.split(', '))
                }
              /> */}
              </div>
            </div>
            <div>
              <Button
                onClick={handleTagChange}
                variant={'default'}
                className={`mt-4 flex w-full items-center justify-center gap-2`}
              >
                Next step
              </Button>
              <Button
                onClick={() => setStep(1)}
                variant={'outline'}
                className={`mt-4 flex w-full items-center justify-center gap-2`}
              >
                Back
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="form">
              <p className="text-sm font-bold text-neutral-800">
                Basic information
              </p>
              <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                <div className="flex w-full gap-2">
                  <div className="flex w-full flex-col">
                    <Label
                      htmlFor="date-picker"
                      className="px-1 text-sm font-semibold"
                    >
                      Date
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="justify-between font-normal"
                        >
                          {form.date
                            ? formatDateToYYYYMMDD(form.date)
                            : 'Select date'}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={form.date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            handleFormChange('date', date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Label
                  htmlFor="buffer"
                  className="mx-1 px-1 text-sm font-semibold"
                >
                  Buffer(秒)
                </Label>
                <Input
                  type="number"
                  id="buffer"
                  placeholder="Buffer time (秒)"
                  className="mt-1"
                  value={getDisplayBufferValue() || ''}
                  onChange={(e) =>
                    handleBufferChange(Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
            <div>
              <Button
                onClick={handleSetNode}
                variant={'default'}
                className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
                disabled={loading}
              >
                {loading ? Spinner : 'Connect'}
              </Button>
              <Button
                onClick={() => setStep(2)}
                variant={'outline'}
                className={`mt-4 flex w-full items-center justify-center gap-2`}
              >
                Back
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
