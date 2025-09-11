import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RightPanel from './right-panel/right-panel';
import { useEffect, useCallback, createContext, useContext } from 'react';

import {
  useArtboardNodes,
  PipelineProvider,
  usePipeline,
} from '@/features/pipeline/hooks/use-context-pipeline';

import PipelineDeploy from './prebuild-deploy';
import { usePipelineLoader } from '@/features/pipeline/hooks/use-pipeline-loader';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogContent,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { GetTempDialog } from './get-temp-dialog';
import { useNavigate, useParams } from 'react-router-dom';
import { getDagDataAPI } from '../../api/pipeline';
import { useToaster } from '@/shared/hooks/use-toaster';

// 創建編輯模式的 Context
const EditModeContext = createContext<{
  isEditMode: boolean;
  currentDagId: string | null;
}>({
  isEditMode: false,
  currentDagId: null,
});

export const useEditMode = () => useContext(EditModeContext);

function ArtboardRoot() {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    nodeTypes,
    edgeTypes,
    handleDrop,
    handleDragOver,
    onConnect,
    onNodeDoubleClick,
    onCanvasClick,
    deleteNode,
  } = useArtboardNodes();

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showSuccess, showError } = useToaster();
  const { activeNode, loadFromAPIResponse, loadFromDAG } = usePipeline();

  // 判斷是否為編輯模式
  const isEditMode = !!id;
  const currentDagId = id || null;

  // delete
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter((node) => node.selected);
        if (selectedNodes.length > 0) {
          const confirmDelete = window.confirm(
            `確定要刪除 ${selectedNodes.length} 個節點嗎？這將同時刪除所有相關的連接線。`,
          );
          if (confirmDelete) {
            selectedNodes.forEach((node) => {
              deleteNode(node.id, true);
            });
          }
        }
      }
    },
    [nodes, deleteNode],
  );

  // get dag
  useEffect(() => {
    if (id) {
      console.log('Loading DAG with id:', id);

      const fetchDagData = async () => {
        try {
          const res = await getDagDataAPI(id);
          console.log('Full API response:', res);
          if (res && res.success === true) {
            const data = res.data;
            console.log('DAG data:', data);

            if (Array.isArray(data)) {
              const dagData = data.find((dag) => dag.dag_id === id);
              if (dagData) {
                loadFromDAG(dagData);
                showSuccess('資料載入成功');
              } else {
                showError(`找不到 ID 為 ${id} 的 DAG`);
              }
            } else {
              loadFromDAG(data);
              showSuccess('資料載入成功');
            }
          } else {
            console.error('API response indicates failure:', res);
            showError(res?.message || '資料獲取失敗');
          }
        } catch (error) {
          console.error('Error fetching DAG data:', error);
          showError('資料獲取失敗，請重新再試');
        }
      };

      fetchDagData();
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      console.log('Creating new pipeline');
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [id, handleKeyDown]);

  return (
    <EditModeContext.Provider value={{ isEditMode, currentDagId }}>
      {/* content */}
      <div className="h-full w-full" onClick={onCanvasClick}>
        <div
          className="h-[calc(100vh-18px)] w-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="absolute z-10 ml-10 flex items-center gap-2">
            <GetTempDialog />
            <PipelineDeploy />
          </div>

          <ReactFlow
            className="h-full w-full"
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDoubleClick={onNodeDoubleClick}
          >
            <Controls />
            <Background bgColor="#fff" />
          </ReactFlow>
        </div>
      </div>
      <RightPanel activeNode={activeNode} />
    </EditModeContext.Provider>
  );
}

export default function Artboard() {
  return (
    <PipelineProvider>
      <ArtboardRoot />
    </PipelineProvider>
  );
}
