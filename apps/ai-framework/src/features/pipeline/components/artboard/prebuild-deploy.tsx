import { StopIcon } from '@/shared/ui/icon/stop-icon';
import { PreBuildIcon } from '@/shared/ui/icon/pre-build-icon';
import { useEffect, useState } from 'react';
import { DeployIcon } from '@/shared/ui/icon/deploy-icon';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useToaster } from '@/shared/hooks/use-toaster';
import {
  createDagAPI,
  getDagDataAPI,
  pipelineTokenTaker,
  UpdatateDagAPI,
} from '@/features/pipeline/api/pipeline';
import checkPipelineFunction from './check-pipeline';

export default function PrebuildDeploy() {
  useEffect(() => {
    pipelineTokenTaker();
  }, []);

  const { buildPipelineConfig, getNodeCompleted, loadFromAPIResponse } =
    usePipeline();
  const { showSuccess, showError } = useToaster();

  const handlePreRun = () => {
    const pipelineConfig = buildPipelineConfig();
    console.log('Pipeline Config:', pipelineConfig);
    const result = checkPipelineFunction(pipelineConfig, getNodeCompleted);

    if (result.isValid) {
      showSuccess('成功！');
    } else {
      showError(`${result.errors}`);
      console.log('Pipeline has errors:', result.errors);
      console.log('Pipeline warnings:', result.warnings);
    }
  };

  const handleDeploy = async () => {
    const pipelineConfig = buildPipelineConfig();
    try {
      const res = await createDagAPI(pipelineConfig);
      console.log('Pipeline created successfully:', res);
      showSuccess('Pipeline created successfully');
    } catch (error) {
      console.error('Error creating pipeline:', error);
      showError('Error creating pipeline: ' + error);
    }
  };

  const [dagId, setDagId] = useState('1');
  const handleGetDag = async () => {
    try {
      const res = await getDagDataAPI(dagId);
      console.log('Get Dag data successfully:', res);
      if (res.success) {
        loadFromAPIResponse(res);
        showSuccess('Get Dag data successfully');
      } else {
        showError('Get Dag data failed: ' + res.message);
      }
    } catch (error) {
      console.error('Error getting Dag data:', error);
      showError('Error getting Dag data: ' + error);
    }
  };

  const handleUpdateDag = async () => {
    const pipelineConfig = buildPipelineConfig();
    try {
      const res = await UpdatateDagAPI(dagId, pipelineConfig);
      if (res.success) {
        console.log('Get Dag data successfully:', res);
        showSuccess('Get Dag data successfully');
      } else {
        showError('Get Dag data failed: ' + res.message);
      }
    } catch (error) {
      console.error('Error getting Dag data:', error);
      showError('Error getting Dag data: ' + error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div
        onClick={handlePreRun}
        className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100"
      >
        <div className="icon">
          <PreBuildIcon className="h-5 w-5 text-neutral-600" />
        </div>
        <p className="text-sm text-neutral-600">Pre-run</p>
      </div>
      <div
        onClick={handleDeploy}
        className={`pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100`}
      >
        <div className="icon">
          <DeployIcon className={`h-5 w-5 text-neutral-600`} />
        </div>
        <p className={`text-sm text-neutral-600`}>Deploy</p>
      </div>
      {/*  */}
      <div className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100">
        <p className="text-sm">Get</p>
        <input
          onInput={(e) => setDagId((e.currentTarget as HTMLInputElement).value)}
          type="text"
          className="rounded-sm border"
        />
        <button onClick={handleGetDag} className="border text-sm">
          Get
        </button>
        <button onClick={handleUpdateDag} className="border text-sm">
          Update
        </button>
      </div>
    </div>
  );
}
