import { getP5LearningMilestone, p5LearningMilestones } from "./p5LearningRoadmap";

describe("p5LearningRoadmap", () => {
  it("tracks P5 mastery topics as completed", () => {
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
    for (const milestone of p5LearningMilestones) {
      expect(milestone.status).toBe("Completed");
    }
  });
});
