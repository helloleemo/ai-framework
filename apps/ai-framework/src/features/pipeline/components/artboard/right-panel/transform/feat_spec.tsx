import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useEffect, useState } from 'react';
import TopTitle from '../top-title';
import { Button } from '@/shared/ui/button';
import { useToaster } from '@/shared/hooks/use-toaster';
import { useSpinner } from '@/shared/hooks/use-spinner';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

type BearingConfig = {
  BPFO?: number;
  BPFI?: number;
  BSF?: number;
  FTF?: number;
};

type NodeConfig = {
  fs?: number;
  rpm?: number;
  Bearing?: BearingConfig;
  alias?: string;
};

export default function FeatSpec({ activeNode }: { activeNode: any }) {
  const { getNode, updateNodeConfig, setActiveNode, setNodeCompleted } =
    usePipeline();
  // ui
  const { loading, setLoading, Spinner, createSpinner } = useSpinner();
  const { showSuccess, showError } = useToaster();
  const [errorMsg, setErrorMsg] = useState('');

  // setForm
  const handleFormChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  // step
  const [step, setStep] = useState(3);
  const totalSteps = 3;
  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  // form state
  const node = activeNode ? getNode(activeNode.id) : undefined;
  const [form, setForm] = useState<{
    fs: number;
    rpm: number;
    bpfo: number | '';
    bpfi: number | '';
    bsf: number | '';
    ftf: number | '';
    alias: string;
  }>(() => ({
    fs: 0,
    rpm: 0,
    bpfo: '',
    bpfi: '',
    bsf: '',
    ftf: '',
    alias: '',
  }));

  useEffect(() => {
    if (node?.config) {
      const config = node.config as NodeConfig;
      setForm({
        fs: config.fs || 0,
        rpm: config.rpm || 0,
        bpfo: config.Bearing?.BPFO || '',
        bpfi: config.Bearing?.BPFI || '',
        bsf: config.Bearing?.BSF || '',
        ftf: config.Bearing?.FTF || '',
        alias: config.alias || '',
      });
    } else {
      setForm({
        fs: 0,
        rpm: 0,
        bpfo: '',
        bpfi: '',
        bsf: '',
        ftf: '',
        alias: '',
      });
    }
  }, [activeNode, node]);

  // handler
  const handleConnect = () => {
    setLoading(true);

    //
    const configToSave = {
      fs: Number(form.fs) || 0,
      rpm: Number(form.rpm) || 0,
      Bearing: {
        BPFO: form.bpfo ? Number(form.bpfo) : undefined,
        BPFI: form.bpfi ? Number(form.bpfi) : undefined,
        BSF: form.bsf ? Number(form.bsf) : undefined,
        FTF: form.ftf ? Number(form.ftf) : undefined,
      },
      alias: String(form.alias) || '',
    };
    updateNodeConfig(activeNode.id, configToSave);

    if (form.fs <= 0 || form.rpm <= 0) {
      setErrorMsg('採樣頻率(Hz)、轉速 (RPM) 必須大於0');
      setLoading(false);
      return;
    }

    const bearingValues = [form.bpfo, form.bpfi, form.bsf, form.ftf];
    const hasAnyBearing = bearingValues.some((val) => val !== '');
    const hasAllBearing = bearingValues.every((val) => val !== '');

    if (hasAnyBearing && !hasAllBearing) {
      setErrorMsg('請填寫完整的軸承缺陷頻率字典，或全部留空');
      setLoading(false);
      return;
    }
    //
    showSuccess('設定成功！');
    setNodeCompleted(activeNode.id, true);
    setLoading(false);
    console.log('form', form);
    setActiveNode(null);
  };

  return (
    <>
      <TopTitle title={activeNode.name} description={activeNode.description} />
      <div className="step flex items-center gap-2">
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
      <div className="mb-4 h-[calc(100vh-280px)]">
        {/*  */}
        <div className="flex h-full flex-col justify-between">
          {step === 1 && (
            <>
              <div className="form">
                {/*  */}
                <p className="text-sm font-bold text-neutral-800">
                  Basic information
                </p>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="alias">
                    別名
                  </Label>
                  <Input
                    type="text"
                    id="alias"
                    placeholder="alias"
                    value={form.alias ? form.alias : ''}
                    onChange={(e) => handleFormChange('alias', e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="fs">
                    採樣頻率 (Hz)
                  </Label>
                  <Input
                    type="number"
                    id="fs"
                    placeholder="fs"
                    value={form.fs ? form.fs : ''}
                    onChange={(e) => handleFormChange('fs', e.target.value)}
                  />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1 pt-2">
                  <Label className="text-sm" htmlFor="rpm">
                    轉速 (RPM)
                  </Label>
                  <Input
                    type="number"
                    id="rpm"
                    placeholder="rpm"
                    value={form.rpm ? form.rpm : ''}
                    onChange={(e) => handleFormChange('rpm', e.target.value)}
                  />
                </div>
                <div className="grid max-w-sm grid-cols-4 items-center gap-2 pt-2">
                  <Label className="col-span-4 text-sm" htmlFor="rpm">
                    軸承缺陷頻率字典 (選填)
                  </Label>
                  <Label className="text-sm" htmlFor="bpfo">
                    BPFO
                  </Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    id="bpfo"
                    placeholder="bpfo"
                    value={form.bpfo ? form.bpfo : ''}
                    onChange={(e) => handleFormChange('bpfo', e.target.value)}
                  />
                  <Label className="text-sm" htmlFor="bpfi">
                    BPFI
                  </Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    id="bpfi"
                    placeholder="bpfi"
                    value={form.bpfi ? form.bpfi : ''}
                    onChange={(e) => handleFormChange('bpfi', e.target.value)}
                  />{' '}
                  <Label className="text-sm" htmlFor="bsf">
                    BSF
                  </Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    id="bsf"
                    placeholder="bsf"
                    value={form.bsf ? form.bsf : ''}
                    onChange={(e) => handleFormChange('bsf', e.target.value)}
                  />{' '}
                  <Label className="text-sm" htmlFor="ftf">
                    FTF
                  </Label>
                  <Input
                    className="col-span-3"
                    type="number"
                    id="ftf"
                    placeholder="ftf"
                    value={form.ftf ? form.ftf : ''}
                    onChange={(e) => handleFormChange('ftf', e.target.value)}
                  />
                </div>
                <p className="p-2 text-sm text-red-500">{errorMsg}</p>
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
