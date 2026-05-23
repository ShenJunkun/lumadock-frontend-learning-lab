import { describe, expect, it } from "vitest";

import { buildProductPath, createProductLabel, normalizeBaseUrl } from "./01-modules";

const describeExercise = process.env.RUN_EXERCISES === "true" ? describe : describe.skip;

describeExercise("01 modules", () => {
  it("normalizes base URLs", () => {
    expect(normalizeBaseUrl(" http://127.0.0.1:8001/ ")).toBe("http://127.0.0.1:8001");
    expect(normalizeBaseUrl("http://127.0.0.1:8001")).toBe("http://127.0.0.1:8001");
  });

  it("rejects empty base URLs", () => {
    expect(() => normalizeBaseUrl(" / ")).toThrow("A non-empty API base URL is required.");
  });

  it("builds product API paths with template strings", () => {
    expect(buildProductPath("luma-dock")).toBe("/api/products/luma-dock");
  });

  it("creates product labels from typed objects", () => {
    expect(createProductLabel({ id: "dock", name: "Luma Dock", price: 299 })).toBe(
      "Luma Dock ($299)",
    );
  });
});
