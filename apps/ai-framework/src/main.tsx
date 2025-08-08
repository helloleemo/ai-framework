import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app';

// 配置 React Router 未來標誌
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter {...router}>
      <App />
    </BrowserRouter>
  </StrictMode>
);
