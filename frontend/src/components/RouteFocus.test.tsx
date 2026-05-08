import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { RouteFocus } from "./RouteFocus";

describe("RouteFocus", () => {
  it("moves focus to the main content region", async () => {
    render(
      <MemoryRouter>
        <main id="main-content" tabIndex={-1} />
        <RouteFocus />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.activeElement).toHaveAttribute("id", "main-content"));
  });
});
