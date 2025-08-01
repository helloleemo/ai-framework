# AI Framework 專案

✨ 基於 Nx 的 AI Framework 開發環境 ✨

這是一個使用 [Nx monorepo](https://nx.dev) 架構構建的 AI Framework 專案，整合了 React、TypeScript 和 Tailwind CSS。

## 專案概述

此專案採用現代化的前端技術棧：

- **框架**: React 18 + TypeScript
- **樣式**: Tailwind CSS v4 + 自定義設計系統
- **構建工具**: Vite
- **包管理**: Nx monorepo
- **主題**: 支援明暗模式切換

## 快速開始

### 安裝依賴

```sh
npm install
```

### 開發模式

啟動開發伺服器：

```sh
npx nx serve ai-framework
```

### 生產構建

建立生產環境打包：

```sh
npx nx build ai-framework
```

### 查看專案資訊

檢視專案可用的任務：

```sh
npx nx show project ai-framework
```

### 視覺化專案結構

查看專案依賴關係圖：

```sh
npx nx graph
```

## 專案結構

```
workspace/
├── apps/
│   └── ai-framework/          # 主應用
│       ├── src/
│       │   ├── styles.css     # 全域樣式與主題
│       │   └── ...
│       └── lib/
│           └── utils.ts       # 工具函數
├── libs/                      # 共享函式庫
└── tools/                     # 構建工具
```

## 技術特色

### 🎨 設計系統

- 完整的明暗主題支援
- 使用 OKLCH 色彩空間
- 響應式設計
- 可重用的 UI 組件

### 🛠️ 開發工具

- TypeScript 類型安全
- Tailwind CSS 快速樣式開發
- Nx 強大的 monorepo 管理
- Vite 快速熱更新

### 📦 工具函數

- `cn()` 函數：智能合併 CSS 類名
- 支援條件樣式和變體
- 與 Tailwind CSS 無縫整合

## 新增專案

### 建立新應用

```sh
npx nx g @nx/react:app 新應用名稱
```

### 建立新函式庫

```sh
npx nx g @nx/react:lib 函式庫名稱
```

### 查看可用生成器

```sh
npx nx list
npx nx list @nx/react
```

## 開發建議

### 安裝 Nx Console

推薦安裝 [Nx Console](https://nx.dev/getting-started/editor-setup) VS Code 擴展，提供：

- 視覺化任務執行
- 代碼生成器
- 智能提示增強

### 樣式開發

- 使用 `cn()` 函數合併 CSS 類名
- 遵循設計系統的色彩變數
- 善用 Tailwind CSS 的響應式前綴

### 代碼品質

- 遵循 TypeScript 最佳實踐
- 使用 ESLint 和 Prettier
- 編寫單元測試

## 常用指令

```sh
# 執行測試
npx nx test ai-framework

# 程式碼檢查
npx nx lint ai-framework

# 格式化代碼
npx nx format

# 建立所有專案
npx nx build-all
```

## 部署

### 本地預覽

```sh
npx nx preview ai-framework
```

### 環境變數

在根目錄建立 `.env` 檔案：

```env
VITE_API_URL=your_api_url
VITE_APP_TITLE=AI Framework
```

## 貢獻指南

1. Fork 此專案
2. 建立功能分支 (`git checkout -b feature/新功能`)
3. 提交變更 (`git commit -am '新增某功能'`)
4. 推送到分支 (`git push origin feature/新功能`)
5. 建立 Pull Request
