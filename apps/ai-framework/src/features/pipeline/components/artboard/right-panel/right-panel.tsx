import SignalPreprocess from './transform/signal_preprocess';
import Window from './transform/window';
import Filter from './transform/filter';
import Fft from './transform/fft';
import Integ from './transform/integ';
import Hilbert from './transform/hilbert';
import FeatSpec from './transform/feat_spec';
import OPCUA from './opcua/opcua';
import { excludedLabels } from './sidebar-items';
import Output from './output/output';
import FeatSta from './transform/feat_sta';
import InputConfig from './input/input';

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
          {}
          {/* Input */}
          {activeNode.label === 'indata_reader.standard' && (
            <InputConfig activeNode={activeNode} />
          )}
          {/* OPC UA(demo) */}
          {activeNode.label === 'opcua_demo' && (
            <OPCUA activeNode={activeNode} />
          )}
          {/* 訊號前處理 */}
          {activeNode.label === 'pdm_preproc.mean' && (
            <SignalPreprocess activeNode={activeNode} />
          )}
          {/* 窗函數 */}
          {activeNode.label === 'pdm_preproc.windows' && (
            <Window activeNode={activeNode} />
          )}
          {/* 濾波器 */}
          {activeNode.label === 'pdm_preproc.filter' && (
            <Filter activeNode={activeNode} />
          )}
          {/* 傅立葉轉換頻譜圖 */}
          {activeNode.label === 'pdm_freq.fft' && (
            <Fft activeNode={activeNode} />
          )}
          {/* 小波轉換時頻圖 */}
          {/* {activeNode.label === 'pdm_freq.dwt' && <Dwt activeNode={activeNode} />} */}
          {/* 速度轉換 */}
          {activeNode.label === 'pdm_vel.integ' && (
            <Integ activeNode={activeNode} />
          )}
          {/* 包絡變換 */}
          {activeNode.label === 'pdm_enve.hilbert' && (
            <Hilbert activeNode={activeNode} />
          )}
          {/* 特定頻域特徵提取 */}
          {activeNode.label === 'pdm_features.feat_spec' && (
            <FeatSpec activeNode={activeNode} />
          )}
          {/* 統計特徵提取 */}
          {activeNode.label === 'pdm_features.feat_sta' && (
            <FeatSta activeNode={activeNode} />
          )}
          {/* Output */}
          {activeNode.label === 'csv_writer.standard' && (
            <Output activeNode={activeNode} />
          )}
        </div>
      </div>

      {/*  */}
    </div>
  );
}
