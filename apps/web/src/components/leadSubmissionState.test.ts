import { createLeadSubmissionState, leadSubmissionReducer } from "./leadSubmissionState";

describe("leadSubmissionReducer", () => {
  it("models the happy path explicitly", () => {
    const submitting = leadSubmissionReducer(createLeadSubmissionState("lumadock-studio"), {
      productId: "lumadock-studio",
      type: "submit",
    });

    expect(submitting).toMatchObject({
      message: null,
      productId: "lumadock-studio",
      status: "submitting",
    });

    expect(
      leadSubmissionReducer(submitting, {
        message: "Request saved locally.",
        type: "succeed",
      }),
    ).toMatchObject({
      message: "Request saved locally.",
      status: "success",
    });
  });

  it("keeps the product context for failures and resets", () => {
    const failed = leadSubmissionReducer(createLeadSubmissionState("lumadock-air"), {
      message: "Could not reach the local API.",
      type: "fail",
    });

    expect(failed).toMatchObject({
      message: "Could not reach the local API.",
      productId: "lumadock-air",
      status: "error",
    });

    expect(leadSubmissionReducer(failed, { type: "reset" })).toEqual(
      createLeadSubmissionState("lumadock-air"),
    );
  });
});
