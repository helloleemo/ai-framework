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
import { useArtboardNodes } from '@/hooks/use-artboard-state';

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

  // step
  const [step, setStep] = useState(1);

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // handle connect
  const handleConnect = () => {
    setLoading(true);
    createSpinner();
    //
    setTimeout(() => {
      setLoading(false);
      showSuccess('Connected successfully!');
      setStep(2);
    }, 1000);
  };

  const handleSetNode = () => {
    setLoading(true);
    createSpinner();
    updateNodeConfig(activeNode.id, {
      ...form.config,
      account: form.account,
      password: form.password,
      ip: form.ip,
      port: form.port,
      tags: form.tags,
      buffer: form.buffer,
      date: form.date,
    });
    setTimeout(() => {
      setLoading(false);
      showSuccess('Node updated successfully!');
      //
      setActiveNode(null);
      setNodeCompleted(activeNode.id, true);
    }, 2000);
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
              {/*  */}
              <Label className="pt-2 text-sm" htmlFor="port">
                Account
              </Label>
              <Input
                type="text"
                id="account"
                placeholder="account"
                value={form.account ?? ''}
                onChange={(e) => handleFormChange('account', e.target.value)}
              />
              {/*  */}
              <Label className="pt-2 text-sm" htmlFor="port">
                Password
              </Label>
              <Input
                type="text"
                id="password"
                placeholder="password"
                value={form.password ?? ''}
                onChange={(e) => handleFormChange('password', e.target.value)}
              />
              {/*  */}
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
              onClick={() => setStep(3)}
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
