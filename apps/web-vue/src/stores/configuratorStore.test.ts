import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import {
  defaultPriorityOrder,
  normalizePriorityOrder,
  useConfiguratorStore,
} from "./configuratorStore";

describe("configuratorStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("normalizes priority ids and appends missing known ids", () => {
    expect(
      normalizePriorityOrder(["stand", "stand", "unknown", "finish"]),
    ).toEqual(["stand", "finish", "profile", "engraving"]);
  });

  it("calculates estimates from selected options", () => {
    const store = useConfiguratorStore();
    store.setFinish("cobalt");
    store.setStand("wall");
    store.setPlan("team");
    store.setEngraving(true);

    expect(store.estimate(100)).toBe(298);
    expect(store.snapshot().priorityOrder).toEqual(defaultPriorityOrder);
  });
});
