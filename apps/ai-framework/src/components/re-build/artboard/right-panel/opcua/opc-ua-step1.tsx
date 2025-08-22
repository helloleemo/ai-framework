import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';

type Step1Props = {
  activeNode: any;
  form: any;
  handleInput: (field: string, value: string) => void;
  loading: boolean;
  Spinner: React.ReactNode;
  onConnect: () => void;
};

export default function Step1({
  activeNode,
  form,
  handleInput,
  loading,
  Spinner,
  onConnect,
}: Step1Props) {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="form">
        <p className="text-sm font-bold text-neutral-800">Basic information</p>
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
            value={form.connectionString}
          />
          <Label className="pt-2 text-sm" htmlFor="account">
            Account
          </Label>
          <Input
            onInput={(e) => handleInput('account', e.currentTarget.value)}
            type="text"
            id="account"
            placeholder="account"
            value={form.account}
          />
          <Label className="pt-2 text-sm" htmlFor="password">
            Password
          </Label>
          <Input
            onInput={(e) => handleInput('password', e.currentTarget.value)}
            type="text"
            id="password"
            placeholder="password"
            value={form.password}
          />
        </div>
      </div>

      <Button
        onClick={onConnect}
        variant={'default'}
        className={`mt-4 flex w-full items-center justify-center gap-2 ${loading ? 'cursor-default' : ''}`}
        disabled={loading}
      >
        {loading ? Spinner : 'Connect'}
      </Button>
    </div>
  );
}
