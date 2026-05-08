import { getP4LearningMilestone, p4LearningMilestones } from "./p4LearningRoadmap";

describe("p4LearningRoadmap", () => {
  it("starts P4 with route metadata completed and later production topics planned", () => {
    expect(p4LearningMilestones.map((milestone) => milestone.id)).toEqual([
      "route-metadata",
      "telemetry",
      "data-prefetch",
      "form-drafts",
    ]);

    expect(getP4LearningMilestone("route-metadata")).toMatchObject({
      label: "SEO / route metadata",
      status: "Completed",
    });
    expect(getP4LearningMilestone("telemetry")?.status).toBe("Planned");
  });
});
