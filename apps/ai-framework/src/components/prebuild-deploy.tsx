import { StopIcon } from '@/components/icon/stop-icon';
import { PreBuildIcon } from '@/components/icon/pre-build-icon';
import { useEffect, useState } from 'react';
import { DeployIcon } from './deploy-icon';
import { usePipeline } from '@/hooks/use-context-pipeline';
import { useToaster } from '@/hooks/use-toaster';
import { Button } from './ui/button';
import { createDagAPI, pipelineTokenTaker } from '@/api/pipeline';

function checkPipeline(nodes: any[], edges: any[]) {
  // 1. Check all nodes are connected
  if (nodes.length === 0) {
    return { valid: false, reason: 'No nodes in the pipeline' };
  }
  const nodeIds = nodes.map((n) => n.id);
  const connectedNodeIds = new Set();
  edges.forEach((e) => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });
  const isolatedNodes = nodeIds.filter((id) => !connectedNodeIds.has(id));
  if (isolatedNodes.length > 0) {
    return {
      valid: false,
      reason: 'Isolated node(s) detected',
      nodes: isolatedNodes,
    };
  }

  // 2. Check for cycles in the pipeline
  const graph: Record<string, string[]> = {};
  nodeIds.forEach((id) => (graph[id] = []));
  edges.forEach((e) => {
    graph[e.source].push(e.target);
  });
  const visited = new Set<string>();
  const recStack = new Set<string>();
  function hasCycle(node: string): boolean {
    if (!visited.has(node)) {
      visited.add(node);
      recStack.add(node);
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor) && hasCycle(neighbor)) return true;
        else if (recStack.has(neighbor)) return true;
      }
    }
    recStack.delete(node);
    return false;
  }
  for (const id of nodeIds) {
    if (hasCycle(id)) {
      return { valid: false, reason: 'Cycle detected in pipeline' };
    }
  }

  // 3. Check if input parameter "success" is present and true
  const inputNode = nodes.find((n) => n.type === 'input');
  if (!inputNode || !inputNode.params || inputNode.params.success !== true) {
    return { valid: false, reason: 'Input parameter "success" is not true' };
  }

  return { valid: true };
}
const template = {
  name: 'template-mock01',
  description: 'This is a mock template for testing',
  nodes: [
    {
      id: '1',
      type: 'input',
      params: {
        success: true,
      },
    },
    {
      id: '2',
      type: 'transform',
      params: {},
    },
    {
      id: '3',
      type: 'output',
      params: {},
    },
  ],
  edges: [
    { source: '1', target: '2' },
    { source: '2', target: '3' },
  ],
};

/**
 *
export default function PrebuildDeploy({
  nodes,
  edges,
}: {
  nodes: any[];
  edges: any[];
}) {
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [afterBuild, setAfterBuild] = useState<boolean>(false);

  const handleClickPreBuild = () => {
    setIsBuilding(true);
    console.log('Pipeline nodes:', nodes);
    console.log('Pipeline edges:', edges);
    setTimeout(() => {
      checkPipeline(nodes, edges);
      console.log('Pre-build completed');
      setIsBuilding(false);
      setAfterBuild(true);
    }, 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {isBuilding ? (
        <div className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100">
          <div className="icon">
            <StopIcon className="h-5 w-5 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-600">Stop</p>
        </div>
      ) : (
        <div
          onClick={handleClickPreBuild}
          className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100"
        >
          <div className="icon">
            <PreBuildIcon className="h-5 w-5 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-600">Pre-run</p>
        </div>
      )}

      <div
        className={` ${afterBuild ? 'cursor-pointer hover:bg-neutral-100' : ''} pre-build flex items-center gap-2 rounded-md border bg-white p-2`}
      >
        <div className="icon">
          <DeployIcon
            className={` ${afterBuild ? 'text-neutral-600' : 'text-neutral-300'} h-5 w-5`}
          />
        </div>
        <p
          className={` ${afterBuild ? 'text-neutral-600' : 'text-neutral-300'} text-sm`}
        >
          Deploy
        </p>
      </div>

      <div className="pre-build flex cursor-pointer items-center gap-2 rounded-md border bg-white p-2 hover:bg-neutral-100"></div>
    </div>
  );
}
 */
// import React, { useState } from 'react';
// import { usePipeline } from '@/hooks/use-context-pipeline';
// import { deployPipelineAPI } from '@/api/pipeline';
// import { Button } from '@/components/ui/button';
// import { showSuccess, showError } from '@/hooks/use-toaster';

export default function PipelineDeploy() {
  useEffect(() => {
    pipelineTokenTaker();
  }, []);
  const { buildPipelineConfig } = usePipeline();
  const [isDeploying, setIsDeploying] = useState(false);
  const { showSuccess, showError } = useToaster();

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

  const handlePreview = () => {
    const pipelineConfig = buildPipelineConfig();

    // console.log('Pipeline Config:', JSON.stringify(pipelineConfig, null, 2));
    // 可以顯示在 dialog 中
    // alert('Pipeline config logged to console');
  };

  const handlePreRun = () => {
    const pipelineConfig = buildPipelineConfig();
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handlePreview} disabled={isDeploying}>
        Preview Pipeline
      </Button>
      <Button variant="outline" onClick={handleDeploy} disabled={isDeploying}>
        Deploy Pipeline
      </Button>
      {/* <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className="bg-blue-500 hover:bg-blue-600"
      >
        {isDeploying ? 'Deploying...' : 'Deploy Pipeline'}
      </Button> */}
    </div>
  );
}
