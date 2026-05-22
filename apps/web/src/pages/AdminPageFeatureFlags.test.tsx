import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getAdminLeads } from "../api/admin";
import { AdminPage } from "./AdminPage";

vi.mock("../api/admin", () => ({
  getAdminLeads: vi.fn(),
}));

const getAdminLeadsMock = vi.mocked(getAdminLeads);

function renderAdminPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AdminPage />
    </QueryClientProvider>,
  );
}

describe("AdminPage feature flags", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("shows admin insights by default", async () => {
    getAdminLeadsMock.mockResolvedValue([]);

    renderAdminPage();

    await waitFor(() => expect(getAdminLeadsMock).toHaveBeenCalled());
    expect(await screen.findByText("No lead insights yet")).toBeVisible();
  });

  it("hides admin insights when the flag is disabled", async () => {
    vi.stubEnv("VITE_FEATURE_ADMIN_INSIGHTS", "false");
    getAdminLeadsMock.mockResolvedValue([]);

    renderAdminPage();

    await waitFor(() => expect(getAdminLeadsMock).toHaveBeenCalled());
    expect(await screen.findByRole("heading", { name: "Lead activity" })).toBeVisible();
    expect(screen.queryByText("No lead insights yet")).not.toBeInTheDocument();
  });
});
