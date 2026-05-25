import { render, screen, within } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import ConfiguratorPanel from "./ConfiguratorPanel.vue";

describe("ConfiguratorPanel", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("updates selections and reorders priorities", async () => {
    const user = userEvent.setup();
    render(ConfiguratorPanel, {
      global: {
        plugins: [createPinia()],
      },
      props: {
        basePrice: 100,
      },
    });

    await user.click(screen.getByRole("button", { name: "Cobalt" }));
    await user.click(screen.getByRole("button", { name: "Wall" }));
    await user.click(screen.getByRole("button", { name: "Team" }));
    await user.click(screen.getByLabelText("Personal engraving"));

    expect(screen.getByText("$298")).toBeInTheDocument();

    const priorityList = screen.getByRole("list", {
      name: "Configuration priority",
    });
    await user.click(
      within(priorityList).getByRole("button", {
        name: "Move Profile earlier",
      }),
    );

    expect(within(priorityList).getAllByRole("listitem")[1]).toHaveTextContent(
      "Profile",
    );
  });
});
