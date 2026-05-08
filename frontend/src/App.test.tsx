import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { App } from "./App";

vi.mock("./components/ProductScene", () => ({
  ProductScene: () => <div data-testid="product-scene" />,
}));

function renderApp(route = "/") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("App", () => {
  it("renders the home route", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", { level: 1, name: "LumaDock" }, { timeout: 5_000 }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /Explore products/i }, { timeout: 5_000 }),
    ).toBeInTheDocument();
  });

  it("renders the learning chapter route", async () => {
    renderApp("/learn");

    expect(
      await screen.findByRole("heading", { name: "从产品界面学前端工程" }, { timeout: 5_000 }),
    ).toBeInTheDocument();
    expect(await screen.findByText("03 React 工程", {}, { timeout: 5_000 })).toBeInTheDocument();
  });
});
