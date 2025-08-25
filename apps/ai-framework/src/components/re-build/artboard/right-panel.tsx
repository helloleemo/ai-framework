import InputSetting from './right-panel/input/input-setting';
import InputProps from './right-panel/input/input-setting';
import Input from './right-panel/input/input-setting';

export default function RightPanel({ activeNode }: { activeNode: any }) {
  if (!activeNode) return null;

  console.log('Active node in RightPanel:', activeNode);
  const isOpen = !!activeNode;

  return (
    <div>
      <div>
        <div
          className={`absolute top-0 right-0 bottom-0 z-50 w-[380px] border border-blue-400 bg-white p-5 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {activeNode.type.includes('input') && (
            <InputSetting activeNode={activeNode} />
          )}
          {/* {labelName.includes('OPC DA') && <OPCDA1 activeNode={activeNode} />} */}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
