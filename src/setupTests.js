import "@testing-library/jest-dom/vitest";

// Radix UI (Checkbox, etc.) needs ResizeObserver in jsdom
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = globalThis.ResizeObserver || ResizeObserverStub;
