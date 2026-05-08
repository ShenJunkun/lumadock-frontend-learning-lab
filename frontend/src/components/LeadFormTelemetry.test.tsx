import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitLead } from "../api/leads";
import { clearTelemetryEvents, getTelemetryEvents } from "../lib/telemetry";
import { LeadForm } from "./LeadForm";

vi.mock("../api/leads", () => ({
  submitLead: vi.fn(),
}));

const submitLeadMock = vi.mocked(submitLead);

function renderLeadForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LeadForm productId="lumadock-studio" />
    </QueryClientProvider>,
  );
}

async function fillRequiredFields() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Email"), "ada@example.com");
  await user.click(screen.getByLabelText(/local demo/i));
  return user;
}

describe("LeadForm telemetry", () => {
  beforeEach(() => {
    clearTelemetryEvents();
    submitLeadMock.mockResolvedValue({} as Awaited<ReturnType<typeof submitLead>>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("tracks successful booking submissions without capturing form PII", async () => {
    renderLeadForm();
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => expect(submitLeadMock).toHaveBeenCalled());
    expect(getTelemetryEvents()).toEqual([
      expect.objectContaining({
        name: "booking_submit_succeeded",
        payload: { productId: "lumadock-studio" },
      }),
    ]);
    expect(JSON.stringify(getTelemetryEvents()[0].payload)).not.toContain("Ada");
    expect(JSON.stringify(getTelemetryEvents()[0].payload)).not.toContain("ada@example.com");
  });

  it("tracks failed booking submissions without capturing form PII", async () => {
    submitLeadMock.mockRejectedValueOnce(new Error("network down"));
    renderLeadForm();
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() =>
      expect(getTelemetryEvents()).toEqual([
        expect.objectContaining({
          name: "booking_submit_failed",
          payload: { productId: "lumadock-studio" },
        }),
      ]),
    );
  });
});
