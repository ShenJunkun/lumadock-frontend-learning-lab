import {
  clearClientErrorReports,
  createMemoryErrorMonitoringAdapter,
  getClientErrorReports,
  reportClientError,
  setErrorMonitoringAdapter,
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

  it("can send redacted reports through a custom monitoring adapter", () => {
    const customMonitor = createMemoryErrorMonitoringAdapter();
    setErrorMonitoringAdapter(customMonitor.adapter);

    reportClientError(new Error("Token failed: Bearer secret-token"), {
      route: "/admin",
      token: "secret-token",
    });

    expect(customMonitor.getReports()).toEqual([
      expect.objectContaining({
        context: { route: "/admin", token: "[redacted]" },
        message: "Token failed: Bearer [redacted-token]",
      }),
    ]);
    expect(getClientErrorReports()).toHaveLength(0);
  });
});
