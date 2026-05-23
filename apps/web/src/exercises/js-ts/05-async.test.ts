import { describe, expect, it } from "vitest";

import { fetchProductName, fetchWithFallback } from "./05-async";

const describeExercise = process.env.RUN_EXERCISES === "true" ? describe : describe.skip;

describeExercise("05 async", () => {
  it("awaits a fetch-like function and narrows unknown data", async () => {
    await expect(
      fetchProductName(async () => ({ id: "dock", name: "Luma Dock" }), "dock"),
    ).resolves.toBe("Luma Dock");
  });

  it("rejects invalid async data", async () => {
    await expect(fetchProductName(async () => ({ id: "dock", name: 123 }), "dock")).rejects.toThrow(
      "Invalid product response.",
    );
  });

  it("returns a fallback when an async operation fails", async () => {
    await expect(fetchWithFallback(async () => "live", "fallback")).resolves.toBe("live");
    await expect(
      fetchWithFallback(async () => {
        throw new Error("Network unavailable.");
      }, "fallback"),
    ).resolves.toBe("fallback");
  });
});
