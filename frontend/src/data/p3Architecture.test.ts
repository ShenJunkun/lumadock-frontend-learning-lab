import {
  cssStrategies,
  getDefaultCssStrategy,
  getStudyOnlyCssStrategies,
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
