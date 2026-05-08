import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResponsiveProductImage } from "./ResponsiveProductImage";

describe("ResponsiveProductImage", () => {
  it("renders webp sources for the LumaDock hero image", () => {
    render(
      <ResponsiveProductImage
        alt="LumaDock render"
        src="/assets/lumadock-hero.png"
        sizes="100vw"
      />,
    );

    expect(screen.getByAltText("LumaDock render")).toHaveAttribute(
      "src",
      "/assets/lumadock-hero.png",
    );
    expect(document.querySelector("source")).toHaveAttribute("type", "image/webp");
  });
});
