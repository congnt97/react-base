import '@testing-library/jest-dom/vitest';

// i18n khởi tạo với locale vi (trả về key), để component dùng t() render được.
import '@/app/i18n';

// jsdom thiếu vài browser API mà Ant Design gọi. Gán thẳng (không kiểm tra
// tồn tại) vì type của DOM khai là luôn có; trong test môi trường là jsdom.
window.matchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => undefined,
  removeListener: () => undefined,
  addEventListener: () => undefined,
  removeEventListener: () => undefined,
  dispatchEvent: () => false,
});

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jsdom chưa hỗ trợ pseudo-element; AntD gọi getComputedStyle(el, '::after').
const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element: Element) => getComputedStyle(element);
