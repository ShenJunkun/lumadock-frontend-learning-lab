import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import {
  applyRouteMetadata,
  getRouteMetadata,
  RouteMetadataManager,
} from "./routeMetadata";

function getMetaDescription() {
  return document.querySelector('meta[name="description"]')?.getAttribute("content");
}

describe("routeMetadata", () => {
  beforeEach(() => {
    document.title = "";
    document.querySelector('meta[name="description"]')?.remove();
  });

  it("returns specific metadata for core routes and product detail routes", () => {
    expect(getRouteMetadata("/products")).toMatchObject({
      title: "Product Catalog | LumaDock",
    });
    expect(getRouteMetadata("/products/lumadock-studio")).toMatchObject({
      title: "Product Detail | LumaDock",
    });
  });

  it("falls back to not found metadata for unknown routes", () => {
    expect(getRouteMetadata("/missing")).toMatchObject({
      title: "Page Not Found | LumaDock",
    });
  });

  it("applies title and description to the document head", () => {
    applyRouteMetadata(getRouteMetadata("/learn"));

    expect(document.title).toBe("Learning Roadmap | LumaDock");
    expect(getMetaDescription()).toContain("frontend learning roadmap");
  });

  it("updates metadata from the active browser route", async () => {
    render(
      <MemoryRouter initialEntries={["/book"]}>
        <RouteMetadataManager />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.title).toBe("Book a Walkthrough | LumaDock"));
    expect(getMetaDescription()).toContain("resilient form workflows");
  });
});
