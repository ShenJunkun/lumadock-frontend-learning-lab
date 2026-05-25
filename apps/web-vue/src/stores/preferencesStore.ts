import { defineStore } from "pinia";

export const LANGUAGE_STORAGE_KEY = "lumadock.language";
export const THEME_STORAGE_KEY = "lumadock.theme";

export type LanguageId = "en" | "zh";
export type ThemeMode = "light" | "dark" | "system";
export type ColorTheme = "light" | "dark";

export const languageOptions: Array<{ id: LanguageId; label: string }> = [
  { id: "zh", label: "中文" },
  { id: "en", label: "English" },
];

export const themeModeOptions: Array<{ id: ThemeMode; labelKey: string }> = [
  { id: "system", labelKey: "shell.themeSystem" },
  { id: "light", labelKey: "shell.themeLight" },
  { id: "dark", labelKey: "shell.themeDark" },
];

function storageGet(key: string) {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(key);
}

function storageSet(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

function isLanguageId(value: string | null): value is LanguageId {
  return value === "en" || value === "zh";
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function detectBrowserLanguage(): LanguageId {
  if (typeof navigator === "undefined") {
    return "en";
  }

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  return languages.some((language) => language.toLowerCase().startsWith("zh"))
    ? "zh"
    : "en";
}

export function getInitialLanguage(): LanguageId {
  const storedLanguage = storageGet(LANGUAGE_STORAGE_KEY);
  return isLanguageId(storedLanguage)
    ? storedLanguage
    : detectBrowserLanguage();
}

export function getSystemTheme(): ColorTheme {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function resolveThemeMode(themeMode: ThemeMode): ColorTheme {
  return themeMode === "system" ? getSystemTheme() : themeMode;
}

export function getInitialThemeMode(): ThemeMode {
  const storedTheme = storageGet(THEME_STORAGE_KEY);
  return isThemeMode(storedTheme) ? storedTheme : "system";
}

export function applyDocumentTheme(theme: ColorTheme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export const usePreferencesStore = defineStore("preferences", {
  state: () => {
    const themeMode = getInitialThemeMode();
    return {
      language: getInitialLanguage() as LanguageId,
      resolvedTheme: resolveThemeMode(themeMode) as ColorTheme,
      themeMode,
    };
  },
  actions: {
    refreshResolvedTheme() {
      this.resolvedTheme = resolveThemeMode(this.themeMode);
    },
    setLanguage(language: LanguageId) {
      storageSet(LANGUAGE_STORAGE_KEY, language);
      this.language = language;
    },
    setThemeMode(themeMode: ThemeMode) {
      storageSet(THEME_STORAGE_KEY, themeMode);
      this.themeMode = themeMode;
      this.resolvedTheme = resolveThemeMode(themeMode);
    },
  },
});
