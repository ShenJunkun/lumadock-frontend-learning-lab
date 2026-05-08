import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "./client";
import type { Product, Stats } from "../types/product";

export function getProducts() {
  return apiRequest<Product[]>("/api/products");
}

export function getProduct(productId: string) {
  return apiRequest<Product>(`/api/products/${productId}`);
}

export function getStats() {
  return apiRequest<Stats>("/api/stats");
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
