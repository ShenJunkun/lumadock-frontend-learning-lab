import type { ThemeConfig } from "antd";

export const antdTheme: ThemeConfig = {
  token: {
    borderRadius: 8,
    colorBgBase: "#f7f8fa",
    colorError: "#f15a4a",
    colorInfo: "#525ddc",
    colorPrimary: "#16a3a3",
    colorSuccess: "#1f8f57",
    colorText: "#151922",
    colorTextSecondary: "#5a6472",
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
      borderColor: "#d9e0e3",
      headerBg: "#eef2f3",
      rowHoverBg: "#f1fbfa",
    },
  },
};
