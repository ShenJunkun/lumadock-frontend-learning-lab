import { trackEvent } from "./telemetry";

export type PerformanceMetricName = "CLS" | "INP" | "JS_BUNDLE_KB" | "LCP";

export type PerformanceBudget = {
  good: number;
  max: number;
  unit: "kb" | "ms" | "score";
};

export type PerformanceRating = "good" | "needs-improvement" | "poor";

export type PerformanceMetricResult = {
  budget: PerformanceBudget;
  name: PerformanceMetricName;
  rating: PerformanceRating;
  value: number;
};

export const performanceBudgets: Record<PerformanceMetricName, PerformanceBudget> = {
  CLS: {
    good: 0.1,
    max: 0.25,
    unit: "score",
  },
  INP: {
    good: 200,
    max: 500,
    unit: "ms",
  },
  JS_BUNDLE_KB: {
    good: 500,
    max: 900,
    unit: "kb",
  },
  LCP: {
    good: 2500,
    max: 4000,
    unit: "ms",
  },
};

export function ratePerformanceMetric(
  name: PerformanceMetricName,
  value: number,
): PerformanceMetricResult {
  const budget = performanceBudgets[name];
  const rating: PerformanceRating =
    value <= budget.good ? "good" : value <= budget.max ? "needs-improvement" : "poor";

  return {
    budget,
    name,
    rating,
    value,
  };
}

export function recordPerformanceMetric(name: PerformanceMetricName, value: number) {
  const result = ratePerformanceMetric(name, value);
  trackEvent("performance_metric_recorded", {
    metric: result.name,
    rating: result.rating,
    unit: result.budget.unit,
    value: result.value,
  });
  return result;
}

export function getPerformanceBudgetSummary(results: PerformanceMetricResult[]) {
  const poorCount = results.filter((result) => result.rating === "poor").length;
  const needsImprovementCount = results.filter(
    (result) => result.rating === "needs-improvement",
  ).length;

  return {
    goodCount: results.length - poorCount - needsImprovementCount,
    needsImprovementCount,
    poorCount,
    passed: poorCount === 0,
  };
}
