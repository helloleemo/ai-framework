# Toast 元件實作指南

## 什麼是 Toast

Toast 是一種輕量級的通知元件，用於在使用者執行某項動作後提供即時反饋。它會暫時顯示在畫面上，讓使用者知道操作是否成功、失敗或需要注意。

### 使用時機

- ✅ **成功操作**：如儲存完成、資料上傳成功
- ❌ **錯誤提示**：如網路連線失敗、表單驗證錯誤
- ⚠️ **警告訊息**：如即將過期的通知、需要注意的狀況

## 實作步驟

### 第一步：定義型別 (TypeScript Types)

首先建立 `types/toastItems.ts`，定義所有相關的型別：

```typescript
export interface ToastProps {
  id: string; // 唯一識別符
  type: 'success' | 'error' | 'warning'; // Toast 類型
  message: string; // 顯示訊息
  onClose: (id: string) => void; // 關閉回調函數
  autoClose?: boolean; // 是否自動關閉
  duration?: number; // 顯示時間（毫秒）
}

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

export interface ToastGroupProps {
  toasts: ToastData[];
  onRemoveToast: (id: string) => void;
}
```

**為什麼這樣設計？**

- `ToastProps`：單個 Toast 元件需要的所有屬性
- `ToastData`：儲存在狀態中的 Toast 資料（不包含 onClose 函數）
- `ToastGroupProps`：Toast 容器元件的屬性

### 第二步：建立基礎 Toast 元件

建立 `components/toast-group/toast.tsx`：

```typescript
import { ToastProps } from '@/types/toastItems';
import { SuccessIcon } from '../icon/success-icon';
import { CloseIcon } from '../icon/close-icon';
import { useEffect, useState } from 'react';

// 定義不同類型的樣式
const styles = {
  success: 'bg-green-100/90 text-green-600 border-green-200',
  error: 'bg-red-100/90 text-red-600 border-red-200',
  warning: 'bg-yellow-100/90 text-yellow-600 border-yellow-200',
};

export default function Toast({
  id,
  type,
  message,
  onClose,
  autoClose = true,
  duration = 3000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // 元件載入時顯示動畫
    setShow(true);

    // 如果設定自動關閉，啟動計時器
    if (autoClose) {
      const timer = setTimeout(() => {
        onClose(id);
        setShow(false);
      }, duration);

      // 清理計時器避免記憶體洩漏
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, id, onClose]);

  return (
    <div
      className={`
        w-80 rounded-sm border p-4 shadow-lg
        ${styles[type]}
        transition-all duration-300 ease-in-out
        ${show ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => setShow(false)}
          className="cursor-pointer rounded-full p-1 hover:bg-black/10"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

**重點說明：**

1. **動畫效果**：使用 `useState` 控制顯示狀態，配合 CSS transition 實現滑入效果
2. **自動關閉**：使用 `setTimeout` 實現自動關閉功能
3. **樣式系統**：透過物件定義不同類型的樣式，保持一致性
4. **清理機制**：在 `useEffect` 中返回清理函數，避免記憶體洩漏

### 第三步：建立 ToastGroup 容器元件

建立 `components/toast-group/toast-group.tsx`：

```typescript
import { useState, useCallback } from 'react';
import Toast from './toast';
import { generateUUID } from '@/utils/uuid';
import { ToastData, ToastGroupProps } from '@/types/toastItems';

// ToastGroup 元件：管理多個 Toast 的容器
export function ToastGroup({ toasts, onRemoveToast }: ToastGroupProps) {
  return (
    <div className="max-w-[calc(100vw-1rem)] fixed top-4 right-4 z-50 space-y-2 overflow-x-hidden">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
}

// 自定義 Hook：提供 Toast 管理邏輯
export function useToastGroup() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // 新增 Toast
  const addToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = generateUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  // 移除 Toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 便利方法：顯示成功訊息
  const showSuccess = useCallback(
    (message: string) => addToast({ type: 'success', message }),
    [addToast],
  );

  // 便利方法：顯示錯誤訊息
  const showError = useCallback(
    (message: string) =>
      addToast({ type: 'error', message, autoClose: true, duration: 2000 }),
    [addToast],
  );

  // 便利方法：顯示警告訊息
  const showWarning = useCallback(
    (message: string) =>
      addToast({ type: 'warning', message, autoClose: true, duration: 2000 }),
    [addToast],
  );

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
  };
}
```

