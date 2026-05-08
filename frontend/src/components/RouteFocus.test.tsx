import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { RouteFocus } from "./RouteFocus";

describe("RouteFocus", () => {
  it("moves focus to the main content region", async () => {
    render(
      <MemoryRouter>
        <Link to="/next">Next route</Link>
        <main id="main-content" tabIndex={-1} />
        <RouteFocus />
      </MemoryRouter>,
    );

    await userEvent.click(document.querySelector("a")!);
    await waitFor(() => expect(document.activeElement).toHaveAttribute("id", "main-content"));
  });
});
