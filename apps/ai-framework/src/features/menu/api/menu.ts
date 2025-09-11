import { MenuItem } from '@/shared/api/types/menu';
import path from 'path';

const menuList: MenuItem[] = [
  {
    name: 'Input',
    type: 'input',
    label: null,
    children: [
      {
        name: 'Input',
        children: null,
        type: 'input',
        label: 'indata_reader.standard',
        intro: '',
        description: '',
      },
      {
        name: 'OPC UA(demo)',
        children: null,
        type: 'input',
        label: 'opcua_demo',
        intro: '',
        description: '',
      },
    ],
  },
  {
    name: 'Output',
    type: 'output',
    label: null,
    children: [
      {
        name: 'Output',
        children: null,
        type: 'output',
        label: 'csv_writer.standard',
        intro: '',
      },
    ],
  },
  {
    name: 'Transform',
    type: 'transform',
    label: null,
    children: [
      {
        name: 'preproc',
        type: 'transform',
        label: null,
        children: [
          {
            name: '訊號前處理​',
            children: null,
            type: 'transform',
            label: 'pdm_preproc.mean',
            intro: '將連續時域訊號切成三等份進行混疊或平均處理。',
            description:
              '將連續時域訊號切成三等份進行混疊或平均處理，支持四種處理模式：​\n線性平均: 三個區段取算術平均​。\nRMS平均: 三個區段取RMS平均。\n重疊平均: 20%重疊率的重疊平均。​\n處理峰值保持: 保持三個區段中的最大值',
          },
          {
            name: '窗函數',
            children: null,
            type: 'transform',
            label: 'pdm_preproc.windows',
            intro:
              '對時域訊號套用窗函數以減少頻譜洩漏，在訊號開始和結束處平滑地降低訊號強度。',
            description:
              '對時域訊號套用窗函數以減少頻譜洩漏，在訊號開始和結束處平滑地降低訊號強度',
          },
          {
            name: '濾波器​',
            children: null,
            type: 'transform',
            label: 'pdm_preproc.filter',
            intro:
              '對時域訊號進行帶通濾波處理，保留指定頻率範圍內的訊號成分，濾除範圍外的雜訊和干擾。',
            description:
              '對時域訊號進行帶通濾波處理，保留指定頻率範圍內的訊號成分，濾除範圍外的雜訊和干擾。使用 FIR 濾波器搭配零相位濾波技術，確保濾波後訊號不產生相位失真，適用於振動分析和訊號清理等應用。',
          },
        ],
      },
      {
        name: 'freq',
        type: 'transform',
        label: null,
        children: [
          {
            name: '傅立葉轉換頻譜圖​',
            children: null,
            type: 'transform',
            label: 'pdm_freq.fft',
            intro: '將時域訊號轉換為頻域表示，計算各頻率成分的幅度。',
            description:
              '將時域訊號轉換為頻域表示，計算各頻率成分的幅度。使用快速傅立葉變換演算法進行頻域分析，輸出正頻率範圍的頻譜資料，廣泛應用於振動分析、頻譜分析和訊號處理等領域。​',
          },
          {
            name: '小波轉換時頻圖',
            children: null,
            type: 'transform',
            label: 'pdm_freq.dwt',
            intro: '將時域訊號進行離散小波變換，分解成多個不同頻率子帶的係數。',
            description:
              '將時域訊號進行離散小波變換，分解成多個不同頻率子帶的係數。使用 5 層小波包分解，每個子帶代表特定的時頻特徵，適用於非穩態訊號分析、特徵提取和故障診斷等應用。輸出的係數矩陣每一行代表一個子帶的時頻特徵。',
          },
        ],
      },
      {
        name: 'vel',
        type: 'transform',
        label: null,
        children: [
          {
            name: '速度轉換',
            children: null,
            type: 'transform',
            label: 'pdm_vel.integ',
            intro:
              '使用精確梯形法將加速度訊號積分轉換為速度訊號，並處理積分過程中的漂移問題。',
            description:
              '使用精確梯形法將加速度訊號積分轉換為速度訊號，並處理積分過程中的漂移問題。自動進行單位轉換 (g → mm/s)、直流分量移除和線性去趨勢處理，確保積分結果的準確性。適用於振動監測中從加速度計算速度的應用場景。',
          },
        ],
      },
      {
        name: 'enve',
        type: 'transform',
        label: null,
        children: [
          {
            name: '包絡轉換​',
            children: null,
            type: 'transform',
            label: 'pdm_enve.hilbert',
            intro:
              '使用希爾伯特變換獲得訊號包絡線，適用於機械故障診斷和調幅訊號分析。',
            description:
              '使用希爾伯特變換獲得訊號包絡線，適用於機械故障診斷和調幅訊號分析。根據轉速自動選擇最適合的預濾波頻率範圍 (遵循 ISO-10816 標準)，並在 800 Hz 範圍內進行包絡解調，有效提取軸承故障、齒輪缺陷等調幅特徵。',
          },
        ],
      },
      {
        name: 'features',
        type: 'transform',
        label: null,
        children: [
          {
            name: '特定頻域特徵提取​',
            children: null,
            type: 'transform',
            label: 'pdm_features.feat_spec',
            intro:
              '提取頻域訊號的特定頻域特徵，專注於機械診斷相關的頻率成分分析。',
            description:
              '提取頻域訊號的特定頻域特徵，專注於機械診斷相關的頻率成分分析。\n OA (Overall Amplitude): 總振幅特徵 \n 轉速相關特徵: 0.25X 至 16X 轉速諧波振幅 \n 軸承缺陷特徵: BPFO、BPFI、BSF、FTF 及其諧波振幅​ \n 頻域統計特徵: 重心頻率、頻率標準差、頻率偏度等​ \n 注意：此函數不包含基本統計特徵 (由 feat_sta 提供)，避免特徵重複，專門用於機械故障診斷的頻域分析。​',
          },
          {
            name: '統計特徵提取​',
            children: null,
            type: 'transform',
            label: 'pdm_features.feat_sta',
            intro: '提取訊號的統計特徵，支援時域、頻域和小波域訊號。',
            description:
              '提取訊號的統計特徵，支援時域、頻域和小波域訊號。可提取 23 種統計特徵包括：基本統計量 (均值、標準差、峰值等)、形狀特徵 (波峰因子、間隙因子等)、分佈特徵 (偏度、峰態) 和訊號特性 (零交越率、熵值等)。對 DWT 係數陣列會自動為每個子帶分別提取特徵，適用於機械故障診斷和訊號特徵分析。',
          },
        ],
      },
    ],
  },
];

