import InputSetting from './right-panel/input/input-setting';
import SignalPreprocess from './right-panel/transform/signal_preprocess';
import Window from './right-panel/transform/window';
import Filter from './right-panel/transform/filter';
import Fft from './right-panel/transform/fft';
import Dwt from './right-panel/transform/dwt';
import Integ from './right-panel/transform/integ';
import Hilbert from './right-panel/transform/hilbert';
import FeatSpec from './right-panel/transform/feat_spec';
import FeatSta from './right-panel/transform/feat_sta';
import OPCUA from './right-panel/opcua/opcua';
import { excludedLabels } from './right-panel/no-setting-excluded-label';
import Output from './right-panel/output/output';

export default function RightPanel({ activeNode }: { activeNode: any }) {
  // console.log('RightPanel activeNode', activeNode);
  if (!activeNode) return null;
  // No setting
  if (excludedLabels.some((label) => activeNode.label === label)) return null;

  const isOpen = !!activeNode;

  return (
    <div>
      <div>
        <div
          className={`absolute top-0 right-0 bottom-0 z-50 w-[380px] border border-blue-400 bg-white p-5 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {/* Input */}
          {activeNode.label === 'input' && (
            <InputSetting activeNode={activeNode} />
          )}
          {/* OPC UA(demo) */}
          {activeNode.label === 'opcua_demo' && (
            <OPCUA activeNode={activeNode} />
          )}
          {/* 訊號前處理 */}
          {activeNode.label === 'signal_preprocess' && (
            <SignalPreprocess activeNode={activeNode} />
          )}
          {/* 窗函數 */}
          {activeNode.label === 'window' && <Window activeNode={activeNode} />}
          {/* 濾波器 */}
          {activeNode.label === 'filter' && <Filter activeNode={activeNode} />}
          {/* 傅立葉轉換頻譜圖 */}
          {activeNode.label === 'fft' && <Fft activeNode={activeNode} />}
          {/* 小波轉換時頻圖 */}
          {/* {activeNode.label === 'dwt' && <Dwt activeNode={activeNode} />} */}
          {/* 速度轉換 */}
          {activeNode.label === 'integ' && <Integ activeNode={activeNode} />}
          {/* 包絡變換 */}
          {activeNode.label === 'hilbert' && (
            <Hilbert activeNode={activeNode} />
          )}
          {/* 特定頻域特徵提取 */}
          {activeNode.label === 'feat_spec' && (
            <FeatSpec activeNode={activeNode} />
          )}
          {/* 統計特徵提取 */}
          {/* {activeNode.label === 'feat_sta' && (
            <FeatSta activeNode={activeNode} />
          )} */}
          {/* Output */}
          {activeNode.label === 'output' && <Output activeNode={activeNode} />}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
