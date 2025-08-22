import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Step {
  id: string;
  config: any;
}
export interface Node {
  id: string;
  steps: Step[];
  config: any;
}
export interface Pipeline {
  id: string;
  nodes: Node[];
  config: any;
}
export interface PipelineState {
  pipelines: Pipeline[];
  loading: boolean;
  error: string | null;
}

const initialState: PipelineState = {
  pipelines: [],
  loading: false,
  error: null,
};

// 範例 async thunk: 取得 pipeline from DAG API
export const fetchPipelineFromDagApi = createAsyncThunk(
  'pipeline/fetchPipelineFromDagApi',
  async (dagId: string) => {
    //
    // const response = await getDagTemplate(dagId);
    // return response;
    return { id: dagId, nodes: [], config: {} };
  },
);

export const pipelineSlice = createSlice({
  name: 'pipeline',
  initialState,
  reducers: {
    addPipeline(state, action: PayloadAction<Pipeline>) {
      state.pipelines.push(action.payload);
    },
    removePipeline(state, action: PayloadAction<string>) {
      state.pipelines = state.pipelines.filter((p) => p.id !== action.payload);
    },
    setPipeline(state, action: PayloadAction<Pipeline[]>) {
      state.pipelines = action.payload;
    },
    addNode(state, action: PayloadAction<{ pipelineId: string; node: Node }>) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      if (pipeline) pipeline.nodes.push(action.payload.node);
    },
    updateNode(
      state,
      action: PayloadAction<{ pipelineId: string; node: Node }>,
    ) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      if (pipeline) {
        const idx = pipeline.nodes.findIndex(
          (n) => n.id === action.payload.node.id,
        );
        if (idx !== -1) pipeline.nodes[idx] = action.payload.node;
      }
    },
    removeNode(
      state,
      action: PayloadAction<{ pipelineId: string; nodeId: string }>,
    ) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      if (pipeline)
        pipeline.nodes = pipeline.nodes.filter(
          (n) => n.id !== action.payload.nodeId,
        );
    },
    addStep(
      state,
      action: PayloadAction<{ pipelineId: string; nodeId: string; step: Step }>,
    ) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      const node = pipeline?.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) node.steps.push(action.payload.step);
    },
    updateStep(
      state,
      action: PayloadAction<{ pipelineId: string; nodeId: string; step: Step }>,
    ) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      const node = pipeline?.nodes.find((n) => n.id === action.payload.nodeId);
      if (node) {
        const idx = node.steps.findIndex(
          (s) => s.id === action.payload.step.id,
        );
        if (idx !== -1) node.steps[idx] = action.payload.step;
      }
    },
    removeStep(
      state,
      action: PayloadAction<{
        pipelineId: string;
        nodeId: string;
        stepId: string;
      }>,
    ) {
      const pipeline = state.pipelines.find(
        (p) => p.id === action.payload.pipelineId,
      );
      const node = pipeline?.nodes.find((n) => n.id === action.payload.nodeId);
      if (node)
        node.steps = node.steps.filter((s) => s.id !== action.payload.stepId);
    },
    clearPipelines(state) {
      state.pipelines = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPipelineFromDagApi.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPipelineFromDagApi.fulfilled, (state, action) => {
        state.loading = false;
        state.pipelines = [action.payload];
      })
      .addCase(fetchPipelineFromDagApi.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch pipeline';
      });
  },
});

export const {
  addPipeline,
  removePipeline,
  setPipeline,
  addNode,
  updateNode,
  removeNode,
  addStep,
  updateStep,
  removeStep,
  clearPipelines,
} = pipelineSlice.actions;

export default pipelineSlice.reducer;
