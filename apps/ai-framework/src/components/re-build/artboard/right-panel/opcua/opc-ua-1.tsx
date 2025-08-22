import { connectOpcuaAPI, getTagsAPI } from '@/api/opcua';
import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpinner } from '@/hooks/use-spinner';
import { Label } from '@radix-ui/react-label';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronDownIcon, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { InfoIcon } from '@/components/icon/info-icon';
import { Tooltip } from '@radix-ui/react-tooltip';
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Toaster } from 'react-hot-toast';
import { useToaster } from '@/hooks/use-toaster';
import { CloseIcon } from '@/components/icon/close-icon';

const opcuaBrowser = {
  success: true,
  message: 'Success',
  statusCode: 'S000001',
  data: [
    {
      nodeId: 'i=2253',
      browseName: 'Server',
      displayName: 'Server',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=23470',
      browseName: 'Aliases',
      displayName: 'Aliases',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=2;i=5001',
      browseName: '2:DeviceSet',
      displayName: 'DeviceSet',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=2;i=6078',
      browseName: '2:NetworkSet',
      displayName: 'NetworkSet',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=2;i=6094',
      browseName: '2:DeviceTopology',
      displayName: 'DeviceTopology',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=1;i=1000',
      browseName: '1:324261',
      displayName: '324261',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=1;i=1001',
      browseName: '1:324262',
      displayName: '324262',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=1;i=1002',
      browseName: '1:324263',
      displayName: '324263',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'ns=1;i=1003',
      browseName: '1:324264',
      displayName: '324264',
      nodeClass: 'Object',
      hasChildren: true,
    },
  ],
};
const opcuaChildren = {
  success: true,
  message: 'Success',
  statusCode: 'S000001',
  data: [
    {
      nodeId: 'i=2254',
      browseName: 'ServerArray',
      displayName: 'ServerArray',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=2255',
      browseName: 'NamespaceArray',
      displayName: 'NamespaceArray',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=2256',
      browseName: 'ServerStatus',
      displayName: 'ServerStatus',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=2267',
      browseName: 'ServiceLevel',
      displayName: 'ServiceLevel',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=2994',
      browseName: 'Auditing',
      displayName: 'Auditing',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=12885',
      browseName: 'EstimatedReturnTime',
      displayName: 'EstimatedReturnTime',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=17634',
      browseName: 'LocalTime',
      displayName: 'LocalTime',
      nodeClass: 'Variable',
      hasChildren: false,
    },
    {
      nodeId: 'i=2268',
      browseName: 'ServerCapabilities',
      displayName: 'ServerCapabilities',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=2274',
      browseName: 'ServerDiagnostics',
      displayName: 'ServerDiagnostics',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=2295',
      browseName: 'VendorServerInfo',
      displayName: 'VendorServerInfo',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=2296',
      browseName: 'ServerRedundancy',
      displayName: 'ServerRedundancy',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=11715',
      browseName: 'Namespaces',
      displayName: 'Namespaces',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=17594',
      browseName: 'Dictionaries',
      displayName: 'Dictionaries',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=12637',
      browseName: 'ServerConfiguration',
      displayName: 'ServerConfiguration',
      nodeClass: 'Object',
      hasChildren: true,
    },
    {
      nodeId: 'i=14443',
      browseName: 'PublishSubscribe',
      displayName: 'PublishSubscribe',
      nodeClass: 'Object',
      hasChildren: true,
    },
  ],
};

