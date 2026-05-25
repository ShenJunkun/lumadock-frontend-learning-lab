<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { ArrowRight, CheckCircle2 } from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";

import { getProduct, productQueryKeys } from "../api/products";
import ConfiguratorPanel from "../components/ConfiguratorPanel.vue";
import ProductScene from "../components/ProductScene.vue";
import ProductSceneBoundary from "../components/ProductSceneBoundary.vue";
import { ProductDetailSkeleton } from "../components/SkeletonStates";
import { ErrorState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

const route = useRoute();
const productId = computed(() => String(route.params.productId ?? ""));
const fallbackProduct = computed(() =>
  fallbackProducts.find((product) => product.id === productId.value),
);
const productQuery = useQuery({
  enabled: computed(() => Boolean(productId.value)),
  queryFn: () => getProduct(productId.value),
  queryKey: computed(() =>
    productQueryKeys.detail(productId.value || "unknown"),
  ),
});
const product = computed(
  () => productQuery.data.value ?? fallbackProduct.value,
);
</script>

<template>
  <ProductDetailSkeleton v-if="productQuery.isLoading.value && !product" />

  <section v-else-if="!product" class="page-section">
    <ErrorState
      title="Product not found"
      message="Choose a product from the catalog."
    />
  </section>

  <section v-else class="page-section detail-page">
    <div class="detail-hero">
      <div class="detail-copy">
        <span class="eyebrow">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
        <div class="hero-actions">
          <RouterLink
            class="primary-button"
            :to="`/book?product=${product.id}`"
          >
            <span>Book {{ product.name }}</span>
            <ArrowRight :size="18" aria-hidden="true" />
          </RouterLink>
        </div>
        <ErrorState
          v-if="productQuery.isError.value"
          title="Using fallback detail"
          message="Start FastAPI to read this product from SQLite."
        />
      </div>
      <div class="detail-stage">
        <ProductSceneBoundary>
          <ProductScene :accent="product.accent" />
        </ProductSceneBoundary>
      </div>
    </div>

    <div class="detail-grid">
      <section class="spec-panel">
        <span class="eyebrow">Highlights</span>
        <h2>Product capabilities</h2>
        <ul class="check-list">
          <li v-for="feature in product.features" :key="feature">
            <CheckCircle2 :size="18" aria-hidden="true" />
            <span>{{ feature }}</span>
          </li>
        </ul>
      </section>

      <section class="spec-panel">
        <span class="eyebrow">Specs</span>
        <h2>Desk fit</h2>
        <dl class="spec-list">
          <div v-for="[key, value] in Object.entries(product.specs)" :key="key">
            <dt>{{ key }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
      </section>

      <ConfiguratorPanel :base-price="product.price" />
    </div>
  </section>
</template>
