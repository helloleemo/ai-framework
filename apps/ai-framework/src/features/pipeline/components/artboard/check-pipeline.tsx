export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  details: {
    isolatedNodes: any[];
    pipelineComponents: any[][];
    incompleteNodes: string[];
    // inputNodes: any[];
    // outputNodes: any[];
  };
}

/**
 * Check pipeline
 */
function checkPipelineFunction(
  pipelineConfig: any,
  getNodeCompleted: any,
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  //
  if (!pipelineConfig || !pipelineConfig.tasks.length) {
    console.log('Pipeline is empty');
    return {
      isValid: false,
      errors: ['Pipeline is empty'],
      warnings: [],
      details: {
        isolatedNodes: [],
        pipelineComponents: [],
        incompleteNodes: [],
        // inputNodes: [],
        // outputNodes: [],
      },
    };
  }

  // 1. Contains input and output nodes
  const inputOutputResult = containsOutputAndInput(pipelineConfig);
  if (!inputOutputResult.isValid) {
    errors.push(...inputOutputResult.errors);
  }

  // 2. Check completed nodes
  const completedResult = checkCompletedNodes(pipelineConfig, getNodeCompleted);
  if (completedResult.incompleteNodes.length > 0) {
    errors.push(
      `Incomplete nodes: ${completedResult.incompleteNodes.join(', ')}`,
    );
  }

  // 3. Check isolated nodes
  const isolatedNodes = findIsolatedNodes(pipelineConfig.tasks);
  if (isolatedNodes.length > 0) {
    errors.push(
      `Found ${isolatedNodes.length} isolated nodes: ${isolatedNodes.map((n) => n.task_id).join(', ')}`,
    );
    isolatedNodes.forEach((node) => {
      console.log(
        'Isolated node found:',
        node.task_id,
        'stage:',
        node.processor_stage,
      );
    });
  }

  // 4. Check connected components
  const pipelineComponents = findConnectedComponents(pipelineConfig.tasks);
  if (pipelineComponents.length > 1) {
    errors.push(
      `Found ${pipelineComponents.length} separate pipelines. Only one continuous pipeline is allowed.`,
    );
    console.log('Found multiple separate pipelines:');
    pipelineComponents.forEach((component, index) => {
      console.log(
        `Pipeline ${index + 1}:`,
        component.map((task) => task.task_id),
      );
    });
  }

  // 不只一個輸入輸出
  // const inputNodes = pipelineConfig.tasks.filter(
  //   (task: any) =>
  //     task.processor_stage === 'input' &&
  //     (!task.dependencies || task.dependencies.length === 0),
  // );
  // const outputNodes = pipelineConfig.tasks.filter(
  //   (task: any) => task.processor_stage === 'output',
  // );

  // if (inputNodes.length > 1) {
  //   warnings.push(
  //     `Found ${inputNodes.length} input nodes. Consider having only one main input.`,
  //   );
  // }

  // if (outputNodes.length > 1) {
  //   warnings.push(
  //     `Found ${outputNodes.length} output nodes. Consider having only one main output.`,
  //   );
  // }

  //
  logPipelineAnalysis(pipelineConfig);

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    details: {
      isolatedNodes,
      pipelineComponents,
      incompleteNodes: completedResult.incompleteNodes,
      // inputNodes,
      // outputNodes,
    },
  };
}

/**
 * Contains at least one input and one output node
 */
function containsOutputAndInput(pipelineConfig: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const hasInput = pipelineConfig.tasks.some((task: any) => {
    return (
      task.processor_stage === 'input' &&
      (!task.dependencies || task.dependencies.length === 0)
    );
  });

  const hasOutput = pipelineConfig.tasks.some((task: any) => {
    return (
      task.processor_stage === 'output' &&
      task.dependencies &&
      task.dependencies.length > 0
    );
  });

  if (!hasInput) {
    errors.push('Pipeline must contain at least one input node');
  }

  if (!hasOutput) {
    errors.push('Pipeline must contain at least one connected output node');
  }

  return {
    isValid: hasInput && hasOutput,
    errors,
  };
}

/**
 * Check if all nodes are completed
 */
function checkCompletedNodes(
  pipelineConfig: any,
  getNodeCompleted: any,
): {
  allCompleted: boolean;
  incompleteNodes: string[];
} {
  const incompleteNodes: string[] = [];

  pipelineConfig.tasks.forEach((task: any) => {
    const isCompleted = getNodeCompleted(task.task_id);
    if (!isCompleted) {
      incompleteNodes.push(task.task_id);
    }
  });

  if (incompleteNodes.length > 0) {
    console.log('Nodes not completed:', incompleteNodes);
  }

  return {
    allCompleted: incompleteNodes.length === 0,
    incompleteNodes,
  };
}

/**
 * isolated nodes
 */
function findConnectedComponents(tasks: any[]) {
  const visited = new Set<string>();
  const components: any[][] = [];

  //
  const adjacencyList = new Map<string, Set<string>>();

  tasks.forEach((task) => {
    adjacencyList.set(task.task_id, new Set());
  });

  tasks.forEach((task) => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId: string) => {
        adjacencyList.get(task.task_id)?.add(depId);
        adjacencyList.get(depId)?.add(task.task_id);
      });
    }
  });

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

  tasks.forEach((task) => {
    if (!visited.has(task.task_id)) {
      const component: any[] = [];
      dfs(task.task_id, component);
      components.push(component);
    }
  });

  return components;
}

/**
 * isolated nodes
 */
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
    let reason = '';

    switch (stage) {
      case 'input':
        if (!hasOutputs) {
          isIsolated = true;
          reason = 'Input node has no output connections';
        }
        break;
      case 'output':
        if (!hasInputs) {
          isIsolated = true;
          reason = 'Output node has no input connections';
        }
        break;
      case 'transform':
      default:
        if (!hasInputs && !hasOutputs) {
          isIsolated = true;
          reason = 'Transform node has no connections at all';
        } else if (!hasInputs) {
          isIsolated = true;
          reason = 'Transform node has no input connections';
        } else if (!hasOutputs) {
          isIsolated = true;
          reason = 'Transform node has no output connections';
        }
        break;
    }

    if (isIsolated) {
      isolatedNodes.push({
        ...task,
        reason,
      });
    }
  });

  return isolatedNodes;
}

/**
 * log analysis
 */
function logPipelineAnalysis(pipelineConfig: any) {
  const allNodes = new Set(
    pipelineConfig.tasks.map((task: any) => task.task_id),
  );
  const nodesWithInputs = new Set();
  const nodesWithOutputs = new Set();

  pipelineConfig.tasks.forEach((task: any) => {
    if (task.dependencies && task.dependencies.length > 0) {
      nodesWithInputs.add(task.task_id);
      task.dependencies.forEach((depId: any) => {
        nodesWithOutputs.add(depId);
      });
    }
  });

  console.log('Pipeline Analysis:');
  console.log('All nodes:', Array.from(allNodes));
  console.log('Nodes with inputs:', Array.from(nodesWithInputs));
  console.log('Nodes with outputs:', Array.from(nodesWithOutputs));
}

export default checkPipelineFunction;
export {
  containsOutputAndInput,
  checkCompletedNodes,
  findConnectedComponents,
  findIsolatedNodes,
};
