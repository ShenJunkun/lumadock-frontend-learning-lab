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
    status: "Completed",
    evidence: "Document CSP and redact sensitive data from local error reporting.",
  },
  {
    id: "visual-regression",
    label: "Visual regression",
    status: "Completed",
    evidence: "Protect key pages with Playwright screenshot baselines across desktop and mobile.",
  },
  {
    id: "design-system",
    label: "Design system depth",
    status: "Completed",
    evidence: "Shared tokens and primitives live in @lumadock/ui and are consumed by the web app.",
  },
  {
    id: "state-modeling",
    label: "State modeling",
    status: "Completed",
    evidence: "Lead submission uses an explicit reducer for idle, submitting, success, and error.",
  },
];

export function getP5LearningMilestone(id: P5LearningMilestone["id"]) {
  return p5LearningMilestones.find((milestone) => milestone.id === id);
}