export default function OPCUA1({ activeNode }: { activeNode: any }) {
  // toaster
  const { showSuccess, showError } = useToaster();

  // Step1
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    connectionString: '',
    account: '',
    password: '',
  });
  const handleInput = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const [form2, setForm2] = useState<{
    duration: string;
    tags: string[];
  }>({
    duration: '',
    tags: [],
  });

  const [loginError, setLoginError] = useState<string | null>(null);
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();

  // Step2
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // tags 展開
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [childrenMap, setChildrenMap] = useState<{ [key: string]: any[] }>({});
  const [tagsData, setTagsData] = useState<any[]>([]);

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

  //tag selected
  const handleTagSelect = (tag: any) => {
    if (tag.hasChildren) return;
    setForm2((prev) => {
      const alreadySelected = prev.tags.includes(tag.displayName);
      const tags = alreadySelected
        ? prev.tags.filter((t) => t !== tag.displayName)
        : [...prev.tags, tag.displayName];
      return { ...prev, tags };
    });
  };

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

  console.log('Active node in RightPanel:', activeNode);

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
        try {
          const res = await getTagsAPI(
            null,
            '',
            form.connectionString,
            form.account,
            form.password,
          );
          console.log('Get tags response:', res);
          setTagsData(res.data);
          showSuccess('取得標籤成功！');
          setStep(2);
        } catch (error) {
          console.error('Get tags error:', error);
          showError('標籤取得失敗，請稍後再試');
        }
      }
    } catch (err) {
      console.error('Connection error:', err);
      showError('連線失敗，請稍後再試');
      setLoading(false);
      // setStep(2);
    }
    setLoading(false);
    // setStep(2);
  };

  const handleSetProperties = () => {
    setStep(3);
  };
  const handleTryToConnect = () => {
    setStep(2);
  };

  return (
    <div>
      {step === 1 && (
        <>
          <p className="text-sm font-bold text-neutral-800">
            Basic information
          </p>
          <div className="grid w-full max-w-sm items-center gap-1 pt-2">
            <Label className="text-sm" htmlFor="connection">
              Connection
            </Label>
            <Input
              onInput={(e) =>
                handleInput('connectionString', e.currentTarget.value)
              }
              type="text"
              id="connection"
              placeholder="Connection"
              value="opc.tcp://opc.delmind.ap1.agenview.com:24336/AgenOPCUAServer"
            />
            <Label className="pt-2 text-sm" htmlFor="account">
              Account
            </Label>
            <Input
              onInput={(e) => handleInput('account', e.currentTarget.value)}
              type="text"
              id="account"
              placeholder="account"
              value="opcadmin"
            />
            <Label className="pt-2 text-sm" htmlFor="password">
              Password
            </Label>
            <Input
              onInput={(e) => handleInput('password', e.currentTarget.value)}
              type="text"
              id="password"
              placeholder="password"
              value="Hbbe8010"
            />
          </div>

          <Button
            onClick={handleConnect}
            variant={'default'}
            className={`mt-4 flex w-full items-center justify-center gap-2 ${
              loading ? 'cursor-default' : ''
            }`}
            disabled={loading}
          >
            {loading ? Spinner : 'Connect'}
            <p className="text-sm"></p>
          </Button>
        </>
      )}
      {step === 2 && (
        <>
          <div className="title mb-2 flex items-center justify-start gap-3">
            <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
              <DashboardIcon className="h-5 w-5 text-sky-500" />
            </div>
            <p className="text-lg font-bold">{activeNode.data.label}</p>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            illum.
          </p>
          <div className="mb-4 border-b border-gray-200"></div>
          <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto border border-yellow-500">
            <p className="text-sm font-bold text-neutral-800">Tag settings</p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              <div className="flex items-center gap-2 pt-2">
                <Label className="text-sm" htmlFor="tags">
                  Selected Tags{' '}
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

              {/*  */}
              <div className="flex h-full flex-wrap">
                {form2.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-text-neutral-500 mr-1 mb-1 flex w-fit items-center rounded bg-neutral-100 px-2 py-1 text-xs break-all"
                  >
                    {tag}
                    <button
                      className="ml-1 cursor-pointer text-neutral-500 hover:text-neutral-900"
                      onClick={() =>
                        setForm2((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t !== tag),
                        }))
                      }
                      type="button"
                      tabIndex={-1}
                    >
                      <CloseIcon className="h-4 w-4 hover:h-5 hover:w-5" />
                    </button>
                  </span>
                ))}
                {/* <p className="text-xs text-neutral-500">
                  {form2.tags.join(', ')}
                </p> */}
              </div>
              <div className="scroller-fade h-[calc(100vh-350px)] overflow-y-auto">
                {opcuaBrowser.data.map(renderNode)}
              </div>
            </div>
          </div>
          <Button
            onClick={handleSetProperties}
            variant={'default'}
            className="mt-4 w-full"
          >
            <p className="text-sm">Set properties</p>
          </Button>
        </>
      )}
      {step === 3 && (
        <>
          <div className="title mb-2 flex items-center justify-start gap-3">
            <div className="icon w-fit rounded-md border-2 border-sky-500 p-[3px]">
              <DashboardIcon className="h-5 w-5 text-sky-500" />
            </div>
            <p className="text-lg font-bold">{activeNode.data.label}</p>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            illum.
          </p>
          <div className="mb-4 border-b border-gray-200"></div>

          <div className="info h-[calc(100vh-250px)] flex-col overflow-y-auto border border-yellow-500">
            <p className="text-sm font-bold text-neutral-800">Data settings</p>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <Label htmlFor="date-picker" className="pt-2 text-sm">
                  Start date
                </Label>
                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-32 justify-between font-normal"
                    >
                      {startDate
                        ? startDate.toLocaleDateString()
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
                      selected={startDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setStartDate(date);
                        setStartDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="time-picker" className="pt-2 text-sm">
                  Time
                </Label>
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
            {/* End date and time */}
            <div className="mt-2 flex gap-4">
              <div className="flex flex-col">
                <Label htmlFor="end-date-picker" className="pt-2 text-sm">
                  End date
                </Label>
                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="end-date-picker"
                      className="w-32 justify-between font-normal"
                    >
                      {endDate ? endDate.toLocaleDateString() : 'Select date'}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={endDate}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setEndDate(date);
                        setEndDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col">
                <Label htmlFor="end-time-picker" className="pt-2 text-sm">
                  Time
                </Label>
                <Input
                  type="time"
                  id="end-time-picker"
                  step="1"
                  defaultValue="10:30:00"
                  className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            </div>
          </div>
          <Button
            onClick={handleTryToConnect}
            variant={'default'}
            className="mt-4 w-full"
          >
            <p className="text-sm">Set properties</p>
          </Button>
          <Toaster />
        </>
      )}
    </div>
  );
}
