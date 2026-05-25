<script setup lang="ts">
import { App as AApp, ConfigProvider as AConfigProvider } from "ant-design-vue";
import enUS from "ant-design-vue/es/locale/en_US";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import { computed, nextTick, onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import AppShell from "./components/AppShell.vue";
import { applyRouteMetadata, getRouteMetadata } from "./lib/routeMetadata";
import { trackEvent } from "./lib/telemetry";
import {
  applyDocumentTheme,
  usePreferencesStore,
} from "./stores/preferencesStore";
import { createAntdTheme } from "./theme/antdTheme";

const route = useRoute();
const preferences = usePreferencesStore();
const { locale } = useI18n();
const antLocale = computed(() => (preferences.language === "zh" ? zhCN : enUS));
const antTheme = computed(() => createAntdTheme(preferences.resolvedTheme));

const mediaQuery =
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

watch(
  () => preferences.language,
  (language) => {
    locale.value = language;
  },
  { immediate: true },
);

watch(
  () => preferences.resolvedTheme,
  (theme) => {
    applyDocumentTheme(theme);
  },
  { immediate: true },
);

function handleSystemThemeChange() {
  if (preferences.themeMode === "system") {
    preferences.refreshResolvedTheme();
  }
}

mediaQuery?.addEventListener("change", handleSystemThemeChange);
onBeforeUnmount(() =>
  mediaQuery?.removeEventListener("change", handleSystemThemeChange),
);

watch(
  () => route.path,
  async (pathname) => {
    applyRouteMetadata(getRouteMetadata(pathname));
    trackEvent("route_view", { pathname });
    await nextTick();
    document.querySelector<HTMLElement>("#main-content")?.focus();
  },
  { immediate: true },
);
</script>

<template>
  <AConfigProvider :locale="antLocale" :theme="antTheme">
    <AApp>
      <AppShell>
        <RouterView />
      </AppShell>
    </AApp>
  </AConfigProvider>
</template>
