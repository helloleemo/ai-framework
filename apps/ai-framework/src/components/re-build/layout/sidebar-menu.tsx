import { getMenuItemsAPI } from '@/api/menu';
import { MenuItem } from '@/api/types/menu';
import { ArrowDownIcon } from '@/components/icon/arrow-down-icon';
import { ArrowRightIcon } from '@/components/icon/arrow-right-icon';
import { FolderIcon } from '@/components/icon/folder';
import { PipeLineIcon } from '@/components/icon/pipeline-icon';
// import { PipeLineIcon2 } from '@/components/icon/pipeline-icon-2';
import { Skeleton } from '@/components/ui/skeleton';
import { describe } from 'node:test';
// import Spinner from '@/components/ui/spinner';
import { useEffect, useState } from 'react';

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
        label: 'input',
      },
      {
        name: 'OPC UA(demo)',
        children: null,
        type: 'input',
        label: 'opcua_demo',
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
        label: 'output',
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
            label: 'signal_preprocess',
            description: '將連續時域訊號切成三等份進行混疊或平均處理。',
          },
          {
            name: '窗函數',
            children: null,
            type: 'transform',
            label: 'windows',
            description:
              '對時域訊號套用窗函數以減少頻譜洩漏，在訊號開始和結束處平滑地降低訊號強度',
          },
          {
            name: '濾波器​',
            children: null,
            type: 'transform',
            label: 'filter',
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
            label: 'fft',
            description:
              '將時域訊號轉換為頻域表示，計算各頻率成分的幅度。使用快速傅立葉變換演算法進行頻域分析，輸出正頻率範圍的頻譜資料，廣泛應用於振動分析、頻譜分析和訊號處理等領域。​',
          },
          {
            name: '小波轉換時頻圖',
            children: null,
            type: 'transform',
            label: 'dwt',
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
            label: 'integ',
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
            label: 'hilbert',
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
            label: 'feat_spec',
            description:
              '提取頻域訊號的特定頻域特徵，專注於機械診斷相關的頻率成分分析。\n OA (Overall Amplitude): 總振幅特徵 \n 轉速相關特徵: 0.25X 至 16X 轉速諧波振幅 \n 軸承缺陷特徵: BPFO、BPFI、BSF、FTF 及其諧波振幅​ \n 頻域統計特徵: 重心頻率、頻率標準差、頻率偏度等​ \n 注意：此函數不包含基本統計特徵 (由 feat_sta 提供)，避免特徵重複，專門用於機械故障診斷的頻域分析。​',
          },
          {
            name: '統計特徵提取​',
            children: null,
            type: 'transform',
            label: 'feat_sta',
            description:
              '提取訊號的統計特徵，支援時域、頻域和小波域訊號。可提取 23 種統計特徵包括：基本統計量 (均值、標準差、峰值等)、形狀特徵 (波峰因子、間隙因子等)、分佈特徵 (偏度、峰態) 和訊號特性 (零交越率、熵值等)。對 DWT 係數陣列會自動為每個子帶分別提取特徵，適用於機械故障診斷和訊號特徵分析。',
          },
        ],
      },
    ],
  },
];

const existingPipeline = [
  {
    name: '既有Pipeline',
  },
];

export default function SidebarMenu({ activeMenu }: { activeMenu: number }) {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [toggleItems, setToggleItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const toggleExpand = (itemName: string) => {
    const newToggleItems = new Set(toggleItems);
    if (newToggleItems.has(itemName)) {
      newToggleItems.delete(itemName);
    } else {
      newToggleItems.add(itemName);
    }
    setToggleItems(newToggleItems);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = toggleItems.has(item.name);
    const paddingLeft = level * 16;

    return (
      <div key={item.name}>
        <div
          className="collapse-item flex cursor-pointer items-center justify-between rounded-sm p-2 hover:bg-neutral-100"
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
          onClick={() => hasChildren && toggleExpand(item.name)}
          draggable={!hasChildren}
          onDragStart={(e) => {
            e.currentTarget.classList.add('opacity-50', 'shadow-lg');
            console.log('Drag start:', item);
            e.dataTransfer.setData(
              'application/json',
              JSON.stringify({
                name: item.name,
                type: item.type,
                label: item.label,
                description: item.description,
              }),
            );
            console.log('Drag started for:', item);
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('opacity-50', 'shadow-lg');
          }}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <FolderIcon className="h-3 w-3 text-sky-500" />
            ) : (
              <PipeLineIcon className="h-3 w-3 text-neutral-500" />
            )}
            <p className="text-sm text-neutral-600">{item.name}</p>
          </div>
          {hasChildren && (
            <span className="text-sm text-gray-400">
              {isExpanded ? <ArrowDownIcon /> : <ArrowRightIcon />}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && item.children && (
          <div>
            {item.children.map((child: any) =>
              renderMenuItem(child, level + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setMenu(menuList);
    setLoading(false);

    getMenuItemsAPI()
      .then((res) => {
        if (res.success) {
          // setMenu(res.data);
          setMenu(menuList); //先放假的！
        }
        console.log('Menu items:', res);
      })
      .catch((error) => {
        console.error('Failed to fetch menu items:', error);
        setMenu(menuList);
      })

      .finally(() => {
        console.log('Menu items fetch completed');
        setLoading(false);
      });
  }, []);

  return (
    <div className="h-[calc(100vh-250px)] flex-col overflow-y-auto">
      {loading &&
        [0, 1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <div className="mb-5 flex flex-col" key={item + index}>
              <Skeleton className="h-[35px] w-full rounded-sm" />
            </div>
          );
        })}
      {!loading && activeMenu === 1 && (
        <div className="collapse-menu scrollbar-fade relative overflow-y-auto">
          {menu.map((item) => renderMenuItem(item))}
        </div>
      )}
      {!loading && activeMenu === 0 && (
        <div className="scrollbar-fade relative overflow-y-auto">
          {existingPipeline.map((item) => {
            return (
              <ul className="flex items-center gap-2" key={item.name}>
                <li className="w-full cursor-pointer rounded-sm p-2 text-sm text-neutral-600 hover:bg-neutral-100">
                  {item.name}
                </li>
              </ul>
            );
          })}
        </div>
      )}
    </div>
  );
}
