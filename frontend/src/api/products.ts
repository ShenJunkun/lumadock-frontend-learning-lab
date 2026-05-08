import { useQuery, type QueryClient } from "@tanstack/react-query";

import { apiRequest } from "./client";
import { ProductSchema, ProductsSchema, StatsSchema } from "./contracts";
import type { Product, Stats } from "../types/product";

export const productQueryKeys = {
  detail: (productId: string) => ["products", productId] as const,
  list: () => ["products"] as const,
  stats: () => ["stats"] as const,
};

export async function getProducts(): Promise<Product[]> {
  return ProductsSchema.parse(await apiRequest<unknown>("/api/products"));
}

export async function getProduct(productId: string): Promise<Product> {
  return ProductSchema.parse(await apiRequest<unknown>(`/api/products/${productId}`));
}

export async function getStats(): Promise<Stats> {
  return StatsSchema.parse(await apiRequest<unknown>("/api/stats"));
}

export function prefetchProductDetail(queryClient: QueryClient, productId: string) {
  return queryClient.prefetchQuery({
    queryFn: () => getProduct(productId),
    queryKey: productQueryKeys.detail(productId),
  });
}

export function useProducts() {
  return useQuery({
    queryFn: getProducts,
    queryKey: productQueryKeys.list(),
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    enabled: Boolean(productId),
    queryFn: () => getProduct(productId!),
    queryKey: productQueryKeys.detail(productId ?? "unknown"),
  });
}

export function useStats() {
  return useQuery({
    queryFn: getStats,
    queryKey: productQueryKeys.stats(),
  });
}
