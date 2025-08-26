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

export default function RightPanel({ activeNode }: { activeNode: any }) {
  if (!activeNode) return null;

  // console.log('Active node in RightPanel:', activeNode);
  const isOpen = !!activeNode;

  return (
    <div>
      <div>
        <div
          className={`absolute top-0 right-0 bottom-0 z-50 w-[380px] border border-blue-400 bg-white p-5 transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'} `}
        >
          {/* Input */}
          {activeNode.data.label.includes('input') && (
            <InputSetting activeNode={activeNode} />
          )}
          {/* OPC UA(demo) */}
          {activeNode.data.label.includes('opcua_demo') && (
            <OPCUA activeNode={activeNode} />
          )}
          {/* 訊號前處理 */}
          {activeNode.data.label.includes('signal_preprocess') && (
            <SignalPreprocess activeNode={activeNode} />
          )}
          {/* 窗函數 */}
          {activeNode.data.label.includes('window') && (
            <Window activeNode={activeNode} />
          )}
          {/* 濾波器 */}
          {activeNode.data.label.includes('filter') && (
            <Filter activeNode={activeNode} />
          )}
          {/* 傅立葉轉換頻譜圖 */}
          {activeNode.data.label.includes('fft') && (
            <Fft activeNode={activeNode} />
          )}
          {/* 小波轉換時頻圖 */}
          {activeNode.data.label.includes('dwt') && (
            <Dwt activeNode={activeNode} />
          )}
          {/* 速度轉換 */}
          {activeNode.data.label.includes('integ') && (
            <Integ activeNode={activeNode} />
          )}
          {/* 包絡變換 */}
          {activeNode.data.label.includes('hilbert') && (
            <Hilbert activeNode={activeNode} />
          )}
          {/* 特定頻域特徵提取 */}
          {activeNode.data.label.includes('feat_spec') && (
            <FeatSpec activeNode={activeNode} />
          )}
          {/* 統計特徵提取 */}
          {activeNode.data.label.includes('feat_sta') && (
            <FeatSta activeNode={activeNode} />
          )}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
