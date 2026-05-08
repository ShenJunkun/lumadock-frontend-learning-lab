export type CssStrategyId =
  | "antd-tokens"
  | "emotion"
  | "styled-components"
  | "tailwind-global";

export type CssStrategy = {
  id: CssStrategyId;
  label: string;
  role: string;
  suitableFor: string[];
  currentProjectPolicy: "default" | "supporting" | "study-only";
};

export const cssStrategies: CssStrategy[] = [
  {
    id: "tailwind-global",
    label: "Tailwind + global.css",
    role: "Default styling system",
    suitableFor: ["responsive layout", "product page composition", "design variables"],
    currentProjectPolicy: "default",
  },
  {
    id: "antd-tokens",
    label: "Antd token system",
    role: "Component library theming",
    suitableFor: ["admin tables", "modals and notifications", "light and dark theme tokens"],
    currentProjectPolicy: "supporting",
  },
  {
    id: "emotion",
    label: "Emotion",
    role: "CSS-in-JS option",
    suitableFor: ["css prop workflows", "object styles", "design-system-heavy React apps"],
    currentProjectPolicy: "study-only",
  },
  {
    id: "styled-components",
    label: "styled-components",
    role: "CSS-in-JS option",
    suitableFor: ["component-scoped styling", "runtime theme objects", "shared component APIs"],
    currentProjectPolicy: "study-only",
  },
];

export function getDefaultCssStrategy() {
  return cssStrategies.find((strategy) => strategy.currentProjectPolicy === "default");
}

export function getStudyOnlyCssStrategies() {
  return cssStrategies.filter((strategy) => strategy.currentProjectPolicy === "study-only");
}
