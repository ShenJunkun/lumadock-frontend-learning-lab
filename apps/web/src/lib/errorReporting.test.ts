import {
  clearClientErrorReports,
  getClientErrorReports,
  reportClientError,
} from "./errorReporting";

describe("errorReporting", () => {
  beforeEach(() => clearClientErrorReports());

  it("records client errors with redacted message and context", () => {
    const report = reportClientError(new Error("Failed for ada@example.com"), {
      email: "ada@example.com",
      route: "/book",
      token: "secret",
    });

    expect(report).toMatchObject({
      context: {
        email: "[redacted]",
        route: "/book",
        token: "[redacted]",
      },
      message: "Failed for [redacted-email]",
      name: "Error",
    });
    expect(getClientErrorReports()).toHaveLength(1);
  });
});
