<script setup lang="ts">
defineProps<{
  alt: string;
  loading?: "eager" | "lazy";
  sizes?: string;
  src: string;
}>();
</script>

<template>
  <picture>
    <source
      srcset="
        /assets/lumadock-hero-640.webp   640w,
        /assets/lumadock-hero-960.webp   960w,
        /assets/lumadock-hero-1280.webp 1280w
      "
      type="image/webp"
      :sizes="sizes"
    />
    <img :src="src" :alt="alt" :loading="loading" :sizes="sizes" />
  </picture>
</template>
