import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getProduct, getProducts, prefetchProductDetail, productQueryKeys } from "./products";
import { setAuthTokenProvider } from "./client";
import { fallbackProducts } from "../data/fallbackProducts";

describe("product api client", () => {
  afterEach(() => {
    setAuthTokenProvider(() => null);
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("loads products from the configured API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(fallbackProducts), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getProducts()).resolves.toHaveLength(3);
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8001/api/products", expect.any(Object));
  });

  it("throws on missing detail responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: "Product not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(getProduct("missing")).rejects.toThrow("Product not found");
  });

  it("adds a bearer token when one is available", async () => {
    setAuthTokenProvider(() => "demo-token");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(fallbackProducts), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

    await getProducts();

    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8001/api/products",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer demo-token",
        }),
      }),
    );
  });

  it("uses stable query keys for product list and detail cache entries", () => {
    expect(productQueryKeys.list()).toEqual(["products"]);
    expect(productQueryKeys.detail("lumadock-studio")).toEqual(["products", "lumadock-studio"]);
    expect(productQueryKeys.stats()).toEqual(["stats"]);
  });

  it("prefetches product detail data into the React Query cache", async () => {
    const product = fallbackProducts[0];
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(product), {
          headers: { "Content-Type": "application/json" },
          status: 200,
        }),
      ),
    );

    await prefetchProductDetail(queryClient, product.id);

    expect(fetch).toHaveBeenCalledWith(
      `http://127.0.0.1:8001/api/products/${product.id}`,
      expect.any(Object),
    );
    expect(queryClient.getQueryData(productQueryKeys.detail(product.id))).toMatchObject({
      id: product.id,
      name: product.name,
    });
  });
});
