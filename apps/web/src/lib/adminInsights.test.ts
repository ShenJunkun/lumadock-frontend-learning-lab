import { describe, expect, it } from "vitest";

import {
  buildDailyLeadCounts,
  buildFinishLeadCounts,
  buildProductLeadCounts,
} from "./adminInsights";
import type { AdminLead } from "../types/auth";

const leads: AdminLead[] = [
  {
    id: 1,
    company: "Demo",
    configuration: { finish: "graphite" },
    created_at: "2026-05-08T10:00:00.000Z",
    email: "a@example.com",
    message: null,
    name: "Ada",
    product_id: "lumadock-studio",
    product_name: "LumaDock Studio",
    role: null,
  },
  {
    id: 2,
    company: "Demo",
    configuration: { finish: "pearl" },
    created_at: "2026-05-08T12:00:00.000Z",
    email: "b@example.com",
    message: null,
    name: "Grace",
    product_id: "lumadock-air",
    product_name: "LumaDock Air",
    role: null,
  },
  {
    id: 3,
    company: null,
    configuration: { finish: "graphite" },
    created_at: "2026-05-09T12:00:00.000Z",
    email: "c@example.com",
    message: null,
    name: "Katherine",
    product_id: "lumadock-studio",
    product_name: "LumaDock Studio",
    role: null,
  },
];

describe("adminInsights", () => {
  it("builds product, finish, and daily lead counts", () => {
    expect(buildProductLeadCounts(leads)[0]).toEqual({ name: "LumaDock Studio", value: 2 });
    expect(buildFinishLeadCounts(leads)[0]).toEqual({ name: "graphite", value: 2 });
    expect(buildDailyLeadCounts(leads)).toEqual([
      { date: "2026-05-08", leads: 2 },
      { date: "2026-05-09", leads: 1 },
    ]);
  });
});
