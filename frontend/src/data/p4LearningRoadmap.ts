export type P4LearningStatus = "Completed" | "Planned";

export type P4LearningMilestone = {
  id: "data-prefetch" | "form-drafts" | "route-metadata" | "telemetry";
  label: string;
  status: P4LearningStatus;
  evidence: string;
};

export const p4LearningMilestones: P4LearningMilestone[] = [
  {
    id: "route-metadata",
    label: "SEO / route metadata",
    status: "Completed",
    evidence: "Routes update document title and meta description from one metadata registry.",
  },
  {
    id: "telemetry",
    label: "Privacy-safe telemetry",
    status: "Completed",
    evidence: "Track route and booking events without sending PII to external services.",
  },
  {
    id: "data-prefetch",
    label: "Data prefetch",
    status: "Planned",
    evidence: "Prefetch product details when a user signals intent from the catalog.",
  },
  {
    id: "form-drafts",
    label: "Booking form drafts",
    status: "Planned",
    evidence: "Keep current-tab form progress resilient to refreshes and accidental navigation.",
  },
];

export function getP4LearningMilestone(id: P4LearningMilestone["id"]) {
  return p4LearningMilestones.find((milestone) => milestone.id === id);
}
