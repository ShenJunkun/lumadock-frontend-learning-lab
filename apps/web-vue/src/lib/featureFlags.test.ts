import { describe, expect, it } from "vitest";

import { isFeatureEnabled, resolveFeatureFlags } from "./featureFlags";

describe("featureFlags", () => {
  it("parses explicit boolean-like values", () => {
    expect(
      resolveFeatureFlags({ VITE_FEATURE_ADMIN_INSIGHTS: "false" })
        .adminInsights,
    ).toBe(false);
    expect(
      isFeatureEnabled("adminInsights", { VITE_FEATURE_ADMIN_INSIGHTS: "yes" }),
    ).toBe(true);
  });
});
