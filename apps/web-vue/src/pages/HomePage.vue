<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import {
  ArrowRight,
  CalendarDays,
  Cpu,
  Gauge,
  ShieldCheck,
} from "lucide-vue-next";
import { computed } from "vue";

import { getProducts, getStats, productQueryKeys } from "../api/products";
import ConfiguratorPanel from "../components/ConfiguratorPanel.vue";
import ProductCard from "../components/ProductCard.vue";
import ProductScene from "../components/ProductScene.vue";
import ProductSceneBoundary from "../components/ProductSceneBoundary.vue";
import ResponsiveProductImage from "../components/ResponsiveProductImage.vue";
import { ProductGridSkeleton } from "../components/SkeletonStates";
import { ErrorState, LoadingState } from "../components/StateBlocks";
import { fallbackProducts } from "../data/fallbackProducts";

const featureTiles = [
  {
    icon: Cpu,
    title: "Adaptive port memory",
    copy: "Profiles keep desk, travel, and studio devices ready.",
  },
  {
    icon: Gauge,
    title: "Focused status surface",
    copy: "Subtle light states show power, sync, and display flow.",
  },
  {
    icon: ShieldCheck,
    title: "Local-first demo",
    copy: "The app talks only to the local FastAPI service.",
  },
];

const productsQuery = useQuery({
  queryFn: getProducts,
  queryKey: productQueryKeys.list(),
});
const statsQuery = useQuery({
  queryFn: getStats,
  queryKey: productQueryKeys.stats(),
});

const products = computed(() =>
  productsQuery.data.value?.length
    ? productsQuery.data.value
    : fallbackProducts,
);
const featured = computed(() => products.value[0]);
</script>

<template>
  <section class="hero-section">
    <div class="hero-copy">
      <span class="eyebrow">Product showcase platform</span>
      <h1>LumaDock</h1>
      <p>
        A refined desktop docking system for focused work, rich product
        storytelling, and hands-on frontend learning.
      </p>
      <div class="hero-actions">
        <RouterLink class="primary-button" to="/products">
          <span>Explore products</span>
          <ArrowRight :size="18" aria-hidden="true" />
        </RouterLink>
        <RouterLink class="secondary-button" to="/book">
          <CalendarDays :size="18" aria-hidden="true" />
          <span>Book a demo</span>
        </RouterLink>
      </div>
      <dl class="metric-strip">
        <div>
          <dt>Products</dt>
          <dd>{{ statsQuery.data.value?.products ?? products.length }}</dd>
        </div>
        <div>
          <dt>Avg price</dt>
          <dd>
            ${{ Math.round(statsQuery.data.value?.average_price ?? 302) }}
          </dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>Vue</dd>
        </div>
      </dl>
    </div>
    <div class="hero-media" aria-label="LumaDock product render">
      <ResponsiveProductImage
        src="/assets/lumadock-hero.png"
        alt="LumaDock desktop dock product render"
        loading="eager"
        sizes="(max-width: 980px) 100vw, 58vw"
      />
    </div>
  </section>

  <section class="section section-tight">
    <div class="section-heading">
      <span class="eyebrow">Interaction model</span>
      <h2>Built for visual product learning</h2>
    </div>
    <div class="feature-grid">
      <article
        v-for="tile in featureTiles"
        :key="tile.title"
        class="feature-card"
      >
        <component :is="tile.icon" :size="22" aria-hidden="true" />
        <h3>{{ tile.title }}</h3>
        <p>{{ tile.copy }}</p>
      </article>
    </div>
  </section>

  <section class="section showcase-layout">
    <div class="showcase-copy">
      <span class="eyebrow">Live 3D preview</span>
      <h2>Rotate the product surface through code.</h2>
      <p>
        Three.js renders a lightweight product model while Vue keeps the
        interaction state in sync.
      </p>
      <LoadingState
        v-if="productsQuery.isLoading.value"
        title="Loading catalog"
        message="Checking the local API."
      />
      <ErrorState
        v-if="productsQuery.isError.value"
        title="Using local fallback data"
        message="Start the backend on port 8001 to switch this section to SQLite-backed data."
      />
    </div>
    <div class="showcase-stage">
      <ProductSceneBoundary>
        <ProductScene :accent="featured.accent" />
      </ProductSceneBoundary>
    </div>
    <ConfiguratorPanel :base-price="featured.price" />
  </section>

  <section class="section">
    <div class="section-heading row-heading">
      <div>
        <span class="eyebrow">Catalog</span>
        <h2>Choose a LumaDock profile</h2>
      </div>
      <RouterLink class="text-link" to="/products">
        View all
        <ArrowRight :size="16" aria-hidden="true" />
      </RouterLink>
    </div>
    <ProductGridSkeleton
      v-if="productsQuery.isLoading.value && !productsQuery.data.value"
      label="Loading featured products"
    />
    <div v-else class="product-grid">
      <ProductCard
        v-for="product in products.slice(0, 3)"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>
