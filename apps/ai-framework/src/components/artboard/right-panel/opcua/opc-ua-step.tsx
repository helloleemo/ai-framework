import { connectOpcuaAPI, getTagsAPI, readNodesAPI } from '@/api/opcua';
import { CloseIcon } from '@/shared/ui/icon/close-icon';
import { DashboardIcon } from '@/shared/ui/icon/dashboard-icon';
import { InfoIcon } from '@/shared/ui/icon/info-icon';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { useToaster } from '@/shared/hooks/use-toaster';
import { Label } from '@radix-ui/react-label';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

type OpcUaStepProps = {
  activeNode: any;
  form: any;
  setForm: (form: any) => void;
};

export default function OpcUaStep({
  activeNode,
  form,
  setForm,
}: OpcUaStepProps) {
  useEffect(() => {
    if (form.selectedTags && form.selectedTags.length > 0) {
      // 載入已保存的 tags 到本地狀態
      setForm2((prev) => ({
        ...prev,
        tags: form.selectedTags,
      }));
    }
  }, [form.selectedTags]);
  //
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const [step, setStep] = useState(1);
  const { showSuccess, showError } = useToaster();

  // tags
  const [form2, setForm2] = useState<{
    duration: string;
    tags: string[];
  }>({
    duration: '',
    tags: [],
  });

  // tags expanded
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [childrenMap, setChildrenMap] = useState<{ [key: string]: any[] }>({});
  const [tagsData, setTagsData] = useState<any[]>([]);

  // connect
  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await connectOpcuaAPI(
        form.connectionString,
        form.account,
        form.password,
      );
      setLoading(false);
      console.log('Connection response:', res);
      if (res.success) {
        showSuccess('連線成功！');
        try {
          const res = await getTagsAPI(
            null,
            '',
            form.connectionString,
            form.account,
            form.password,
          );
          if (res.success) {
            console.log('Get tags response:', res);
            setTagsData(res.data);
            showSuccess('取得標籤成功！');
            setStep(2);
          }
        } catch (error) {
          showError('取得標籤失敗！');
          console.error('Get tags error:', error);
        }
      }
    } catch (err) {
      showError('連線失敗！');
      console.error('Connection error:', err);
      setLoading(false);
      // setStep(2);
    }
    setLoading(false);
    setStep(2);
  };

  // api -

  const fetchReadNodes = async (nodeId: string[]) => {
    try {
      const res = await readNodesAPI(
        '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        form.connectionString,
        form.account,
        form.password,
        form.selectedTags,
      );
      console.log('Read nodes response:', res);
      showSuccess('取得標籤的資訊成功！');
      setForm((prevForm: any) => ({
        ...prevForm,
        connectStatus: true,
      }));
    } catch (error) {
      showError('取得標籤的資訊失敗！');
      console.error('Connect to node error:', error);
    }
  };

  const handleConnectToNode = async () => {
    // 暫時用
    setForm((prevForm: any) => ({
      ...prevForm,
      connectStatus: true,
    }));
    //
    // console.log('Connect to node with form data:', {
    //   connectionString: form.connectionString,
    //   account: form.account,
    //   password: form.password,
    //   selectedTags: form.selectedTags,
    //   connectStatus: form.connectStatus,
    // });
  };
  // input: connnection
  const handleInput = (
    connectionString: string,
    account: string,
    password: string,
    // selectedTags: string[],
    // connectStatus: boolean,
  ) => {
    setForm((prevForm: any) => ({
      ...prevForm,
      connectionString,
      account,
      password,
      selectedTags: prevForm.selectedTags || [],
      connectStatus: prevForm.connectStatus || false,
    }));
  };
  // render nodes and tags
  function renderNode(node: any) {
    const isSelected =
      !node.hasChildren && form2.tags.includes(node.displayName);
    const isExpanded = expanded[node.nodeId];
    const isLoadingChildren =
      loading && isExpanded && !childrenMap[node.nodeId];

    return (
      <div key={node.nodeId}>
        <div
          className="-gap-2 flex items-center"
          onClick={() => node.hasChildren && handleExpand(node.nodeId)}
        >
          {node.hasChildren ? (
            <button className="mr-1 cursor-pointer">
              {isExpanded ? (
                <div className="flex">
                  <ChevronDown className="h-4 w-4 text-blue-500" />
                </div>
              ) : (
                <ChevronRight className="h-4 w-4 text-blue-500" />
              )}
            </button>
          ) : (
            <span className="h-1 w-1" />
          )}
          <div
            style={{ cursor: node.hasChildren ? 'pointer' : 'default' }}
            className={`mt-1 rounded px-2 py-1 text-sm transition-all ${isSelected ? 'bg-blue-50 font-bold text-sky-500' : ''} ${node.hasChildren ? 'cursor-default text-neutral-700' : 'cursor-pointer hover:bg-neutral-100'} `}
            onClick={() => !node.hasChildren && handleTagSelect(node)}
          >
            <p className="cursor-pointer break-all">{node.displayName}</p>
          </div>
          {isLoadingChildren && (
            <span className="ml-2 pt-1">
              {createSpinner({ color: 'gray', size: 'sm' })}
            </span>
          )}
        </div>
        {node.hasChildren && isExpanded && childrenMap[node.nodeId] && (
          <div className="mt-2 ml-4 border-l pl-1">
            {childrenMap[node.nodeId].map(renderNode)}
          </div>
        )}
      </div>
    );
  }
  const handleExpand = async (nodeId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));

    //
    if (!childrenMap[nodeId]) {
      setLoading(true);
      try {
        const res = await getTagsAPI(
          null,
          nodeId,
          form.connectionString,
          form.account,
          form.password,
        );
        if (res.success && res.data) {
          setChildrenMap((prev) => ({
            ...prev,
            [nodeId]: res.data,
          }));
          setLoading(false);
        } else {
          setChildrenMap((prev) => ({
            ...prev,
            [nodeId]: [],
          }));
          setLoading(false);
        }
      } catch (error) {
        console.error('Get children error:', error);
        setChildrenMap((prev) => ({
          ...prev,
          [nodeId]: [],
        }));
        setLoading(false);
      }
    }
  };
  const handleTagSelect = (tag: any) => {
    if (tag.hasChildren) return;

    setForm2((prev) => {
      const alreadySelected = prev.tags.includes(tag.displayName);
      const newTags = alreadySelected
        ? prev.tags.filter((t) => t !== tag.displayName)
        : [...prev.tags, tag.displayName];

      setForm((prevForm: any) => ({
        ...prevForm,
        selectedTags: newTags,
      }));

      return { ...prev, tags: newTags };
    });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      {step === 1 && (
        <>
          <div className="form">
            <p className="text-sm font-bold text-neutral-800">
              Basic information
            </p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              <Label className="text-sm" htmlFor="connection">
                Connection
              </Label>
              <Input
                onInput={(e) =>
                  handleInput(
                    e.currentTarget.value,
                    form.account,
                    form.password,
                  )
                }
                type="text"
                id="connection"
                placeholder="Connection"
                value={form.connectionString}
              />
              <Label className="pt-2 text-sm" htmlFor="account">
                Account
              </Label>
              <Input
                onInput={(e) =>
                  handleInput(
                    form.connectionString,
                    e.currentTarget.value,
                    form.password,
                  )
                }
                type="text"
                id="account"
                placeholder="account"
                value={form.account}
              />
              <Label className="pt-2 text-sm" htmlFor="password">
                Password
              </Label>
              <Input
                onInput={(e) =>
                  handleInput(
                    form.connectionString,
                    form.account,
                    e.currentTarget.value,
                  )
                }
                type="text"
                id="password"
                placeholder="password"
                value={form.password}
              />
            </div>
          </div>

          <Button
            onClick={handleConnect}
            variant={'default'}
            className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
            disabled={loading}
          >
            {loading ? Spinner : 'Connect'}
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto">
            <p className="text-sm font-bold text-neutral-800">Tag settings</p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              <div className="flex items-center gap-2 pt-2">
                <Label className="text-sm" htmlFor="tags">
                  Selected Tags
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <InfoIcon className="inline-block h-4 w-4 text-neutral-500" />
                    </TooltipTrigger>
                    <TooltipContent data-side="right">
                      At least one tag must be selected.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex h-full flex-wrap">
                {form2.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-text-neutral-500 mr-1 mb-1 flex w-fit items-center rounded bg-neutral-100 px-2 py-1 text-xs break-all"
                  >
                    {tag}
                    <button
                      className="ml-1 cursor-pointer text-neutral-500 hover:text-neutral-900"
                      onClick={() => {
                        const newTags = form2.tags.filter((t) => t !== tag);

                        setForm2((prev) => ({
                          ...prev,
                          tags: newTags,
                        }));

                        setForm((prevForm: any) => ({
                          ...prevForm,
                          selectedTags: newTags,
                        }));
                      }}
                      type="button"
                      tabIndex={-1}
                    >
                      <CloseIcon className="h-4 w-4 hover:h-5 hover:w-5" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="scroller-fade h-[calc(100vh-350px)] overflow-y-auto">
                {tagsData.map(renderNode)}
              </div>
            </div>
          </div>
          <Button
            onClick={handleConnectToNode}
            variant={'default'}
            className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
            disabled={loading}
          >
            {loading ? Spinner : 'Connect'}
          </Button>
        </>
      )}
    </div>
  );
}
