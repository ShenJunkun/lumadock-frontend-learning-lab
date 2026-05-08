import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { LearnPage } from "./LearnPage";

vi.mock("../components/AntdWorkbenchPreview", () => ({
  AntdWorkbenchPreview: () => <section aria-label="Antd workbench preview" />,
}));

describe("LearnPage", () => {
  it("renders the shared UI package prototype from @lumadock/ui", () => {
    render(<LearnPage />);

    expect(screen.getByRole("heading", { name: "Architecture track" })).toBeInTheDocument();
    expect(screen.getByText("CSS-in-JS comparison")).toBeInTheDocument();
    expect(screen.getByText("Monorepo boundaries")).toBeInTheDocument();
    expect(screen.getByText("Microfrontend decision")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Shared UI package prototype" }),
    ).toBeInTheDocument();
    expect(screen.getByText("packages/ui")).toBeInTheDocument();
    expect(screen.getByText("Consumes shared UI")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Production readiness track" })).toBeInTheDocument();
    expect(screen.getByText("SEO / route metadata")).toBeInTheDocument();
    expect(screen.getByText("Privacy-safe telemetry")).toBeInTheDocument();
    expect(screen.getByText("Data prefetch")).toBeInTheDocument();
  });
});
