import { describe, expect, it } from "vitest";

import { buildJsonHeaders, readPorts, withUpdatedName } from "./04-spread-and-optional";

const describeExercise = process.env.RUN_EXERCISES === "true" ? describe : describe.skip;

describeExercise("04 spread and optional", () => {
  it("builds headers with conditional spread and caller overrides", () => {
    expect(buildJsonHeaders({ token: "abc" })).toEqual({
      Authorization: "Bearer abc",
      "Content-Type": "application/json",
    });

    expect(buildJsonHeaders({ headers: { "Content-Type": "text/plain", "X-App": "lab" } })).toEqual(
      {
        "Content-Type": "text/plain",
        "X-App": "lab",
      },
    );
  });

  it("reads nested optional values", () => {
    expect(readPorts({ id: "dock", name: "Dock", specs: { ports: "USB-C" } })).toBe("USB-C");
    expect(readPorts({ id: "dock", name: "Dock" })).toBe("Not listed");
    expect(readPorts()).toBe("Not listed");
  });

  it("updates objects without mutating the original", () => {
    const original = { id: "dock", name: "Dock", specs: { weight: "1kg" } };
    const updated = withUpdatedName(original, "Luma Dock");

    expect(updated).toEqual({ id: "dock", name: "Luma Dock", specs: { weight: "1kg" } });
    expect(original.name).toBe("Dock");
  });
});
