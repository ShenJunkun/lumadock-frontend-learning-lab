export type P5LearningStatus = "Completed" | "Planned";

export type P5LearningMilestone = {
  id:
    | "design-system"
    | "performance-budgets"
    | "pwa-offline"
    | "security-privacy"
    | "state-modeling"
    | "visual-regression";
  label: string;
  status: P5LearningStatus;
  evidence: string;
};

export const p5LearningMilestones: P5LearningMilestone[] = [
  {
    id: "pwa-offline",
    label: "PWA / offline shell",
    status: "Completed",
    evidence: "Manifest, offline page, service worker, and production-only registration guard.",
  },
  {
    id: "performance-budgets",
    label: "Web Vitals / budgets",
    status: "Completed",
    evidence: "Define frontend budgets for runtime metrics and bundle growth.",
  },
  {
    id: "security-privacy",
    label: "Security and privacy",
    status: "Planned",
    evidence: "Document CSP and redact sensitive data from local error reporting.",
  },
  {
    id: "visual-regression",
    label: "Visual regression",
    status: "Planned",
    evidence: "Protect key pages with Playwright screenshot baselines in a later pass.",
  },
  {
    id: "design-system",
    label: "Design system depth",
    status: "Planned",
    evidence: "Move more token examples and component states into @lumadock/ui over time.",
  },
  {
    id: "state-modeling",
    label: "State modeling",
    status: "Planned",
    evidence: "Use reducers or state machines for complex workflows when form logic grows.",
  },
];

export function getP5LearningMilestone(id: P5LearningMilestone["id"]) {
  return p5LearningMilestones.find((milestone) => milestone.id === id);
}
