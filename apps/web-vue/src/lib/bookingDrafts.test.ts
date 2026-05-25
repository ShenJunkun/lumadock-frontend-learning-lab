import { describe, expect, it } from "vitest";

import {
  clearBookingDraft,
  getBookingDraftKey,
  getLeadFormDefaultValues,
  writeBookingDraft,
} from "./bookingDrafts";

describe("bookingDrafts", () => {
  it("writes, reads, and clears drafts per product", () => {
    writeBookingDraft("lumadock-studio", {
      consent: true,
      email: "test@example.com",
      name: "Test User",
    });

    expect(
      window.sessionStorage.getItem(getBookingDraftKey("lumadock-studio")),
    ).toContain("Test User");
    expect(getLeadFormDefaultValues("lumadock-studio").email).toBe(
      "test@example.com",
    );

    clearBookingDraft("lumadock-studio");
    expect(
      window.sessionStorage.getItem(getBookingDraftKey("lumadock-studio")),
    ).toBeNull();
  });
});
