import { describe, expect, it } from "vitest";

import { describeLead, parseRole, readStringConfig } from "./03-types";

const describeExercise = process.env.RUN_EXERCISES === "true" ? describe : describe.skip;

describeExercise("03 types", () => {
  it("parses union roles safely", () => {
    expect(parseRole("admin")).toBe("admin");
    expect(parseRole("viewer")).toBe("viewer");
    expect(parseRole("owner")).toBe("viewer");
  });

  it("handles optional fields and null values differently", () => {
    expect(describeLead({ company: "Acme", productId: "dock" })).toBe("Acme wants dock");
    expect(describeLead({ productId: null })).toBe("Unknown company wants no product yet");
  });

  it("narrows unknown config values before returning them", () => {
    expect(readStringConfig({ finish: "graphite", quantity: 2 }, "finish")).toBe("graphite");
    expect(readStringConfig({ finish: "graphite", quantity: 2 }, "quantity")).toBeUndefined();
    expect(readStringConfig({}, "finish")).toBeUndefined();
  });
});
