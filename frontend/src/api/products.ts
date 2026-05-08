import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "./client";
import { ProductSchema, ProductsSchema, StatsSchema } from "./contracts";
import type { Product, Stats } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  return ProductsSchema.parse(await apiRequest<unknown>("/api/products"));
}

export async function getProduct(productId: string): Promise<Product> {
  return ProductSchema.parse(await apiRequest<unknown>(`/api/products/${productId}`));
}

export async function getStats(): Promise<Stats> {
  return StatsSchema.parse(await apiRequest<unknown>("/api/stats"));
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
}

export function useProduct(productId: string | undefined) {
  return useQuery({
    enabled: Boolean(productId),
    queryKey: ["products", productId],
    queryFn: () => getProduct(productId!),
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
}
