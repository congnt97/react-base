import '@testing-library/jest-dom/vitest';

// Initializes i18n with locale vi (returns the key), so components using t() can render.
import '@/app/i18n';

// jsdom is missing a few browser APIs that Ant Design calls. Assigned directly (no
// existence check) because the DOM types declare them as always present; the test
// environment is jsdom.
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

// jsdom doesn't support pseudo-elements yet; AntD calls getComputedStyle(el, '::after').
const getComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element: Element) => getComputedStyle(element);
