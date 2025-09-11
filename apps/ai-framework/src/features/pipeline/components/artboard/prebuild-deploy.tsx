import { StopIcon } from '@/shared/ui/icon/stop-icon';
import { PreBuildIcon } from '@/shared/ui/icon/pre-build-icon';
import { useEffect, useState } from 'react';
import { DeployIcon } from '@/shared/ui/icon/deploy-icon';
import { usePipeline } from '@/features/pipeline/hooks/use-context-pipeline';
import { useToaster } from '@/shared/hooks/use-toaster';
import {
  createDagAPI,
  getDagDataAPI,
  getDagTemplateAPI,
  pipelineTokenTaker,
  UpdatateDagAPI,
} from '@/features/pipeline/api/pipeline';
import checkPipelineFunction, { sequenceCheck } from './check-pipeline';
import { TemplateIcon } from '@/shared/ui/icon/template-icon';
import { useEditMode } from './artboard';
import { usePipelineState } from '../../hooks/use-pipeline-state';
import { useNavigate } from 'react-router-dom';

export default function PrebuildDeploy() {
  const [createdDagId, setCreatedDagId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    pipelineTokenTaker();
  }, []);

  const {
    buildPipelineConfig,
    getNodeCompleted,
    loadFromAPIResponse,
    loadFromDAG,
    clearCanvas,
  } = usePipeline();
  const { showSuccess, showError } = useToaster();
  const { isEditMode, currentDagId } = useEditMode();

  const handlePreRun = () => {
    const pipelineConfig = buildPipelineConfig();
    console.log('Pipeline Config:', pipelineConfig);
    const result = checkPipelineFunction(pipelineConfig, getNodeCompleted);

    const currnetTaskProcessorMethod = 'pdm_features.feat_spec';
    const dependencyTaskProcessorMethod = 'pdm_freq.fft';
    const sequenceResult = sequenceCheck(
      pipelineConfig,
      currnetTaskProcessorMethod,
      dependencyTaskProcessorMethod,
    );
    console.log('Sequence Check Result:', sequenceResult);

    if (result.isValid && sequenceResult) {
      showSuccess('成功！');
    } else {
      if (!sequenceResult) {
        showError(
          `${currnetTaskProcessorMethod} 必須在 ${dependencyTaskProcessorMethod} 之後`,
        );
      }
      showError(`${result.errors}`);
      console.log('Pipeline has errors:', result.errors);
      console.log('Pipeline warnings:', result.warnings);
    }
  };

  const handleSave = async () => {
    console.log('Edit mode:', isEditMode);
    console.log('Current DAG ID:', currentDagId);

    try {
      if (isEditMode && currentDagId) {
        // Edit
        console.log('Updating existing DAG:', currentDagId);
        const pipelineConfig = buildPipelineConfig();
        //
        pipelineConfig.dag_id = currentDagId;
        console.log('Update payload:', pipelineConfig);
        const res = await UpdatateDagAPI(currentDagId, pipelineConfig);
        if (res.success) {
          console.log('Pipeline updated successfully:', res);
          showSuccess('Pipeline 更新成功');
        } else {
          showError('Pipeline 更新失敗: ' + res.message);
        }
      } else {
        // New
        console.log('Creating new DAG');
        const pipelineConfig = buildPipelineConfig();
        console.log('Create payload:', pipelineConfig);
        const res = await createDagAPI(pipelineConfig);
        console.log('Pipeline created successfully:', res);
        showSuccess('Pipeline 創建成功');
      }
    } catch (error) {
      console.error('Error saving pipeline:', error);
      if (isEditMode) {
        showError('更新 Pipeline 失敗: ' + error);
      } else {
        showError('創建 Pipeline 失敗: ' + error);
      }
    }
  };

  const handleCreate = () => {
    if (isEditMode || createdDagId) {
      const comfirmClear = window.confirm(
        '目前畫布上的內容將會被清空，確定要建立新畫布嗎？',
      );
      if (comfirmClear) {
        navigate('/ai-framework/artboard');
        clearCanvas();
        setCreatedDagId(null);
        showSuccess('畫布已清空！');
      }
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
        onClick={handleSave}
        className={`pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100`}
      >
        <div className="icon">
          <DeployIcon className={`h-5 w-5 text-neutral-600`} />
        </div>
        <p className={`text-sm text-neutral-600`}>
          {(isEditMode && currentDagId) || createdDagId ? 'Update' : 'Save'}
        </p>
      </div>
    </div>
  );
}
