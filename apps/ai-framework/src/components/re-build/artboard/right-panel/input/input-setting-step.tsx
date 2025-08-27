import { useSpinner } from '@/hooks/use-spinner';
import { useToaster } from '@/hooks/use-toaster';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePipeline } from '@/hooks/use-context-pipeline';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChevronDownIcon } from 'lucide-react';
import { getInputAPI } from '@/api/input';

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

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

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
      console.log('res', res);
    } catch (error) {
      console.error(error);
      return;
    } finally {
      setLoading(false);
    }
  };

  // handle connect
  const handleConnect = () => {
    fetchData();
    showError('連線失敗！');

    // updateNodeConfig
    updateNodeConfig(activeNode.id, {
      ...form.config,
      ip: form.ip,
      port: form.port,
      client_id: form.client_id,
      client_secret: form.client_secret,
      grant_type: form.grant_type,
      account: form.account,
      password: form.password,
      // tags: form.tags,
      // buffer: form.buffer,
      // date: form.date,
    });
    setStep(2);
  };

  const handleTagChange = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, {
      tags: form.tags,
    });
    setLoading(false);
    setStep(3);
  };

  const handleSetNode = () => {
    setLoading(true);
    updateNodeConfig(activeNode.id, {
      ...form.config,
      // ip: form.ip,
      // port: form.port,
      // client_id: form.client_id,
      // client_secret: form.client_secret,
      // grant_type: form.grant_type,
      // account: form.account,
      // password: form.password,
      // tags: form.tags,
      buffer: form.buffer,
      date: form.date,
    });
    setLoading(false);
    showSuccess('設定成功！');
    //
    setActiveNode(null);
    setNodeCompleted(activeNode.id, true);
  };
  console.log('Updated node config:', getNode(activeNode.id));
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-full flex-col justify-between">
      {step === 1 && (
        <>
          <div className="form">
            <p className="text-sm font-bold text-neutral-800">
              Basic information
            </p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              {/* ip */}
              <Label className="pt-2 text-sm" htmlFor="ip">
                IP
              </Label>
              <Input
                type="text"
                id="ip"
                placeholder="IP"
                value={form.ip ?? ''}
                onChange={(e) => handleFormChange('ip', e.target.value)}
              />
              {/* port */}
              <Label className="pt-2 text-sm" htmlFor="port">
                Port
              </Label>
              <Input
                type="text"
                id="port"
                placeholder="port"
                value={form.port ?? ''}
                onChange={(e) => handleFormChange('port', e.target.value)}
              />
              {/* client id */}
              <Label className="pt-2 text-sm" htmlFor="client_id">
                Client ID
              </Label>
              <Input
                type="text"
                id="client_id"
                placeholder="client_id"
                value={form.client_id ?? ''}
                onChange={(e) => handleFormChange('client_id', e.target.value)}
              />
              {/* client secret */}
              <Label className="pt-2 text-sm" htmlFor="client_secret">
                Client Secret
              </Label>
              <Input
                type="text"
                id="client_secret"
                placeholder="client_secret"
                value={form.client_secret ?? ''}
                onChange={(e) =>
                  handleFormChange('client_secret', e.target.value)
                }
              />
              {/* grant type */}
              <Label className="pt-2 text-sm" htmlFor="grant_type">
                Grant Type
              </Label>
              <Input
                type="text"
                id="grant_type"
                placeholder="grant_type"
                value={form.grant_type ?? ''}
                onChange={(e) => handleFormChange('grant_type', e.target.value)}
              />

              {/* account */}
              <Label className="pt-2 text-sm" htmlFor="account">
                Account
              </Label>
              <Input
                type="text"
                id="account"
                placeholder="account"
                value={form.account ?? ''}
                onChange={(e) => handleFormChange('account', e.target.value)}
              />
              {/* password */}
              <Label className="pt-2 text-sm" htmlFor="password">
                Password
              </Label>
              <Input
                type="text"
                id="password"
                placeholder="password"
                value={form.password ?? ''}
                onChange={(e) => handleFormChange('password', e.target.value)}
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
          <div className="form">
            <p className="text-sm font-bold text-neutral-800">Select tags</p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              <Label className="text-sm" htmlFor="tags">
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
      {step === 3 && (
        <>
          <div className="form">
            <p className="text-sm font-bold text-neutral-800">Setting</p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2">
              <div className="flex w-full gap-2">
                <div className="flex w-full flex-col">
                  <Label htmlFor="date-picker" className="px-1">
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
                          ? form.date.toLocaleDateString()
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
                <div className="flex w-full flex-col">
                  <Label htmlFor="time-picker" className="px-1">
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
            </div>
            <div className="pt-4">
              <Label htmlFor="buffer" className="mt- mx-1">
                Buffer(毫秒)
              </Label>
              <Input
                type="number"
                id="buffer"
                placeholder="Buffer time (秒)"
                className="mt-1"
                value={form.buffer ?? ''}
                onChange={(e) =>
                  handleFormChange('buffer', Number(e.target.value) || 0)
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
  );
}
