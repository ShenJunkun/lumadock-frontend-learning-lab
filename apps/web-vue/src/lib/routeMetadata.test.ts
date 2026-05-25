import { describe, expect, it } from "vitest";

import { applyRouteMetadata, getRouteMetadata } from "./routeMetadata";

describe("routeMetadata", () => {
  it("resolves exact, product, and fallback metadata", () => {
    expect(getRouteMetadata("/").title).toContain("LumaDock");
    expect(getRouteMetadata("/products/lumadock-studio").title).toContain(
      "Product Detail",
    );
    expect(getRouteMetadata("/missing").title).toContain("Page Not Found");
  });

  it("applies title and description", () => {
    applyRouteMetadata({ description: "Desc", title: "Title" });

    expect(document.title).toBe("Title");
    expect(
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content"),
    ).toBe("Desc");
  });
});
