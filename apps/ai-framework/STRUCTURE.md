# AI Framework - Feature-Based Project Structure

## 📁 專案檔案結構

```
src/
├── features/                     # 🎯 業務功能模組
│   ├── auth/                     # 認證功能
│   │   ├── api/
│   │   │   └── auth.ts          # 認證 API (登入、登出、token管理)
│   │   ├── components/          # 認證相關元件 (目前為空)
│   │   ├── hooks/
│   │   │   └── use-auth.tsx     # 認證 hooks (token驗證、自動登出)
│   │   ├── pages/
│   │   │   └── login.tsx        # 登入頁面
│   │   └── types/
│   │       └── auth.ts          # 認證相關型別定義
│   │
│   ├── dashboard/               # 儀表板功能
│   │   ├── components/
│   │   │   └── header-dashboard.tsx  # 儀表板頭部元件
│   │   └── pages/
│   │       └── dashboard.tsx    # 儀表板主頁面
│   │
│   └── pipeline/                # 管道建構功能
│       ├── api/
│       │   ├── input.ts         # 輸入節點 API
│       │   ├── opcda.ts         # OPC DA API
│       │   ├── opcua.ts         # OPC UA API
│       │   └── pipeline.ts      # 管道主要 API
│       ├── components/
│       │   ├── artboard/        # 畫板相關元件
│       │   │   ├── artboard.tsx
│       │   │   ├── artboard-menu.tsx
│       │   │   ├── artboard-temp.tsx
│       │   │   ├── node-type.tsx
│       │   │   ├── prebuild-deploy.tsx
│       │   │   ├── right-panel.tsx
│       │   │   ├── top-tab.tsx
│       │   │   └── right-panel/
│       │   │       ├── input/
│       │   │       ├── opcua/
│       │   │       ├── output/
│       │   │       └── transform/
│       │   └── view-all/        # 檢視所有元件
│       │       └── view-all.tsx
│       ├── hooks/
│       │   └── use-context-pipeline.tsx  # 管道上下文 hook
│       └── types/
│           ├── opcua.ts         # OPC UA 型別定義
│           └── pipeline.ts      # 管道型別定義
│
├── shared/                      # 🔧 共享資源
│   ├── api/
│   │   ├── base/                # API 基礎配置
│   │   │   ├── api-baseurl.ts   # API 基礎 URL
│   │   │   ├── api-endpoint.ts  # API 端點定義
│   │   │   └── api-token.ts     # Token 管理
│   │   ├── types/
│   │   │   └── menu.ts          # 選單 API 型別
│   │   ├── index.ts             # API 主要匯出
│   │   └── menu.ts              # 選單 API
│   │
│   ├── components/              # 共享元件
│   │   ├── dialog/
│   │   │   └── dialog.tsx       # 對話框元件
│   │   ├── layout/              # 佈局元件
│   │   │   ├── layout.tsx       # 主要佈局
│   │   │   ├── bottom.tsx       # 底部元件
│   │   │   ├── header-top.tsx   # 頂部標題
│   │   │   ├── sidebar-menu.tsx # 側邊選單
│   │   │   └── switch-menu.tsx  # 切換選單
│   │   └── ui/                  # UI 元件庫
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── calendar.tsx
│   │       ├── dialog.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── skeleton.tsx
│   │       ├── spinner.tsx
│   │       ├── tooltip.tsx
│   │       └── icon/            # 圖示元件集合
│   │           ├── arrow-*-icon.tsx
│   │           ├── artboard-icon.tsx
│   │           ├── dashboard-icon.tsx
│   │           ├── pipeline-icon*.tsx
│   │           ├── user-icon.tsx
│   │           └── ... (其他圖示)
│   │
│   ├── hooks/                   # 共享 hooks
│   │   ├── use-spinner.tsx      # Loading spinner hook
│   │   └── use-toaster.tsx      # Toast 通知 hook
│   │
│   ├── types/                   # 共享型別定義
│   │   ├── pipelineMenuItems.ts # 管道選單項目型別
│   │   ├── platformsItems.ts    # 平台項目型別
│   │   ├── selections.ts        # 選擇項目型別
│   │   └── toastItems.ts        # Toast 項目型別
│   │
│   └── utils/                   # 工具函數
│       ├── turn-to-ms.ts        # 時間轉換工具
│       ├── utils.ts             # 通用工具函數
│       ├── uuid.ts              # UUID 生成器
│       └── validators.ts        # 驗證函數
│
├── routes/                      # 🛣️ 路由配置
│   └── index.tsx                # 主要路由定義
│
├── app.tsx                      # 應用程式根元件
├── main.tsx                     # 應用程式入口點
└── styles.css                   # 全域樣式
```

## 🎯 架構優勢

### 1. **功能導向組織**

- 每個功能模組 (auth, dashboard, pipeline) 包含完整的業務邏輯
- 相關檔案聚集在同一目錄下，易於理解和維護

### 2. **清晰的職責分工**

- **features/** - 特定業務功能
- **shared/** - 跨功能共享資源
- **routes/** - 路由配置

### 3. **可擴展性**

- 新功能可以按照既有模式快速建立
- 每個功能模組可以獨立開發和測試

### 4. **團隊協作友好**

- 不同開發者可以專注不同功能模組
- 減少檔案衝突的可能性

## 📝 開發指南

### 新增功能模組

```bash
# 建立新功能模組 (例：reports)
mkdir src/features/reports/{api,components,hooks,pages,types}
```

### 引用規則

```typescript
// 同功能模組內部引用
import { AuthAPI } from '../api/auth';

// 跨功能模組引用 (盡量避免)
import { DashboardHeader } from '../../dashboard/components/header-dashboard';

// 共享資源引用
import { Button } from '../../../shared/ui/button';
import { validateEmail } from '../../../shared/utils/validators';
```

### 檔案命名約定

- **元件**: PascalCase (e.g., `LoginForm.tsx`)
- **Hook**: camelCase with 'use' prefix (e.g., `useAuth.tsx`)
- **API**: camelCase (e.g., `auth.ts`)
- **型別**: PascalCase (e.g., `AuthTypes.ts`)

## 🚀 下一步優化建議

1. **建立 index.ts 檔案** - 統一各模組的匯出
2. **設定 Path Mapping** - 簡化引用路徑
3. **完善測試結構** - 對應功能模組建立測試檔案
4. **文件化 API** - 為每個 API 模組建立說明文件
