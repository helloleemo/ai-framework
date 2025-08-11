import { StopIcon } from '@/components/icon/stop-icon';
import { PreBuildIcon } from '@/components/icon/pre-build-icon';
import { useState } from 'react';
import { DeployIcon } from './deploy-icon';

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

function applyTemplate(setNodes, setEdges) {
  setNodes([...template.nodes]);
  setEdges([...template.edges]);
}

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
        <div className="pre-build hover:bg-neutral-100 rounded-md flex items-center gap-2 p-2 bg-white border cursor-pointer">
          <div className="icon">
            <StopIcon className="w-5 h-5 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-600">Stop</p>
        </div>
      ) : (
        <div
          onClick={handleClickPreBuild}
          className="pre-build hover:bg-neutral-100 rounded-md flex items-center gap-2 p-2 bg-white border cursor-pointer"
        >
          <div className="icon">
            <PreBuildIcon className="w-5 h-5 text-neutral-600" />
          </div>
          <p className="text-sm text-neutral-600">Pre-build</p>
        </div>
      )}

      <div
        className={`
          ${afterBuild ? 'cursor-pointer hover:bg-neutral-100' : ''}
          pre-build  rounded-md flex items-center gap-2 p-2 bg-white border `}
      >
        <div className="icon">
          <DeployIcon
            className={`
            ${afterBuild ? 'text-neutral-600' : 'text-neutral-300'}
            w-5 h-5 `}
          />
        </div>
        <p
          className={`
            ${afterBuild ? 'text-neutral-600' : 'text-neutral-300'}
             text-sm`}
        >
          Deploy
        </p>
      </div>

      <div
        className="cursor-pointer hover:bg-neutral-100
          pre-build  rounded-md flex items-center gap-2 p-2 bg-white border"
      >
        <p
          className="text-neutral-600 text-sm"
          onClick={() => applyTemplate(setNodes, setEdges)}
        >
          template-mock01
        </p>
      </div>
    </div>
  );
}
