import type { Decorator, Preview } from "@storybook/react-vite";

import "./preview.css";

const previewWidths = {
  auto: "100%",
  desktop: "1120px",
  mobile: "390px",
  tablet: "768px",
} as const;

const withDesignSystemShell: Decorator = (Story, context) => {
  const theme = context.globals.theme === "dark" ? "dark" : "light";
  const previewWidth =
    previewWidths[context.globals.previewWidth as keyof typeof previewWidths] ??
    previewWidths.auto;

  return (
    <div className="storybook-root" data-theme={theme}>
      <div className="storybook-frame" style={{ maxWidth: previewWidth }}>
        <Story />
      </div>
    </div>
  );
};

const preview: Preview = {
  decorators: [withDesignSystemShell],
  globalTypes: {
    previewWidth: {
      defaultValue: "auto",
      name: "Width",
      toolbar: {
        icon: "browser",
        items: [
          { title: "Auto", value: "auto" },
          { title: "Mobile", value: "mobile" },
          { title: "Tablet", value: "tablet" },
          { title: "Desktop", value: "desktop" },
        ],
      },
    },
    theme: {
      defaultValue: "light",
      name: "Theme",
      toolbar: {
        icon: "circlehollow",
        items: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
      },
    },
  },
  parameters: {
    a11y: {
      test: "todo",
    },
    controls: {
      expanded: true,
    },
    layout: "fullscreen",
  },
};

export default preview;
