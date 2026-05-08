import { describe, expect, it } from "vitest";

import {
  AdminLeadsSchema,
  ProductsSchema,
  StatsSchema,
  TokenResponseSchema,
} from "./contracts";
import { fallbackProducts } from "../data/fallbackProducts";

describe("API contracts", () => {
  it("accepts product fixtures", () => {
    expect(ProductsSchema.parse(fallbackProducts)).toHaveLength(3);
  });

  it("accepts auth, stats, and admin lead payload shapes", () => {
    expect(
      TokenResponseSchema.parse({
        access_token: "admin-token",
        token_type: "bearer",
        user: {
          email: "admin@lumadock.local",
          id: 1,
          name: "LumaDock Admin",
          role: "admin",
        },
      }),
    ).toMatchObject({ access_token: "admin-token" });

    expect(
      StatsSchema.parse({
        average_price: 302.33,
        latest_lead_at: null,
        leads: 0,
        products: 3,
      }),
    ).toMatchObject({ products: 3 });

    expect(
      AdminLeadsSchema.parse([
        {
          company: "Demo",
          configuration: { finish: "graphite" },
          created_at: new Date().toISOString(),
          email: "test@example.com",
          id: 1,
          message: "Contract test",
          name: "Test User",
          product_id: "lumadock-studio",
          product_name: "LumaDock Studio",
          role: "Learner",
        },
      ]),
    ).toHaveLength(1);
  });
});
