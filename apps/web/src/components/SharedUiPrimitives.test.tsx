import { render, screen } from "@testing-library/react";

import { Button, EmptyState, StatusBadge, SurfaceCard, designTokens } from "@lumadock/ui";

describe("shared UI primitives", () => {
  it("renders accessible primitives with shared token defaults", () => {
    render(
      <SurfaceCard aria-label="Shared card">
        <StatusBadge tone="success">Ready</StatusBadge>
        <EmptyState title="Nothing here" message="Try a different filter." />
        <Button variant="secondary">Continue</Button>
      </SurfaceCard>,
    );

    expect(screen.getByLabelText("Shared card")).toBeVisible();
    expect(screen.getByText("Ready")).toHaveAttribute("data-tone", "success");
    expect(screen.getByRole("button", { name: "Continue" })).toBeVisible();
    expect(screen.getByText("Nothing here")).toBeVisible();
    expect(designTokens.radius.ui).toBe("8px");
  });
});
