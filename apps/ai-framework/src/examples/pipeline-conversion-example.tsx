import React from 'react';
import {
  usePipeline,
  PipelineConfigResult,
} from '@/hooks/use-context-pipeline';

// 使用轉換功能的範例組件
export const PipelineConversionExample: React.FC = () => {
  const { nodes, buildPipelineConfig, validatePipeline } = usePipeline();

  // 轉換並取得 DAG 格式
  const handleConvertToDag = () => {
    // 首先驗證 pipeline
    const validation = validatePipeline();

    if (!validation.isValid) {
      console.error('Pipeline 驗證失敗:', validation.errors);
      alert('Pipeline 驗證失敗:\n' + validation.errors.join('\n'));
      return;
    }

    // 轉換為 DAG 格式
    const dagConfig = buildPipelineConfig();

    console.log('轉換後的 DAG 格式:', dagConfig);

    // 這裡可以發送到後端 API
    // sendToBackend(dagConfig);

    return dagConfig;
  };

  // 發送到後端的函數範例
  const sendToBackend = async (dagConfig: PipelineConfigResult) => {
    try {
      const response = await fetch('/api/pipeline/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dagConfig),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Pipeline 部署成功:', result);
        alert('Pipeline 部署成功!');
      } else {
        console.error('部署失敗:', response.statusText);
        alert('Pipeline 部署失敗!');
      }
    } catch (error) {
      console.error('發送請求時發生錯誤:', error);
      alert('發送請求時發生錯誤!');
    }
  };

  // 預覽 DAG 格式
  const previewDag = () => {
    const validation = validatePipeline();
    const dagConfig = buildPipelineConfig();

    return {
      validation,
      dagConfig,
      summary: {
        totalNodes: nodes.length,
        nodeTypes: [...new Set(nodes.map((n) => n.type))],
        isValid: validation.isValid,
      },
    };
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">Pipeline 轉換工具</h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <button
          onClick={() => {
            const preview = previewDag();
            console.log('Pipeline 預覽:', preview);
          }}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          預覽 DAG 格式
        </button>

        <button
          onClick={handleConvertToDag}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          轉換並驗證
        </button>

        <button
          onClick={() => {
            const dagConfig = handleConvertToDag();
            if (dagConfig) {
              sendToBackend(dagConfig);
            }
          }}
          className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
        >
          部署到後端
        </button>
      </div>

      <div className="mt-4 rounded bg-gray-100 p-4">
        <h3 className="mb-2 font-semibold">當前 Pipeline 狀態</h3>
        <p>總節點數: {nodes.length}</p>
        <p>節點類型: {[...new Set(nodes.map((n) => n.type))].join(', ')}</p>
      </div>
    </div>
  );
};

// 使用範例的 Hook
export const usePipelineConversion = () => {
  const { buildPipelineConfig, validatePipeline } = usePipeline();

  return {
    // 快速轉換函數
    convertToDag: () => {
      const validation = validatePipeline();
      if (!validation.isValid) {
        throw new Error(`Pipeline 驗證失敗: ${validation.errors.join(', ')}`);
      }
      return buildPipelineConfig();
    },

    // 安全轉換函數 (不會拋出錯誤)
    safeConvertToDag: () => {
      try {
        const validation = validatePipeline();
        const dagConfig = buildPipelineConfig();

        return {
          success: validation.isValid,
          data: validation.isValid ? dagConfig : null,
          errors: validation.errors,
        };
      } catch (error) {
        return {
          success: false,
          data: null,
          errors: [error instanceof Error ? error.message : '未知錯誤'],
        };
      }
    },

    // 驗證函數
    validate: validatePipeline,
  };
};
