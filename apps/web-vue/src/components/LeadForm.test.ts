import { VueQueryPlugin } from "@tanstack/vue-query";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import LeadForm from "./LeadForm.vue";

describe("LeadForm", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("validates required local demo consent", async () => {
    const user = userEvent.setup();
    render(LeadForm, {
      global: {
        plugins: [createPinia(), VueQueryPlugin],
      },
      props: {
        productId: "lumadock-studio",
      },
    });

    await user.type(screen.getByLabelText("Name"), "Test User");
    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.click(screen.getByRole("button", { name: /Send request/i }));

    expect(
      await screen.findByText("Confirm that this is a local demo request."),
    ).toBeInTheDocument();
  });
});
