import { StopIcon } from '@/components/icon/stop-icon';
import { PreBuildIcon } from '@/components/icon/pre-build-icon';
import { useEffect, useState } from 'react';
import { DeployIcon } from '@/components/icon/deploy-icon';
import { usePipeline } from '@/hooks/use-pipeline/use-context-pipeline';
import { useToaster } from '@/hooks/use-toaster';
import { createDagAPI, pipelineTokenTaker } from '@/api/pipeline';

function checkPipeline(pipelineConfig: any, getNodeCompleted: any) {
  // check if empty
  if (!pipelineConfig || !pipelineConfig.tasks.length) {
    console.log('Pipeline is empty');
    return false;
  }

  // check contains at least a input and a output, then they are on connect
  const hasInput = pipelineConfig.tasks.some((task: any) => {
    return task.processor_stage === 'input' && task.dependencies.length === 0;
  });
  const hasOutput = pipelineConfig.tasks.some((task: any) => {
    return task.processor_stage === 'output' && task.dependencies.length > 0;
  });

  if (!hasInput || !hasOutput) {
    console.log(
      'Pipeline must contain at least an input and an output or they are not connected',
    );
  }

  // check if any node is not completed
  pipelineConfig.tasks.forEach((task: any) => {
    if (getNodeCompleted(task.task_id)) {
      console.log('Node completed:', task.task_id);
    } else {
      console.log('Node not completed:', task.task_id);
    }
  });

  // if any isolated node
  const allNodes = new Set(
    pipelineConfig.tasks.map((task: any) => task.task_id),
  );
  const nodesWithInputs = new Set();
  pipelineConfig.tasks.forEach((task: any) => {
    if (task.dependencies && task.dependencies.length > 0) {
      nodesWithInputs.add(task.task_id);
    }
  });
  const nodesWithOutputs = new Set();
  pipelineConfig.tasks.forEach((task: any) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId: any) => {
        nodesWithOutputs.add(depId);
      });
    }
  });
  console.log('All nodes:', Array.from(allNodes));
  console.log('Nodes with inputs:', Array.from(nodesWithInputs));
  console.log('Nodes with outputs:', Array.from(nodesWithOutputs));
  if (allNodes.size !== nodesWithInputs.size + nodesWithOutputs.size) {
    console.log('There are isolated nodes in the pipeline');
  }

  // Can only a single pipeline
  const pipelineComponents = findConnectedComponents(pipelineConfig.tasks);
  if (pipelineComponents.length > 1) {
    console.log('Found multiple separate pipelines:');
    pipelineComponents.forEach((component, index) => {
      console.log(
        `Pipeline ${index + 1}:`,
        component.map((task) => task.task_id),
      );
    });
    console.log(
      `Found ${pipelineComponents.length} separate pipelines. Only one continuous pipeline is allowed.`,
    );
  }

  // 檢查是否有多個起始點或終點
  const inputNodes = pipelineConfig.tasks.filter(
    (task: any) =>
      task.processor_stage === 'input' &&
      (!task.dependencies || task.dependencies.length === 0),
  );
  const outputNodes = pipelineConfig.tasks.filter(
    (task: any) => task.processor_stage === 'output',
  );

  if (inputNodes.length > 1) {
    console.log(
      `Found ${inputNodes.length} input nodes. Consider having only one main input.`,
    );
  }

  if (outputNodes.length > 1) {
    console.log(
      `Found ${outputNodes.length} output nodes. Consider having only one main output.`,
    );
  }
}
function findIsolatedNodes(tasks: any[]) {
  const isolatedNodes: any[] = [];

  const nodesWithInputs = new Set();
  const nodesWithOutputs = new Set();

  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      nodesWithInputs.add(task.task_id);
      task.dependencies.forEach((depId: string) => {
        nodesWithOutputs.add(depId);
      });
    }
  });

  tasks.forEach((task) => {
    const taskId = task.task_id;
    const stage = task.processor_stage;

    const hasInputs = nodesWithInputs.has(taskId);
    const hasOutputs = nodesWithOutputs.has(taskId);

    let isIsolated = false;

    if (stage === 'input') {
      isIsolated = !hasOutputs;
    } else if (stage === 'output') {
      isIsolated = !hasInputs;
    } else {
      isIsolated = !hasInputs || !hasOutputs;
    }

    if (isIsolated) {
      isolatedNodes.push(task);
    }
  });

  return isolatedNodes;
}
function findConnectedComponents(tasks: any[]) {
  const visited = new Set<string>();
  const components: any[][] = [];

  // 建立鄰接表（雙向圖）
  const adjacencyList = new Map<string, Set<string>>();

  // 初始化所有節點
  tasks.forEach((task) => {
    adjacencyList.set(task.task_id, new Set());
  });

  // 建立連接關係（雙向）
  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId: string) => {
        // 雙向連接
        adjacencyList.get(task.task_id)?.add(depId);
        adjacencyList.get(depId)?.add(task.task_id);
      });
    }
  });

  // DFS 找出連通分量
  function dfs(nodeId: string, currentComponent: any[]) {
    visited.add(nodeId);
    const task = tasks.find((t) => t.task_id === nodeId);
    if (task) {
      currentComponent.push(task);
    }

    const neighbors = adjacencyList.get(nodeId) || new Set();
    neighbors.forEach((neighborId) => {
      if (!visited.has(neighborId)) {
        dfs(neighborId, currentComponent);
      }
    });
  }

  // 對每個未訪問的節點執行DFS
  tasks.forEach((task) => {
    if (!visited.has(task.task_id)) {
      const component: any[] = [];
      dfs(task.task_id, component);
      components.push(component);
    }
  });

  return components;
}

export default function PrebuildDeploy() {
  useEffect(() => {
    pipelineTokenTaker();
  }, []);

  const [pass, setPass] = useState(false);
  const { buildPipelineConfig, getNodeCompleted } = usePipeline();
  const { showSuccess, showError } = useToaster();

  const handlePreRun = () => {
    const pipelineConfig = buildPipelineConfig();
    console.log('Pipeline Config:', pipelineConfig);
    checkPipeline(pipelineConfig, getNodeCompleted);
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

      <div className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100">
        <p>咦</p>
      </div>
    </div>
  );
}
