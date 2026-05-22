import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { defaultPriorityOrder, useConfiguratorStore } from "../store/configuratorStore";
import { ConfiguratorPanel } from "./ConfiguratorPanel";

function resetConfiguratorStore() {
  useConfiguratorStore.setState({
    engraving: false,
    finish: "graphite",
    plan: "studio",
    priorityOrder: defaultPriorityOrder,
    stand: "floating",
  });
}

function getPriorityLabels() {
  const priorityList = screen.getByRole("list", { name: "Configuration priority" });

  return within(priorityList)
    .getAllByRole("listitem")
    .map((item) => item.querySelector(".priority-copy strong")?.textContent);
}

describe("ConfiguratorPanel", () => {
  beforeEach(() => {
    resetConfiguratorStore();
  });

  it("keeps selection controls and the estimate working", async () => {
    const user = userEvent.setup();

    render(<ConfiguratorPanel basePrice={200} />);

    expect(screen.getByText("$305")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Cobalt" }));
    await user.click(screen.getByRole("button", { name: "Wall" }));
    await user.click(screen.getByRole("button", { name: "Team" }));
    await user.click(screen.getByRole("checkbox", { name: "Personal engraving" }));

    expect(screen.getByText("$398")).toBeVisible();
    expect(useConfiguratorStore.getState().snapshot()).toMatchObject({
      engraving: true,
      finish: "cobalt",
      plan: "team",
      priorityOrder: defaultPriorityOrder,
      stand: "wall",
    });
  });

  it("moves priority items with keyboard-operable controls", async () => {
    const user = userEvent.setup();

    render(<ConfiguratorPanel basePrice={200} />);

    expect(getPriorityLabels()).toEqual(["Finish", "Stand", "Profile", "Engraving"]);

    screen.getByRole("button", { name: "Move Profile earlier" }).focus();
    await user.keyboard("{Enter}");

    expect(getPriorityLabels()).toEqual(["Finish", "Profile", "Stand", "Engraving"]);
    expect(useConfiguratorStore.getState().priorityOrder).toEqual([
      "finish",
      "profile",
      "stand",
      "engraving",
    ]);
  });
});
