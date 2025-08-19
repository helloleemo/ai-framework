import { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Node,
  type Edge,
  type OnConnect,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CloseIcon } from '@/components/icon/close-icon';
import { useDnD } from '../hooks/use-dnd-flow';
import {
  InputNode,
  TransformNode,
  OutputNode,
  edgeType,
} from '@/components/node-type';
import RightPanel from '@/components/right-panel';
// import { PreBuildIcon } from '@/components/icon/pre-build-icon';
// import { StopIcon } from '@/components/icon/stop-icon';
import PrebuildDeploy from '@/components/prebuild-deploy';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];
const nodeTypes = {
  input: InputNode,
  transform: TransformNode,
  output: OutputNode,
};
const edgeTypes = {
  custom: edgeType,
};

function TempArtboard() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { type: nodeType } = useDnD();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('nodeType');
      const label = event.dataTransfer.getData('nodeLabel');

      console.log('Drop triggered, nodeType:', nodeType);

      event.dataTransfer.dropEffect = 'move';

      // Node的資料
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: {
          label: label || 'New Node',
        },
      };

      console.log('Creating node:', newNode);
      setNodes((nds) => nds.concat(newNode));
      // setFocusedNode(newNode);
    },
    [screenToFlowPosition, setNodes],
  );

  // call panel
  const [focusedNode, setFocusedNode] = useState<Node | null>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const handleNodeFocus = useCallback(
    (node: Node) => {
      if (focusedNode && focusedNode.id !== node.id) {
        setPanelVisible(false);
        setTimeout(() => {
          setFocusedNode(node);
          setPanelVisible(true);
        }, 300);
      } else {
        setFocusedNode(node);
        setPanelVisible(true);
      }
    },
    [focusedNode],
  );
  const onNodeClick = useCallback(
    (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
      console.log('Node clicked:', node);
      handleNodeFocus(node);
    },
    [handleNodeFocus],
  );

  // click blank to collapse panel

  const handlePaneClick = () => {
    setPanelVisible(false);
    setTimeout(() => setFocusedNode(null), 300);
  };
  return (
    <>
      <div className="h-full w-full">
        <div className="h-[calc(100%-50px)] w-full">
          <div className="h-[40px - 1px]">
            <div className="w-fit rounded-t-md bg-white py-2 pr-4 pl-5">
              <div className="activeFile flex items-center gap-x-2">
                <div className="unSaved h-2.5 w-2.5 rounded-full bg-sky-500"></div>
                <div className="text">
                  <p className="text-sm text-neutral-600">2025-08-06 - Draft</p>
                </div>
                <div className="icon cursor-pointer rounded-full p-1 hover:bg-neutral-100">
                  <CloseIcon className="fill-neutral-800" size="1.3em" />
                </div>
              </div>
              <div className="others"></div>
            </div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges.map((e) => ({ ...e, type: 'custom' }))}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={handlePaneClick}
          >
            <Controls />
            <Background bgColor="#fff" />
            <div className="absolute top-5 left-5 z-10">
              <PrebuildDeploy
                nodes={nodes}
                edges={edges}
                setNodes={setNodes}
                setEdges={setEdges}
              />
            </div>
          </ReactFlow>
        </div>
      </div>
      <div
        className={`absolute top-0 right-0 h-full w-[340px] border bg-white p-4 transition-all duration-100 ${
          panelVisible && focusedNode
            ? 'pointer-events-auto translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-full opacity-0'
        }`}
      >
        {focusedNode && <RightPanel node={focusedNode} />}
      </div>
    </>
  );
}

export default function TestFlow() {
  return (
    <ReactFlowProvider>
      <TempArtboard />
    </ReactFlowProvider>
  );
}
