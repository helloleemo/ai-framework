import { usePipeline } from '../../../../hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import InputStep from './input-setting-step';
import TopTitle from '../top-title';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { useToaster } from '@/shared/hooks/use-toaster';
import { getTagsIndataAPI } from '@/features/pipeline/api/input';
import { CloseIcon } from '@/shared/ui/icon/close-icon';
import TreeView from './tree-view';
import { Button } from '@/shared/ui/button';
import { Label } from '@radix-ui/react-label';
import DatePicker from './date-picker';
import { Input } from '@/shared/ui/input';
import turnToMs from '@/shared/utils/turn-to-ms';

export default function InputConfig({ activeNode }: { activeNode: any }) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');
  const [listTags, setListTags] = useState<string[]>([]);

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

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState<{
    tags: string[];
    start_date: string | Date;
    buffer: string;
  }>(() => ({
    tags: [],
    start_date: '',
    buffer: '',
  }));

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

  // get tags data
  const fetchTagsData = async () => {
    setLoading(true);
    const param = {
      tags: null,
      searchPage: 1,
      searchNodeName: '',
      pages: 100,
    };
    try {
      const res = await getTagsIndataAPI(param);
      if (res) {
        const tagsArray = Array.isArray(res) ? res : [];
        const tree = buildTree(tagsArray);
        setListTags(tree);
        setLoading(false);
      }
    } catch (err) {
      showError('取得標籤失敗，請稍後再試');
    }
  };

  // tag selected
  const selectedTags = form.tags || [];
  const handleTagSelect = (tag: string) => {
    setErrorMsg('');
    if (selectedTags.includes(tag)) {
      handleTagDelete(tag);
      return;
    } else {
      setForm((prevForm: any) => {
        const updateTags = prevForm.tags.includes(tag)
          ? prevForm.tags
          : [...(prevForm.tags || []), tag];
        return {
          ...prevForm,
          tags: updateTags,
        };
      });
    }
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

  // buffer change
  const handleBufferChange = (valueInSeconds: number) => {
    const valueInMs = turnToMs(valueInSeconds);
    handleFormChange('buffer', valueInMs);
  };

  const getDisplayBufferValue = () => {
    const bufferInMs = Number(form.buffer ?? 0);
    return bufferInMs / 1000; // displayed
  };

  // handler - button
  const handleNext2 = () => {
    nextStep();
    console.log(step);
    setLoading(true);
    if (form.tags && form.tags.length === 0) {
      setErrorMsg('標籤不可為空，必須至少選擇一個標籤');
      setLoading(false);
      return;
    } else {
      updateNodeConfig(activeNode.id, form);
      showSuccess('標籤設定成功！');
      console.log('form', form);
      setLoading(false);
      // setNodeCompleted(activeNode.id, true);
      // setActiveNode(null);
    }
  };

  const handleSave = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, form);
    showSuccess('節點設定成功！');
    setNodeCompleted(activeNode.id, true);
    setActiveNode(null);
    setLoading(false);
  };

  useEffect(() => {
    if (node?.config) {
      setForm({
        tags: (node.config.tags as string[]) || [],
        start_date:
          node.config.start_date &&
          (typeof node.config.start_date === 'string' ||
            typeof node.config.start_date === 'number' ||
            node.config.start_date instanceof Date)
            ? new Date(node.config.start_date).toISOString().split('T')[0]
            : '',
        buffer: (node.config.buffer as string) || '',
      });
    } else {
      setForm({
        tags: [],
        start_date: '',
        buffer: '',
      });
    }
    fetchTagsData();
  }, [activeNode, node]);

  return (
    <>
      <TopTitle title={activeNode.name} description={activeNode.description} />
      <div className="mb-4 border border-b border-amber-500">
        {/* <InputStep activeNode={node} form={form} setForm={setForm} /> */}
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
                  <div className="text-sm text-red-500">{errorMsg}</div>
                  {/* selected tags */}
                  <div className="">
                    <div className="flex flex-wrap gap-1">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag}
                          className="flex items-center gap-[2px] rounded border pr-1 pl-2"
                        >
                          <span className="text-sm text-neutral-500">
                            {tag}
                          </span>
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
                  onClick={handleNext2}
                  variant={'default'}
                  className={`mt-4 flex w-full items-center justify-center gap-2`}
                >
                  Next step
                </Button>
                {/* <Button
                  onClick={() => setStep(1)}
                  variant={'outline'}
                  className={`mt-4 flex w-full items-center justify-center gap-2`}
                >
                  Back
                </Button> */}
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
                      <DatePicker
                        selectedDate={
                          form.start_date
                            ? typeof form.start_date === 'string'
                              ? form.start_date
                              : form.start_date instanceof Date
                                ? form.start_date.toISOString().split('T')[0]
                                : null
                            : null
                        }
                        onDateChange={(date) =>
                          handleFormChange('start_date', date)
                        }
                      />
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
                  onClick={handleSave}
                  variant={'default'}
                  className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
                  disabled={loading}
                >
                  {loading ? Spinner : 'Save'}
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
      </div>
    </>
  );
}
