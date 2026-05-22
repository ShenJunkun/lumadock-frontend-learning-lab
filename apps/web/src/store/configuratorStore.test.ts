import { beforeEach, describe, expect, it } from "vitest";

import {
  defaultPriorityOrder,
  normalizePriorityOrder,
  useConfiguratorStore,
} from "./configuratorStore";

describe("configurator store", () => {
  beforeEach(() => {
    useConfiguratorStore.setState({
      engraving: false,
      finish: "graphite",
      plan: "studio",
      priorityOrder: defaultPriorityOrder,
      stand: "floating",
    });
  });

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
      priorityOrder: defaultPriorityOrder,
    });
  });

  it("updates and snapshots the configuration priority order", () => {
    const store = useConfiguratorStore.getState();

    store.setPriorityOrder(["profile", "finish", "engraving", "stand"]);

    expect(useConfiguratorStore.getState().priorityOrder).toEqual([
      "profile",
      "finish",
      "engraving",
      "stand",
    ]);
    expect(useConfiguratorStore.getState().snapshot().priorityOrder).toEqual([
      "profile",
      "finish",
      "engraving",
      "stand",
    ]);
  });

  it("normalizes duplicate, invalid, and missing priority ids", () => {
    expect(normalizePriorityOrder(["profile", "missing", "profile", "finish"])).toEqual([
      "profile",
      "finish",
      "stand",
      "engraving",
    ]);
  });
});
