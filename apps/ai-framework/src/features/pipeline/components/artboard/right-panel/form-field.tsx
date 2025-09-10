export interface FormField {
  name: string;
  type: 'number' | 'text' | 'select';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: { value: string; label: string }[];
}

export interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
  validation?: (form: any) => string | null;
}

export const FORM_CONFIGS: Record<string, FormConfig> = {
  'pdm_preproc.filter': {
    title: '濾波器',
    description: '對時域訊號進行帶通濾波處理',
    fields: [
      {
        name: 'fs',
        type: 'number',
        label: '採樣頻率 (Hz)',
        placeholder: 'fs',
        required: true,
        validation: (value) => (value <= 0 ? '採樣頻率必須大於0' : null),
      },
      {
        name: 'lowcut',
        type: 'number',
        label: '低頻截止頻率 (Hz)',
        placeholder: 'lowcut',
        required: true,
        validation: (value) => (value <= 0 ? '低頻截止頻率必須大於0' : null),
      },
      {
        name: 'highcut',
        type: 'number',
        label: '高頻截止頻率 (Hz)',
        placeholder: 'highcut',
        required: true,
        validation: (value) => (value <= 0 ? '高頻截止頻率必須大於0' : null),
      },
    ],
    validation: (form) => {
      if (form.fs <= 0 || form.lowcut <= 0 || form.highcut <= 0) {
        return '所有值必須大於0';
      }
      if (form.lowcut >= form.highcut) {
        return '低頻截止頻率必須小於高頻截止頻率';
      }
      return null;
    },
  },

  'pdm_freq.fft': {
    title: '傅立葉轉換頻譜圖',
    description: '將時域訊號轉換為頻域表示',
    fields: [
      {
        name: 'fs',
        type: 'number',
        label: '採樣頻率 (Hz)',
        placeholder: 'fs',
        required: true,
        validation: (value) => (value <= 0 ? '採樣頻率必須大於0' : null),
      },
    ],
  },

  'pdm_vel.integ': {
    title: '速度轉換',
    description: '使用精確梯形法將加速度訊號積分轉換為速度訊號',
    fields: [
      {
        name: 'fs',
        type: 'number',
        label: '採樣頻率 (Hz)',
        placeholder: 'fs',
        required: true,
        validation: (value) => (value <= 0 ? '採樣頻率必須大於0' : null),
      },
    ],
  },

  'pdm_enve.hilbert': {
    title: '包絡變換',
    description: '使用希爾伯特變換獲得訊號包絡線',
    fields: [
      {
        name: 'fs',
        type: 'number',
        label: '採樣頻率 (Hz)',
        placeholder: 'fs',
        required: true,
        validation: (value) => (value <= 0 ? '採樣頻率必須大於0' : null),
      },
      {
        name: 'rpm',
        type: 'number',
        label: '轉速 (RPM)',
        placeholder: 'rpm',
        required: true,
        validation: (value) => (value <= 0 ? '轉速必須大於0' : null),
      },
    ],
    validation: (form) => {
      if (form.fs <= 0 || form.rpm <= 0) {
        return '全部數值必須大於0';
      }
      return null;
    },
  },

  'pdm_features.feat_spec': {
    title: '特定頻域特徵提取',
    description: '提取頻域訊號的特定頻域特徵',
    fields: [
      {
        name: 'fs',
        type: 'number',
        label: '採樣頻率 (Hz)',
        placeholder: 'fs',
        required: true,
        validation: (value) => (value <= 0 ? '採樣頻率必須大於0' : null),
      },
      {
        name: 'rpm',
        type: 'number',
        label: '轉速 (RPM)',
        placeholder: 'rpm',
        required: true,
        validation: (value) => (value <= 0 ? '轉速必須大於0' : null),
      },
      {
        name: 'bpfo',
        type: 'text',
        label: 'BPFO',
        placeholder: 'bpfo',
        required: false,
      },
      {
        name: 'bpfi',
        type: 'text',
        label: 'BPFI',
        placeholder: 'bpfi',
        required: false,
      },
      {
        name: 'bsf',
        type: 'text',
        label: 'BSF',
        placeholder: 'bsf',
        required: false,
      },
      {
        name: 'ftf',
        type: 'text',
        label: 'FTF',
        placeholder: 'ftf',
        required: false,
      },
    ],
    validation: (form) => {
      if (form.fs <= 0 || form.rpm <= 0) {
        return '採樣頻率(Hz)、轉速 (RPM) 必須大於0';
      }
      const bearingValues = [form.bpfo, form.bpfi, form.bsf, form.ftf];
      const hasAnyBearing = bearingValues.some((val) => val !== '');
      const hasAllBearing = bearingValues.every((val) => val !== '');
      if (hasAnyBearing && !hasAllBearing) {
        return '請填寫完整的軸承缺陷頻率字典，或全部留空';
      }
      return null;
    },
  },

  'pdm_features.feat_sta': {
    title: '統計特徵提取',
    description: '提取訊號的統計特徵',
    fields: [
      {
        name: 'alias',
        type: 'text',
        label: '別名',
        placeholder: 'alias',
        required: true,
        validation: (value) => (!value ? '別名欄位不得為空' : null),
      },
    ],
  },

  'pdm_preproc.mean': {
    title: '訊號前處理',
    description: '將連續時域訊號切成三等份進行混疊或平均處理',
    fields: [
      {
        name: 'type',
        type: 'select',
        label: '處理類型',
        placeholder: '處理類型',
        required: true,
        options: [
          { value: '線性平均', label: '線性平均: 三個區段取算術平均' },
          { value: 'RMS平均', label: 'RMS平均: 三個區段取RMS平均' },
          { value: '重疊平均', label: '重疊平均: 20%重疊率的重疊平均' },
          {
            value: '處理峰值保持',
            label: '處理峰值保持: 保持三個區段中的最大值',
          },
        ],
      },
    ],
  },

  // 輸出節點配置
  output: {
    title: '輸出設定',
    description: '設定管道輸出參數',
    fields: [
      {
        name: 'schedule_interval',
        type: 'select',
        label: '執行頻率',
        placeholder: '執行頻率',
        required: true,
        options: [
          { value: '@once', label: '只執行一次' },
          { value: '*/10 * * * *', label: '每十分鐘執行一次' },
          { value: '59 * * * *', label: '每小時尾端執行一次' },
          { value: '0 6 * * *', label: '每天早上6點執行一次' },
          { value: '0 0 * * *', label: '每天半夜12點執行一次' },
        ],
      },
      {
        name: 'output_filename',
        type: 'text',
        label: '檔案名稱',
        placeholder: 'output_filename',
        required: true,
        validation: (value) => (!value ? '別名欄位不得為空' : null),
      },
    ],
  },
};
