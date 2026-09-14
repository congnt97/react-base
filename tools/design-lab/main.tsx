import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@/app/i18n';
import '@/styles/styles.css';

import { DesignLab } from './design-lab';

// Trang riêng, không nằm trong router của app và không có trong bản build production:
// Vite chỉ build index.html. Mở ở dev: http://localhost:3001/design-lab.html
const root = document.getElementById('design-lab');

if (root) {
  ReactDOM.createRoot(root).render(
    <StrictMode>
      <DesignLab />
    </StrictMode>,
  );
}
