import { theme as antdThemeAlgorithms } from "antd";
import type { ThemeConfig } from "antd";

import type { ColorTheme } from "../store/preferencesStore";

export function createAntdTheme(colorTheme: ColorTheme): ThemeConfig {
  const isDark = colorTheme === "dark";

  return {
    algorithm: isDark ? antdThemeAlgorithms.darkAlgorithm : antdThemeAlgorithms.defaultAlgorithm,
    token: {
      borderRadius: 8,
      colorBgBase: isDark ? "#101418" : "#f7f8fa",
      colorError: "#f15a4a",
      colorInfo: "#6f7cff",
      colorPrimary: "#16a3a3",
      colorSuccess: "#36b36b",
      colorText: isDark ? "#f4f7f8" : "#151922",
      colorTextSecondary: isDark ? "#b7c1c8" : "#5a6472",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
      Button: {
        controlHeight: 40,
        fontWeight: 700,
      },
      Card: {
        borderRadiusLG: 8,
      },
      Table: {
        borderColor: isDark ? "#2f3940" : "#d9e0e3",
        headerBg: isDark ? "#1c242a" : "#eef2f3",
        rowHoverBg: isDark ? "#142426" : "#f1fbfa",
      },
    },
  };
}
