import { describe, expect, it } from "vitest";

import { buildCatalogSummary, formatPrice, getFeaturedNames } from "./02-js-basics";

const describeExercise = process.env.RUN_EXERCISES === "true" ? describe : describe.skip;

const products = [
  { id: "dock", name: "Dock", price: 299, tags: ["featured", "desk"] },
  { id: "stand", name: "Stand", price: 0, tags: ["desk"] },
  { id: "hub", name: "Hub", price: 129, tags: ["featured"] },
];

describeExercise("02 js basics", () => {
  it("filters and maps featured product names", () => {
    expect(getFeaturedNames(products)).toEqual(["Dock", "Hub"]);
  });

  it("formats prices with a ternary expression", () => {
    expect(formatPrice(products[0])).toBe("$299");
    expect(formatPrice(products[1])).toBe("Free");
  });

  it("builds a catalog summary with template strings", () => {
    expect(buildCatalogSummary(products)).toBe("3 products: Dock, Stand, Hub");
  });
});
