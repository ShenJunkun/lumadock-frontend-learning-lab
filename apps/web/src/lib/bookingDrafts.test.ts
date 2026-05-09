import {
  clearBookingDraft,
  createEmptyLeadFormValues,
  getBookingDraftKey,
  getLeadFormDefaultValues,
  readBookingDraft,
  writeBookingDraft,
} from "./bookingDrafts";

describe("bookingDrafts", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("stores and restores booking drafts by product", () => {
    writeBookingDraft("lumadock-studio", {
      company: "Compiler Labs",
      consent: true,
      email: "grace@example.com",
      message: "Need a studio walkthrough.",
      name: "Grace Hopper",
      role: "Engineer",
    });

    expect(readBookingDraft("lumadock-studio")).toMatchObject({
      company: "Compiler Labs",
      email: "grace@example.com",
      name: "Grace Hopper",
      productId: "lumadock-studio",
    });
    expect(readBookingDraft("lumadock-air")).toBeNull();
  });

  it("clears empty, submitted, or invalid drafts", () => {
    writeBookingDraft("lumadock-studio", createEmptyLeadFormValues("lumadock-studio"));
    expect(readBookingDraft("lumadock-studio")).toBeNull();

    writeBookingDraft("lumadock-studio", { name: "Ada Lovelace" });
    clearBookingDraft("lumadock-studio");
    expect(readBookingDraft("lumadock-studio")).toBeNull();

    window.sessionStorage.setItem(getBookingDraftKey("lumadock-studio"), "{bad-json");
    expect(getLeadFormDefaultValues("lumadock-studio")).toEqual(
      createEmptyLeadFormValues("lumadock-studio"),
    );
    expect(readBookingDraft("lumadock-studio")).toBeNull();
  });
});
