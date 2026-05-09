import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyDocumentTheme,
  detectBrowserLanguage,
  resolveThemeMode,
  usePreferencesStore,
} from "./preferencesStore";

describe("preferences store", () => {
  beforeEach(() => {
    window.localStorage.clear();
    usePreferencesStore.setState({
      language: "en",
      resolvedTheme: "light",
      themeMode: "system",
    });
  });

  it("detects Chinese browser preferences", () => {
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["zh-CN", "en-US"]);

    expect(detectBrowserLanguage()).toBe("zh");
  });

  it("persists language and theme choices", () => {
    usePreferencesStore.getState().setLanguage("zh");
    usePreferencesStore.getState().setThemeMode("dark");

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("zh");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(usePreferencesStore.getState().resolvedTheme).toBe("dark");
  });

  it("applies the resolved theme to the document", () => {
    applyDocumentTheme("dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("resolves explicit theme modes without checking the system", () => {
    expect(resolveThemeMode("light")).toBe("light");
    expect(resolveThemeMode("dark")).toBe("dark");
  });
});
