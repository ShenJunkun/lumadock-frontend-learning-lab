import { describe, expect, it } from "vitest";

import { leadFormSchema } from "./LeadForm";

describe("lead form validation", () => {
  it("accepts a valid local booking request", () => {
    const result = leadFormSchema.safeParse({
      productId: "lumadock-studio",
      name: "Grace Hopper",
      email: "grace@example.com",
      company: "Compiler Labs",
      role: "Engineer",
      message: "Looking at the Studio setup.",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("requires a real email and local storage consent", () => {
    const result = leadFormSchema.safeParse({
      productId: "lumadock-studio",
      name: "G",
      email: "not-an-email",
      consent: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email?.[0]).toMatch(/valid email/i);
      expect(result.error.flatten().fieldErrors.consent?.[0]).toMatch(/local demo/i);
    }
  });
});

