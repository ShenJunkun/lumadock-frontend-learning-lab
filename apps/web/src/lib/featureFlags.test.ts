import { isFeatureEnabled, resolveFeatureFlags } from "./featureFlags";

describe("featureFlags", () => {
  it("keeps admin insights enabled by default", () => {
    expect(resolveFeatureFlags({})).toEqual({ adminInsights: true });
  });

  it("supports explicit environment overrides", () => {
    expect(resolveFeatureFlags({ VITE_FEATURE_ADMIN_INSIGHTS: "false" })).toEqual({
      adminInsights: false,
    });
    expect(isFeatureEnabled("adminInsights", { VITE_FEATURE_ADMIN_INSIGHTS: "on" })).toBe(true);
  });
});
