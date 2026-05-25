import { theme as antdThemeAlgorithms } from "ant-design-vue";
import type { ThemeConfig } from "ant-design-vue/es/config-provider/context";

import type { ColorTheme } from "../stores/preferencesStore";

export function createAntdTheme(colorTheme: ColorTheme): ThemeConfig {
  const isDark = colorTheme === "dark";

  return {
    algorithm: isDark
      ? antdThemeAlgorithms.darkAlgorithm
      : antdThemeAlgorithms.defaultAlgorithm,
    token: {
      borderRadius: 8,
      colorBgBase: isDark ? "#101418" : "#f7f8fa",
      colorError: "#f15a4a",
      colorInfo: "#6f7cff",
      colorPrimary: isDark ? "#4bd3cf" : "#087f7f",
      colorSuccess: "#36b36b",
      colorText: isDark ? "#f4f7f8" : "#151922",
      colorTextSecondary: isDark ? "#b7c1c8" : "#5a6472",
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    components: {
      Button: {
        controlHeight: 40,
      },
      Card: {
        borderRadiusLG: 8,
      },
    },
  };
}
