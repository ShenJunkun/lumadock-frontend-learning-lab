import type { Product, Stats } from "@lumadock/api-client";
import type { QueryClient } from "@tanstack/vue-query";

import { lumadockApiClient } from "./client";

export const productQueryKeys = {
  detail: (productId: string) => ["products", productId] as const,
  list: () => ["products"] as const,
  stats: () => ["stats"] as const,
};

export async function getProducts(): Promise<Product[]> {
  return lumadockApiClient.getProducts();
}

export async function getProduct(productId: string): Promise<Product> {
  return lumadockApiClient.getProduct(productId);
}

export async function getStats(): Promise<Stats> {
  return lumadockApiClient.getStats();
}

export function prefetchProductDetail(
  queryClient: QueryClient,
  productId: string,
) {
  return queryClient.prefetchQuery({
    queryFn: () => getProduct(productId),
    queryKey: productQueryKeys.detail(productId),
  });
}
