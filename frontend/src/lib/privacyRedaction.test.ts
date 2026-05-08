import { redactSensitiveData, redactText } from "./privacyRedaction";

describe("privacyRedaction", () => {
  it("redacts emails and bearer tokens inside text", () => {
    expect(redactText("Email ada@example.com with Bearer secret-token")).toBe(
      "Email [redacted-email] with Bearer [redacted-token]",
    );
  });

  it("redacts sensitive object fields recursively", () => {
    expect(
      redactSensitiveData({
        details: {
          email: "ada@example.com",
          name: "Ada",
        },
        message: "Please call me",
        route: "/book",
      }),
    ).toEqual({
      details: {
        email: "[redacted]",
        name: "[redacted]",
      },
      message: "[redacted]",
      route: "/book",
    });
  });
});
