import { useSpinner } from '@/shared/hooks/use-spinner';
import { useToaster } from '@/shared/hooks/use-toaster';
import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { ChevronDownIcon, List } from 'lucide-react';
import { getInputAPI, getTagsIndataAPI } from '@/features/pipeline/api/input';
import turnToMs from '@/shared/utils/turn-to-ms';
import formatDateToYYYYMMDD from '@/shared/utils/format-date';
import { se } from 'date-fns/locale';
import TreeView from './tree-view';
import { CloseIcon } from '@/shared/ui/icon/close-icon';

type InputProps = {
  activeNode: any;
  form: any;
  setForm: (form: any) => void;
};

export default function InputStep({ activeNode, form, setForm }: InputProps) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');
  const [listTags, setListTags] = useState<any>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    fetchTagsData();
    setForm((prevForm: any) => ({
      ...prevForm,
      tags: activeNode.config?.tags ?? prevForm.tags,
      buffer: activeNode.config?.buffer ?? '',
      date: activeNode.config?.date ?? undefined,
    }));
  }, []);

  // set tree
  function buildTree(data: string[]) {
    const tree: any = {};

    data.forEach((item) => {
      const parts = item.split('.');
      let currentLevel = tree;

      parts.forEach((part) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      });
    });

    return tree;
  }

  // tag select
  const handleTagSelect = (tag: string) => {
    setForm((prevForm: any) => {
      const updatedTags = prevForm.tags.includes(tag)
        ? prevForm.tags.filter((t: string) => t !== tag)
        : [...prevForm.tags, tag];

      return {
        ...prevForm,
        tags: updatedTags,
      };
    });
  };

  const handleTagDelete = (tag: string) => {
    setForm((prevForm: any) => {
      const updatedTags = prevForm.tags.filter((t: string) => t !== tag);

      return {
        ...prevForm,
        tags: updatedTags,
      };
    });
  };

  // api
  const fetchTagsData = async () => {
    setLoading(true);
    try {
      const body = {
        tags: null,
        searchPage: 1,
        searchNodeName: '',
        pages: 100,
      };
      const res = await getTagsIndataAPI(body);
      const tagsArray = Array.isArray(res) ? (res as string[]) : [];
      const tree = buildTree(tagsArray);
      setListTags(tree);
      showSuccess('取得成功！');
    } catch (error) {
      showError('取得失敗！');
      setErrorMsg('標籤取得失敗，請稍後在試。');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, {
      tags: form.tags ? [] : '932ff8dd-dc1c-4dc5-9525-01e4551d920c',
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
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-neutral-800">
                  Select tags
                </p>
                {loading && (
                  <span>{createSpinner({ size: 'sm', color: 'blue' })}</span>
                )}
              </div>
              <div className="grid h-[calc(100vh-250px)] w-full max-w-sm items-center gap-1 overflow-y-auto pt-2">
                {errorMsg}
                {/* selected tags */}
                <div className="">
                  <div className="flex flex-wrap gap-1">
                    {selectedTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-[2px] rounded border pr-1 pl-2"
                      >
                        <span className="text-sm text-neutral-500">{tag}</span>
                        <div
                          onClick={() => handleTagDelete(tag)}
                          className="cursor-pointer"
                        >
                          <CloseIcon className="text-neutral-500 hover:text-neutral-800"></CloseIcon>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* render tags */}
                <TreeView
                  tree={listTags}
                  onTagSelect={handleTagSelect}
                  selectedTags={form.tags || []}
                />
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
                onClick={() => setStep(1)}
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
