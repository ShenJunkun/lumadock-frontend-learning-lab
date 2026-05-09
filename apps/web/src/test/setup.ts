import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { vi } from "vitest";

import "../i18n";
import { resetMockData } from "../mocks/handlers";
import { server } from "../mocks/server";

class ResizeObserverMock {
  observe() {
    return undefined;
  }

  unobserve() {
    return undefined;
  }

  disconnect() {
    return undefined;
  }
}

class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];

  disconnect() {
    return undefined;
  }

  observe() {
    return undefined;
  }

  takeRecords() {
    return [];
  }

  unobserve() {
    return undefined;
  }
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver =
  IntersectionObserverMock as unknown as typeof IntersectionObserver;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  })),
});

const getComputedStyle = window.getComputedStyle;

window.getComputedStyle = (element: Element, pseudoElement?: string | null) =>
  getComputedStyle(element, pseudoElement ? undefined : pseudoElement);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => {
  resetMockData();
  server.resetHandlers();
});
afterAll(() => server.close());
