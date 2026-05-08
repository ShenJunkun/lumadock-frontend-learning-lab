import {
  architectureMode,
  cssStrategies,
  getDefaultCssStrategy,
  getPackageBoundary,
  getStudyOnlyCssStrategies,
  isFullMonorepoMigrationPlannedNow,
  microfrontendDecision,
  p3LearningMilestones,
  packageBoundaries,
  shouldAdoptMicrofrontendsNow,
} from "./p3Architecture";

describe("p3Architecture CSS strategies", () => {
  it("keeps the current styling stack as the default recommendation", () => {
    expect(getDefaultCssStrategy()).toMatchObject({
      id: "tailwind-global",
      label: "Tailwind + global.css",
    });
  });

  it("covers the CSS-in-JS options without making them runtime defaults", () => {
    expect(cssStrategies.map((strategy) => strategy.id)).toEqual([
      "tailwind-global",
      "antd-tokens",
      "emotion",
      "styled-components",
    ]);

    expect(getStudyOnlyCssStrategies().map((strategy) => strategy.id)).toEqual([
      "emotion",
      "styled-components",
    ]);
  });
});

describe("p3Architecture package boundaries", () => {
  it("documents a teaching prototype instead of a full monorepo migration", () => {
    expect(architectureMode).toBe("teaching-prototype");
    expect(isFullMonorepoMigrationPlannedNow()).toBe(false);
  });

  it("keeps app packages depending inward on shared packages", () => {
    expect(packageBoundaries.map((boundary) => boundary.id)).toEqual([
      "apps-web",
      "apps-api",
      "packages-ui",
      "packages-api-client",
    ]);

    expect(getPackageBoundary("apps-web")?.canDependOn).toEqual([
      "packages-ui",
      "packages-api-client",
    ]);
    expect(getPackageBoundary("apps-api")?.canDependOn).toEqual([]);
    expect(getPackageBoundary("packages-ui")?.canDependOn).toEqual([]);
  });
});

describe("p3Architecture microfrontend decision", () => {
  it("records a deliberate decision not to adopt microfrontends yet", () => {
    expect(shouldAdoptMicrofrontendsNow()).toBe(false);
    expect(microfrontendDecision.currentReason).toContain("one small product app");
    expect(microfrontendDecision.adoptWhen).toHaveLength(3);
  });

  it("keeps P3 learning milestones complete and reviewable", () => {
    expect(p3LearningMilestones.map((milestone) => milestone.label)).toEqual([
      "CSS-in-JS comparison",
      "Monorepo boundaries",
      "Shared UI package",
      "Microfrontend decision",
    ]);
    expect(microfrontendDecision.studyOptions.map((option) => option.id)).toEqual([
      "module-federation",
      "single-spa",
    ]);
  });
});
