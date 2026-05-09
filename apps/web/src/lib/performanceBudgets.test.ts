import { clearTelemetryEvents, getTelemetryEvents } from "./telemetry";
import {
  getPerformanceBudgetSummary,
  ratePerformanceMetric,
  recordPerformanceMetric,
} from "./performanceBudgets";

describe("performanceBudgets", () => {
  beforeEach(() => clearTelemetryEvents());

  it("rates Web Vitals and bundle metrics against shared budgets", () => {
    expect(ratePerformanceMetric("LCP", 1800).rating).toBe("good");
    expect(ratePerformanceMetric("INP", 350).rating).toBe("needs-improvement");
    expect(ratePerformanceMetric("CLS", 0.4).rating).toBe("poor");
    expect(ratePerformanceMetric("JS_BUNDLE_KB", 650)).toMatchObject({
      budget: expect.objectContaining({ unit: "kb" }),
      rating: "needs-improvement",
    });
  });

  it("summarizes whether a page stays inside the performance budget", () => {
    const results = [
      ratePerformanceMetric("LCP", 2100),
      ratePerformanceMetric("INP", 250),
      ratePerformanceMetric("CLS", 0.3),
    ];

    expect(getPerformanceBudgetSummary(results)).toEqual({
      goodCount: 1,
      needsImprovementCount: 1,
      passed: false,
      poorCount: 1,
    });
  });

  it("records sanitized performance telemetry events", () => {
    recordPerformanceMetric("LCP", 2600);

    expect(getTelemetryEvents()).toEqual([
      expect.objectContaining({
        name: "performance_metric_recorded",
        payload: {
          metric: "LCP",
          rating: "needs-improvement",
          unit: "ms",
          value: 2600,
        },
      }),
    ]);
  });
});
