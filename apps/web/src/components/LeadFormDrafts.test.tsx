import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitLead } from "../api/leads";
import { readBookingDraft, writeBookingDraft } from "../lib/bookingDrafts";
import { LeadForm } from "./LeadForm";

vi.mock("../api/leads", () => ({
  submitLead: vi.fn(),
}));

const submitLeadMock = vi.mocked(submitLead);

function renderLeadForm(productId = "lumadock-studio") {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LeadForm productId={productId} />
    </QueryClientProvider>,
  );
}

describe("LeadForm drafts", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    submitLeadMock.mockResolvedValue({} as Awaited<ReturnType<typeof submitLead>>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("restores a same-product booking draft", () => {
    writeBookingDraft("lumadock-studio", {
      company: "Compiler Labs",
      consent: true,
      email: "grace@example.com",
      message: "Need a recovered draft.",
      name: "Grace Hopper",
      role: "Engineer",
    });

    renderLeadForm("lumadock-studio");

    expect(screen.getByLabelText("Name")).toHaveValue("Grace Hopper");
    expect(screen.getByLabelText("Email")).toHaveValue("grace@example.com");
    expect(screen.getByLabelText(/local demo/i)).toBeChecked();
  });

  it("does not restore drafts across products", () => {
    writeBookingDraft("lumadock-air", {
      consent: true,
      email: "air@example.com",
      name: "Air User",
    });

    renderLeadForm("lumadock-studio");

    expect(screen.getByLabelText("Name")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
  });

  it("clears the current product draft after successful submission", async () => {
    writeBookingDraft("lumadock-studio", {
      consent: true,
      email: "grace@example.com",
      name: "Grace Hopper",
    });
    renderLeadForm("lumadock-studio");

    await userEvent.click(screen.getByRole("button", { name: /send request/i }));

    await waitFor(() => expect(submitLeadMock).toHaveBeenCalled());
    await waitFor(() => expect(readBookingDraft("lumadock-studio")).toBeNull());
  });
});
