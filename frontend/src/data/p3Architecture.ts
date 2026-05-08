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

export type PackageBoundaryId =
  | "apps-api"
  | "apps-web"
  | "packages-api-client"
  | "packages-ui";

export type PackageBoundary = {
  id: PackageBoundaryId;
  label: string;
  currentSource: string;
  futureLocation: string;
  responsibility: string;
  canDependOn: PackageBoundaryId[];
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

export const architectureMode = "teaching-prototype";

export const packageBoundaries: PackageBoundary[] = [
  {
    id: "apps-web",
    label: "apps/web",
    currentSource: "frontend/",
    futureLocation: "apps/web",
    responsibility: "Vite React app, routes, pages, frontend tests, and web build scripts.",
    canDependOn: ["packages-ui", "packages-api-client"],
  },
  {
    id: "apps-api",
    label: "apps/api",
    currentSource: "backend/",
    futureLocation: "apps/api",
    responsibility: "FastAPI app, SQLite models, OpenAPI contract, and backend tests.",
    canDependOn: [],
  },
  {
    id: "packages-ui",
    label: "packages/ui",
    currentSource: "packages/ui",
    futureLocation: "packages/ui",
    responsibility: "Shared presentational components and design-system adapters.",
    canDependOn: [],
  },
  {
    id: "packages-api-client",
    label: "packages/api-client",
    currentSource: "frontend/src/api",
    futureLocation: "packages/api-client",
    responsibility: "Typed API client, request error helpers, and contract schemas.",
    canDependOn: [],
  },
];

export function getDefaultCssStrategy() {
  return cssStrategies.find((strategy) => strategy.currentProjectPolicy === "default");
}

export function getStudyOnlyCssStrategies() {
  return cssStrategies.filter((strategy) => strategy.currentProjectPolicy === "study-only");
}

export function isFullMonorepoMigrationPlannedNow() {
  return false;
}

export function getPackageBoundary(id: PackageBoundaryId) {
  return packageBoundaries.find((boundary) => boundary.id === id);
}
