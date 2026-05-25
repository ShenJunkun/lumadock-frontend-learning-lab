<script setup lang="ts">
import type { Product } from "@lumadock/api-client";
import { ArrowRight } from "lucide-vue-next";
import type { CSSProperties } from "vue";

import ResponsiveProductImage from "./ResponsiveProductImage.vue";

const props = defineProps<{
  onIntent?: (productId: string) => void;
  product: Product;
}>();

const accentStyle = {
  "--accent": props.product.accent,
} as CSSProperties;

function handleIntent() {
  props.onIntent?.(props.product.id);
}
</script>

<template>
  <RouterLink
    class="product-card"
    :style="accentStyle"
    :to="`/products/${product.id}`"
    @focus="handleIntent"
    @pointerenter="handleIntent"
  >
    <div class="product-card-media">
      <ResponsiveProductImage
        :src="product.hero_image"
        :alt="`${product.name} product render`"
        loading="lazy"
        sizes="(max-width: 700px) 100vw, 33vw"
      />
    </div>
    <div class="product-card-body">
      <span class="eyebrow">{{ product.category }}</span>
      <h3>{{ product.name }}</h3>
      <p>{{ product.tagline }}</p>
      <div class="product-card-footer">
        <strong>${{ product.price }}</strong>
        <span class="icon-link" aria-hidden="true">
          <ArrowRight :size="16" />
        </span>
      </div>
    </div>
  </RouterLink>
</template>
