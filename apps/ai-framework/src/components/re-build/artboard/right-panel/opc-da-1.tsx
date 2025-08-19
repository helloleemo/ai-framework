import { connectOpcdaAPI } from '@/api/opcda';
// import { connectOpcuaAPI } from '@/api/opcua';
import { DashboardIcon } from '@/components/icon/dashboard-icon';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { useSpinner } from '@/hooks/use-spinner';
// import { Label } from '@radix-ui/react-label';
import { useState } from 'react';

export default function OPCDA1({ activeNode }: { activeNode: any }) {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { loading, setLoading, Spinner } = useSpinner();
  const [step, setStep] = useState(1);

  // step1
  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await connectOpcdaAPI();
      setLoading(false);
      console.log('Connection response:', res);
      if (res.success) {
        setStep(2);
        //
        // getTagsAPI(form.connectionString, form.account, form.password).then(
        //   (res) => {
        //     console.log('Get tags response:', res);
        //     setTagsData(res.data);
        //     // popup
        //   },
        // );
      }
    } catch (err) {
      console.error('Connection error:', err);
      setLoading(false);
      // setStep(2);
    }
  };
  return (
    <div>
      {step === 1 && (
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
            <p className="text-sm font-bold text-neutral-800">
              {/* Basic information */}
            </p>
            <div className="grid w-full max-w-sm items-center gap-1 pt-2"></div>
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
    </div>
  );
}
