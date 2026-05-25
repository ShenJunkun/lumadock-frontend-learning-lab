import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import {
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  applyDocumentTheme,
  resolveThemeMode,
  usePreferencesStore,
} from "./preferencesStore";

describe("preferencesStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    window.localStorage.clear();
  });

  it("persists language and theme choices", () => {
    const store = usePreferencesStore();
    store.setLanguage("en");
    store.setThemeMode("dark");

    expect(window.localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(store.resolvedTheme).toBe("dark");
  });

  it("applies document theme attributes", () => {
    applyDocumentTheme("dark");

    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(resolveThemeMode("light")).toBe("light");
  });
});
