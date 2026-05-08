import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { LearnPage } from "./LearnPage";

vi.mock("../components/AntdWorkbenchPreview", () => ({
  AntdWorkbenchPreview: () => <section aria-label="Antd workbench preview" />,
}));

describe("LearnPage", () => {
  it("renders the shared UI package prototype from @lumadock/ui", () => {
    render(<LearnPage />);

    expect(
      screen.getByRole("heading", { name: "Shared UI package prototype" }),
    ).toBeInTheDocument();
    expect(screen.getByText("packages/ui")).toBeInTheDocument();
    expect(screen.getByText("Consumes shared UI")).toBeInTheDocument();
  });
});