const folders = [
  {
    name: '其他',
    id: 'others',
    defaultPath: '/ai-framework/view-all',
    hasRoute: false,
    children: [
      {
        name: '管線列表',
        path: '/ai-framework/view-all',
        hasRoute: true,
      },
      {
        name: '執行記錄',
        path: '/ai-framework/logs',
        hasRoute: true,
      },
    ],
  },
  {
    name: '系統管理',
    id: 'system',
    defaultPath: '/ai-framework/settings',
    hasRoute: false,
    children: [
      {
        name: '系統設定',
        path: '/ai-framework/settings',
        hasRoute: true,
      },
      {
        name: '使用者管理',
        path: '/ai-framework/users',
        hasRoute: true,
      },
      {
        name: '權限設定',
        path: '/ai-framework/permissions',
        hasRoute: true,
      },
    ],
  },
  {
    name: '監控中心',
    id: 'monitoring',
    defaultPath: '/ai-framework/monitoring',
    hasRoute: false,
    children: [
      {
        name: '系統監控',
        path: '/ai-framework/monitoring',
        hasRoute: true,
      },
      {
        name: '效能分析',
        path: '/ai-framework/performance',
        hasRoute: true,
      },
    ],
  },
];

const existingPipeline =
  folders.find((folder) => folder.id === 'others')?.children || [];

export default { menuList, existingPipeline, folders };
