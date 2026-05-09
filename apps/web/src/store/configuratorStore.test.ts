import { describe, expect, it } from "vitest";

import { useConfiguratorStore } from "./configuratorStore";

describe("configurator store", () => {
  it("updates selections and computes an estimate", () => {
    const store = useConfiguratorStore.getState();

    store.setFinish("cobalt");
    store.setStand("wall");
    store.setPlan("team");
    store.setEngraving(true);

    expect(useConfiguratorStore.getState().estimate(200)).toBe(398);
    expect(useConfiguratorStore.getState().snapshot()).toMatchObject({
      finish: "cobalt",
      stand: "wall",
      plan: "team",
      engraving: true,
    });
  });
});
