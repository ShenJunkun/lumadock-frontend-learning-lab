import { describe, expect, it } from "vitest";

import { mockAdminLeads } from "../mocks/fixtures";
import {
  buildDailyLeadCounts,
  buildFinishLeadCounts,
  buildProductLeadCounts,
} from "./adminInsights";

describe("adminInsights", () => {
  it("builds sorted product, finish, and daily counts", () => {
    expect(buildProductLeadCounts(mockAdminLeads)[0]).toEqual({
      name: "LumaDock Air",
      value: 1,
    });
    expect(buildFinishLeadCounts(mockAdminLeads)).toContainEqual({
      name: "graphite",
      value: 1,
    });
    expect(buildDailyLeadCounts(mockAdminLeads)).toHaveLength(2);
  });
});
