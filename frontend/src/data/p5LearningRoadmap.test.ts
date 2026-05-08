import { getP5LearningMilestone, p5LearningMilestones } from "./p5LearningRoadmap";

describe("p5LearningRoadmap", () => {
  it("starts P5 with PWA complete and future mastery topics planned", () => {
    expect(p5LearningMilestones.map((milestone) => milestone.id)).toEqual([
      "pwa-offline",
      "performance-budgets",
      "security-privacy",
      "visual-regression",
      "design-system",
      "state-modeling",
    ]);

    expect(getP5LearningMilestone("pwa-offline")).toMatchObject({
      label: "PWA / offline shell",
      status: "Completed",
    });
    expect(getP5LearningMilestone("performance-budgets")?.status).toBe("Completed");
    expect(getP5LearningMilestone("security-privacy")?.status).toBe("Completed");
  });
});
