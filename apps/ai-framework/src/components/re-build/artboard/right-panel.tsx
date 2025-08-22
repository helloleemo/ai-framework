import OPCDA1 from './right-panel/opc-da-1';
import OPCUA1 from './right-panel/opc-ua-1';

export default function RightPanel({ activeNode }: { activeNode: any }) {
  if (!activeNode) return null;

  console.log('Active node in RightPanel:', activeNode);
  const isOpen = !!activeNode;
  const labelName = activeNode.data.label;

  return (
    <div>
      <div>
        <div
          className={`absolute top-0 right-0 bottom-0 z-50 w-[360px] border border-blue-400 bg-white p-5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {labelName.includes('OPC UA') && <OPCUA1 activeNode={activeNode} />}
          {labelName.includes('OPC DA') && <OPCDA1 activeNode={activeNode} />}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
