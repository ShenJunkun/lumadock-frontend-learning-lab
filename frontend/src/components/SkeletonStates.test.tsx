import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProductGridSkeleton } from "./SkeletonStates";

describe("SkeletonStates", () => {
  it("renders an accessible product grid loading state", () => {
    render(<ProductGridSkeleton count={2} label="Loading catalog products" />);

    expect(screen.getByRole("status", { name: "Loading catalog products" })).toBeInTheDocument();
  });
});
