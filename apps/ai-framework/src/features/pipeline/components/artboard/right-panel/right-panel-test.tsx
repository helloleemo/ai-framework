import React from 'react';
import { CommonForm } from './common-form';
// import {} from './form-configs';
import { OpcUa } from './opcua/opcua';
import { Input } from './input/input';

interface RightPanelProps {
  activeNode: any;
}

export default function RightPanelTest({ activeNode }: RightPanelProps) {
  if (!activeNode) return null;

  // 處理特殊節點類型
  if (activeNode.label?.startsWith('opcua')) {
    return <OpcUa activeNode={activeNode} />;
  }

  if (activeNode.type === 'input') {
    return <Input activeNode={activeNode} />;
  }

  // 使用通用表單處理大部分節點
  const formConfig = FORM_CONFIGS[activeNode.label];
  if (formConfig) {
    return <CommonForm activeNode={activeNode} config={formConfig} />;
  }

  // 輸出節點
  if (activeNode.type === 'output') {
    return (
      <CommonForm activeNode={activeNode} config={FORM_CONFIGS['output']} />
    );
  }

  // 預設情況
  return (
    <div className="p-4">
      <p>未知的節點類型: {activeNode.label}</p>
    </div>
  );
}

export interface FormExtension {
  preSubmit?: (form: any) => any; // 提交前處理
  postSubmit?: (form: any, result: any) => void; // 提交後處理
  customValidation?: (form: any) => string | null; // 自定義驗證
}

export const FORM_EXTENSIONS: Record<string, FormExtension> = {
  'pdm_features.feat_spec': {
    preSubmit: (form) => {
      // 特殊的前處理邏輯
      return form;
    },
    customValidation: (form) => {
      // 額外的驗證邏輯
      return null;
    },
  },
};
