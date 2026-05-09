import { QueryClientProvider } from "@tanstack/react-query";
import { App as AntdRuntimeApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import { App } from "../App";
import i18n from "../i18n";
import { queryClient } from "../lib/queryClient";
import { applyDocumentTheme, usePreferencesStore } from "../store/preferencesStore";
import { createAntdTheme } from "../theme/antdTheme";

export function AppProviders() {
  const language = usePreferencesStore((state) => state.language);
  const resolvedTheme = usePreferencesStore((state) => state.resolvedTheme);
  const themeMode = usePreferencesStore((state) => state.themeMode);
  const refreshResolvedTheme = usePreferencesStore((state) => state.refreshResolvedTheme);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    applyDocumentTheme(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (themeMode !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", refreshResolvedTheme);
    return () => mediaQuery.removeEventListener("change", refreshResolvedTheme);
  }, [refreshResolvedTheme, themeMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={language === "zh" ? zhCN : enUS}
        theme={createAntdTheme(resolvedTheme)}
      >
        <AntdRuntimeApp>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AntdRuntimeApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
