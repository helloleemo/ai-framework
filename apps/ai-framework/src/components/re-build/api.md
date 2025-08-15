## React + API

本文說明透過React的方式，介紹如何串接第三方的API。

在前後端分離的專案當中，用來溝通前後端的橋梁就是API；透過這種方式，可以操作網頁的物件、傳遞資料、和伺服器進行溝通等。網頁物件的操作，常見於用JS以`document`為始，操作DOM (Document Object Model)物件的方式；此外也有許多第三方套件，提供API的方式，讓開發者可以自由運用。

React 基於元件化 (Component-based) 與狀態管理 (State Management) 的設計理念，可以將 API 請求邏輯封裝在 hook、service 或 utility 中，再在各個元件內根據需求呼叫，達到模組化運用。

## 功能分離

在實際開發中，為了讓專案容易維護，會將 API 請求的程式碼獨立出來，並與 UI 呈現分離，將邏輯與畫面做區隔，以符合 MVP（Model-View-Presenter）架構。
以下會先以JS原生地Fetch的完整寫法做說明，並依序拆分功能放入React專案資料夾，以符合常見的API寫法。

### Fetch完整寫法

API 請求可以透過原生的 fetch 完成，如下：

```javascript
fetch('https://api.example.com/data', {
  method: 'GET', // 方法
  headers: {
    'Content-Type': 'application/json',
    // 其他需要的自訂標頭
  },
})
  .then((res) => res.json()) // 解析 JSON 資料
  .then((data) => {
    console.log('API 回應資料：', data);
  })
  .catch((err) => {
    console.error('API 錯誤：', err);
  })
  .finally(() => {
    console.log('API 請求完成');
  });
```

以上程式碼的說明如下：

**方法(method)**：明確指定 HTTP 請求方式，例如 GET、POST、PUT、DELETE 等。
**標頭(headers)**：用來設定請求格式、驗證 Token、語言等資訊。
**回應處理(then, catch -> finally)**：成功解析回應、捕捉錯誤、與請求結束後的收尾動作（不管有沒有成功，都一定會執行的）

### MVP寫法

根據以上的Fetch範例，用MVP架構來區分的話，會分為以下：

**Model**：存放資料結構、轉換或是驗證的地方。
**View**：純呈現 UI，不會直接呼叫 fetch。
**Presenter/service**：負責流程與商業邏輯，調用 Method 層、組合 Model，回傳給 View。

## 實際專案架構實作

假設我們有一個menu的內容，需要透過API從後端取資料，在資料夾結構會區分如下：

```
src/
  api/
    types/
      menu.ts          // 型別定義
    index.ts           // Method 層：統一封裝 fetch 的方法
    menu.ts            // 選單相關 API
  components/
    sidebar-menu.tsx   // View：純呈現、從 API 取資料
.env                   // 環境變數設定
```

### 環境變數設定

在專案根目錄建立 `.env` 檔案：

```bash
# .env
REACT_APP_API_BASE_URL=https://api.example.com
```

### 方法層（Method） — 統一封裝 HTTP 請求邏輯

在 `api/index.ts` 中，建立統一的 HTTP 請求方法：

```typescript
// api/index.ts
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
```

這個是api的domain，為避免暴露會以secret env的型式存在部屬的位置。

```typescript
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
```

`async`是...
`Promise`是...
仔細說明...

```typescript
export const api = {
  async GET<T>(endpoint: string, token?: string): Promise<T> {
    const accessToken = token ?? localStorage.getItem('accessToken') ?? '';
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return handleResponse<T>(res);
  },

  async POST<T>(endpoint: string, data: unknown, token?: string): Promise<T> {
    const accessToken = token ?? localStorage.getItem('accessToken') ?? '';
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(res);
  },
};
```

仔細說明以上API的方式

### 二、型別定義層（Model） — 集中管理資料結構

在 `api/types/` 資料夾中定義各種資料型別：

```typescript
// api/types/menu.ts
export interface MenuItem {
  name: string;
  icon: string | null;
  children: MenuItem[] | null;
}

export interface MenuResponse {
  success: boolean;
  data: MenuItem[];
}
```

### 三、業務邏輯層（Service） — 封裝具體 API 呼叫

將各個功能的 API 請求封裝成獨立的服務：

```typescript
// api/menu.ts
import { menuApi } from './index';
import { MenuResponse } from './types/menu';

export const getMenuItemsAPI = (): Promise<MenuResponse> => {
  return menuApi.GET<MenuResponse>('/api/menu-items');
};
```

說明以上運用

### 四、元件中使用（View） — 分離 UI 與 API 邏輯

在 React 元件中使用 API 服務：

```tsx
/// components/sidebar-menu.tsx
import { getMenuItemsAPI } from '@/api/menu';
import { MenuItem } from '@/api/types/menu';
import { useEffect, useState } from 'react';
```

引用所有用到的涵式，這裡是為了說明而列出來，實際在摳頂的時候，有運用到的會自動引入。

```tsx
export default function SidebarMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

```

說明說明

```tsx
useEffect(() => {
  getMenuItemsAPI()
    .then((res) => {
      if (res.success) {
        setMenu(res.data || []);
      }
    })
    .catch((error) => console.error('Error fetching menu items:', error));
}, []);
```

說明說明

```tsx

return (
  <div className="h-full overflow-y-auto">
    <ul>
      {menu.map((item) => (
        <li key={item.name} className="cursor-pointer p-3 hover:bg-gray-100">
          <p className="text-base text-gray-600">{item.name}</p>
        </li>
      ))}
    </ul>
  </div>
);
}
```

## 將API拆分的好處(待修改)

### 1. **模組化管理**

- 每個 API 服務獨立檔案，易於維護
- 型別定義集中管理，避免重複定義
- 統一的錯誤處理和回應格式

### 2. **可重複使用**

- `apiDomain` 函數可用於不同的 API 基礎 URL
- 各種 HTTP 方法（GET、POST、PUT、DELETE）統一封裝
- Token 認證邏輯集中處理

### 3. **型別安全**

- TypeScript 型別定義確保 API 回應資料結構正確
- 編譯時期就能發現型別錯誤
- IDE 自動補全和錯誤提示

### 4. **關注點分離**

- UI 元件只負責呈現和使用者互動
- API 邏輯獨立於 UI，便於測試
- 符合 MVP 架構原則

## 錯誤處理最佳實務

### 統一錯誤處理

```typescript
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.text();
    console.error(`API Error: ${res.status} - ${errorData}`);
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}
```

### 元件層級錯誤處理

```tsx
useEffect(() => {
  getMenuItemsAPI()
    .then((res) => {
      if (res.success) {
        setMenu(res.data || []);
      }
    })
    .catch((error) => {
      console.error('Error fetching menu items:', error);
      // 可以設定錯誤狀態或顯示錯誤訊息
    })
    .finally(() => {
      // 收尾動作，如隱藏載入中狀態
    });
}, []);
```

## 總結

透過這種架構設計，我們達到了：

1. **代碼重用性**：HTTP 方法可在多個 API 服務中重複使用
2. **維護性**：各功能模組獨立，修改不會影響其他部分
3. **可測試性**：API 邏輯與 UI 分離，易於進行單元測試
4. **型別安全**：TypeScript 確保資料結構正確性
5. **開發效率**：統一的 API 呼叫模式，減少重複代碼

這種架構特別適合大型專案，能有效管理複雜的 API 請求邏輯，並確保代碼的可維護性和擴展性。

**Reference**

1. [用戶端 Web API](https://developer.mozilla.org/zh-TW/docs/Learn_web_development/Extensions/Client-side_APIs)
2.
