import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import RightPanel from './right-panel/right-panel';
import { useEffect, useCallback } from 'react';

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

  const { activeNode } = usePipeline();

  // delete
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        //
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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      {/* TEST */}
      {/* <div className="fixed left-[10px] z-10"></div> */}

      {/* content */}
      <div className="h-full w-full" onClick={onCanvasClick}>
        <div
          className="h-[calc(100vh-18px)] w-full"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="absolute z-10 ml-10 flex items-center gap-2">
            <PipelineDeploy />
            <GetTempDialog />
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
        <div className="absolute top-5 left-5 z-10"></div>
      </div>
      <RightPanel activeNode={activeNode} />
      {/*  */}
    </>
  );
}

export default function Artboard() {
  return (
    <PipelineProvider>
      <ArtboardRoot />
    </PipelineProvider>
  );
}
