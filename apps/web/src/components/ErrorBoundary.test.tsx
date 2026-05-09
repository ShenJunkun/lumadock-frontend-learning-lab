import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "./ErrorBoundary";
import { clearClientErrorReports, getClientErrorReports } from "../lib/errorReporting";

function BrokenWidget() {
  throw new Error("boom");
  return null;
}

describe("ErrorBoundary", () => {
  beforeEach(() => clearClientErrorReports());

  it("renders a recoverable fallback when a child throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <BrokenWidget />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(getClientErrorReports()).toEqual([
      expect.objectContaining({
        message: "boom",
        name: "Error",
      }),
    ]);
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
