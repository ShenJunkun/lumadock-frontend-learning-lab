<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
</script>

<template>
  <section class="page-section not-found">
    <span class="eyebrow">404</span>
    <h1>Page not found</h1>
    <RouterLink class="secondary-button" to="/">
      <ArrowLeft :size="18" aria-hidden="true" />
      <span>Back home</span>
    </RouterLink>
  </section>
</template>
