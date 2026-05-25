<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";

import { getProducts, productQueryKeys } from "../api/products";
import LeadForm from "../components/LeadForm.vue";
import ProductScene from "../components/ProductScene.vue";
import ProductSceneBoundary from "../components/ProductSceneBoundary.vue";
import { BookingSkeleton } from "../components/SkeletonStates";
import { ErrorState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

const route = useRoute();
const productsQuery = useQuery({
  queryFn: getProducts,
  queryKey: productQueryKeys.list(),
});
const products = computed(() =>
  productsQuery.data.value?.length
    ? productsQuery.data.value
    : fallbackProducts,
);
const requestedProduct = computed(() =>
  String(route.query.product ?? products.value[0]?.id ?? ""),
);
const selectedId = ref(requestedProduct.value);

watch(requestedProduct, (productId) => {
  selectedId.value = productId;
});

const selectedProduct = computed(
  () =>
    products.value.find((product) => product.id === selectedId.value) ??
    products.value[0],
);
</script>

<template>
  <BookingSkeleton
    v-if="productsQuery.isLoading.value && !productsQuery.data.value"
  />

  <section v-else class="page-section booking-page">
    <div class="section-heading">
      <span class="eyebrow">Booking</span>
      <h1>Reserve a LumaDock walkthrough</h1>
      <p>The submitted lead is stored in the local SQLite database.</p>
    </div>

    <ErrorState
      v-if="productsQuery.isError.value"
      title="Catalog API unavailable"
      message="The form can still be explored, but submission needs FastAPI on port 8001."
    />

    <div class="booking-layout">
      <aside class="booking-summary">
        <label>
          <span>Product</span>
          <select v-model="selectedId">
            <option
              v-for="product in products"
              :key="product.id"
              :value="product.id"
            >
              {{ product.name }}
            </option>
          </select>
        </label>
        <ProductSceneBoundary>
          <ProductScene :accent="selectedProduct.accent" />
        </ProductSceneBoundary>
        <div>
          <span class="eyebrow">{{ selectedProduct.category }}</span>
          <h2>{{ selectedProduct.name }}</h2>
          <p>{{ selectedProduct.tagline }}</p>
        </div>
      </aside>
      <LeadForm :product-id="selectedProduct.id" />
    </div>
  </section>
</template>
