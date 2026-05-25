<script setup lang="ts">
import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { Search } from "lucide-vue-next";
import { computed, ref } from "vue";

import {
  getProducts,
  prefetchProductDetail,
  productQueryKeys,
} from "../api/products";
import ProductCard from "../components/ProductCard.vue";
import { ProductGridSkeleton } from "../components/SkeletonStates";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

const query = ref("");
const queryClient = useQueryClient();
const productsQuery = useQuery({
  queryFn: getProducts,
  queryKey: productQueryKeys.list(),
});
const products = computed(() =>
  productsQuery.data.value?.length
    ? productsQuery.data.value
    : fallbackProducts,
);
const filteredProducts = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  if (!normalizedQuery) {
    return products.value;
  }
  return products.value.filter((product) =>
    [product.name, product.category, product.tagline].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    ),
  );
});

function handleProductIntent(productId: string) {
  void prefetchProductDetail(queryClient, productId);
}
</script>

<template>
  <section class="page-section">
    <div class="section-heading">
      <span class="eyebrow">Product catalog</span>
      <h1>LumaDock lineup</h1>
      <p>Search, compare, and open each detail route.</p>
    </div>

    <label class="search-box">
      <Search :size="18" aria-hidden="true" />
      <span class="visually-hidden">Search products</span>
      <input v-model="query" placeholder="Search by name or category" />
    </label>

    <LoadingState
      v-if="productsQuery.isLoading.value && !productsQuery.data.value"
      title="Loading catalog"
      message="Fetching products from FastAPI."
    />
    <ErrorState
      v-if="productsQuery.isError.value"
      title="Local API unavailable"
      message="Fallback product data is visible so the frontend stays usable."
    />

    <ProductGridSkeleton
      v-if="productsQuery.isLoading.value && !productsQuery.data.value"
      :count="6"
      label="Loading catalog products"
    />
    <div v-else-if="filteredProducts.length" class="product-grid catalog-grid">
      <ProductCard
        v-for="product in filteredProducts"
        :key="product.id"
        :product="product"
        :on-intent="handleProductIntent"
      />
    </div>
    <EmptyState
      v-else
      title="No matching products"
      message="Try another name or category."
    />
  </section>
</template>
