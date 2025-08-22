import OPCDA1 from './right-panel/opc-da-1';
import OPCUA from './right-panel/opcua-rebuild/opcua';
import { useSelector, useDispatch } from 'react-redux';
import { updateStep, addStep } from '@/store/pipeline';

export default function RightPanel({ activeNode }: { activeNode: any }) {
  if (!activeNode) return null;
  const dispatch = useDispatch();

  console.log('Active node in RightPanel:', activeNode);
  const isOpen = !!activeNode;
  const labelName = activeNode.data.label;

  return (
    <div>
      <div>
        <div
          className={`absolute top-0 right-0 bottom-0 z-50 w-[380px] border border-blue-400 bg-white p-5 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {labelName.includes('OPC UA') && <OPCUA activeNode={activeNode} />}
          {labelName.includes('OPC DA') && <OPCDA1 activeNode={activeNode} />}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