**架構解釋：**

#### 為什麼分成兩個部分？

1. **ToastGroup 元件**：
   - 負責渲染和定位所有 Toast
   - 使用 `fixed` 定位在右上角
   - 透過 `space-y-2` 讓多個 Toast 之間有間距

2. **useToastGroup Hook**：
   - 管理 Toast 的狀態（新增、移除）
   - 提供便利的方法（showSuccess、showError、showWarning）
   - 使用 `useCallback` 優化效能，避免不必要的重新渲染

### 第四步：建立工具函數

建立 `utils/uuid.ts`：

```typescript
export function generateUUID(): string {
  return 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
```

**為什麼需要 UUID？**

- 每個 Toast 需要唯一的 `key` 給 React 識別
- 當有多個相同訊息的 Toast 時，仍能正確管理

### 第五步：在應用程式中使用

在主要元件中（如 `app.tsx` 或 `layout.tsx`）：

```typescript
import { ToastGroup, useToastGroup } from '@/components/toast-group/toast-group';

function App() {
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToastGroup();

  const handleSaveData = async () => {
    try {
      // 模擬 API 呼叫
      await saveData();
      showSuccess('資料儲存成功！');
    } catch (error) {
      showError('儲存失敗，請稍後再試');
    }
  };

  return (
    <div>
      {/* 你的主要內容 */}
      <button onClick={handleSaveData}>儲存資料</button>

      {/* Toast 容器 - 通常放在最外層 */}
      <ToastGroup toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
```

## 進階功能

### 1. 全域 Toast 管理

可以建立一個全域的 Toast Context：

```typescript
// contexts/ToastContext.tsx
import { createContext, useContext } from 'react';
import { useToastGroup } from '@/components/toast-group/toast-group';

const ToastContext = createContext<ReturnType<typeof useToastGroup> | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastMethods = useToastGroup();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      <ToastGroup toasts={toastMethods.toasts} onRemoveToast={toastMethods.removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

### 2. 不同位置的 Toast

可以擴展元件支援不同的顯示位置：

```typescript
type Position = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

const positionClasses = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
};
```

## 最佳實踐

### 1. 效能優化

- 使用 `useCallback` 包裝函數，避免不必要的重新渲染
- 限制同時顯示的 Toast 數量（如最多 5 個）

### 2. 使用者體驗

- 成功訊息可以較短時間自動關閉（2-3 秒）
- 錯誤訊息應該讓使用者手動關閉或較長時間顯示
- 提供明確的視覺區別（顏色、圖示）

### 3. 無障礙設計

- 添加 `role="alert"` 給重要訊息
- 確保顏色對比度符合標準
- 支援鍵盤操作

## 常見問題

### Q: 為什麼要分成 Toast 和 ToastGroup？

A: 這是關注點分離的設計原則：

- Toast：專注於單個通知的顯示邏輯
- ToastGroup：專注於多個通知的管理和佈局

### Q: 可以同時顯示多個 Toast 嗎？

A: 可以，ToastGroup 會將所有 Toast 垂直排列，新的 Toast 會添加到頂部。

### Q: 如何自訂 Toast 的樣式？

A: 可以修改 `styles` 物件，或者透過 props 傳入自訂的 className。

**Reference**

1. [React Toast 最佳實踐](https://react-hot-toast.com/)
2. [Material Design - Snackbars](https://material.io/components/snackbars)
3. [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
