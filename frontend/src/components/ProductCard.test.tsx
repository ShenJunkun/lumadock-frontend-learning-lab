import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { ProductCard } from "./ProductCard";
import { fallbackProducts } from "../data/fallbackProducts";

describe("ProductCard", () => {
  it("signals product intent on pointer and keyboard focus", () => {
    const onIntent = vi.fn();

    render(
      <MemoryRouter>
        <ProductCard product={fallbackProducts[0]} onIntent={onIntent} />
      </MemoryRouter>,
    );

    const link = screen.getByRole("link", { name: /LumaDock Studio/i });
    fireEvent.mouseEnter(link);
    fireEvent.focus(link);

    expect(onIntent).toHaveBeenCalledWith("lumadock-studio");
    expect(onIntent).toHaveBeenCalledTimes(2);
  });
});
