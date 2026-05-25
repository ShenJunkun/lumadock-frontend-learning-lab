<script setup lang="ts">
import {
  CalendarDays,
  GraduationCap,
  Home,
  Layers3,
  LogIn,
  LogOut,
  PackageSearch,
  ShieldCheck,
} from "lucide-vue-next";
import { message } from "ant-design-vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink, useRoute, useRouter } from "vue-router";

import {
  languageOptions,
  themeModeOptions,
  usePreferencesStore,
  type LanguageId,
  type ThemeMode,
} from "../stores/preferencesStore";
import { useAuthStore } from "../stores/authStore";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const preferences = usePreferencesStore();

const navItems = [
  { to: "/", labelKey: "shell.home", icon: Home, end: true },
  { to: "/products", labelKey: "shell.products", icon: PackageSearch },
  { to: "/book", labelKey: "shell.book", icon: CalendarDays },
  { to: "/learn", labelKey: "shell.learn", icon: GraduationCap },
];

const isAuthenticated = computed(() => auth.isAuthenticated);

function isRouteActive(to: string, end?: boolean) {
  return end
    ? route.path === to
    : route.path === to || route.path.startsWith(`${to}/`);
}

function handleLogout() {
  auth.logout();
  void message.success("Logged out.");
  void router.push("/");
}
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <RouterLink class="brand" to="/" aria-label="LumaDock home">
        <span class="brand-mark" aria-hidden="true">
          <Layers3 :size="20" />
        </span>
        <span>LumaDock</span>
      </RouterLink>
      <nav class="site-nav" aria-label="Primary">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ 'is-active': isRouteActive(item.to, item.end) }"
        >
          <component :is="item.icon" :size="17" aria-hidden="true" />
          <span>{{ t(item.labelKey) }}</span>
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated"
          to="/admin"
          class="nav-link"
          :class="{ 'is-active': isRouteActive('/admin', true) }"
        >
          <ShieldCheck :size="17" aria-hidden="true" />
          <span>{{ t("shell.admin") }}</span>
        </RouterLink>

        <RouterLink
          v-if="!isAuthenticated"
          to="/login"
          class="nav-link"
          :class="{ 'is-active': isRouteActive('/login', true) }"
        >
          <LogIn :size="17" aria-hidden="true" />
          <span>{{ t("shell.login") }}</span>
        </RouterLink>
        <button
          v-else
          class="nav-link nav-button"
          type="button"
          @click="handleLogout"
        >
          <LogOut :size="17" aria-hidden="true" />
          <span>{{ t("shell.logout") }}</span>
        </button>

        <div class="shell-controls" aria-label="Preferences">
          <label>
            <span class="visually-hidden">{{ t("shell.language") }}</span>
            <select
              class="preference-select"
              :aria-label="t('shell.language')"
              :value="preferences.language"
              @change="
                preferences.setLanguage(
                  ($event.target as HTMLSelectElement).value as LanguageId,
                )
              "
            >
              <option
                v-for="option in languageOptions"
                :key="option.id"
                :value="option.id"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
          <label>
            <span class="visually-hidden">{{ t("shell.theme") }}</span>
            <select
              class="preference-select"
              :aria-label="t('shell.theme')"
              :value="preferences.themeMode"
              @change="
                preferences.setThemeMode(
                  ($event.target as HTMLSelectElement).value as ThemeMode,
                )
              "
            >
              <option
                v-for="option in themeModeOptions"
                :key="option.id"
                :value="option.id"
              >
                {{ t(option.labelKey) }}
              </option>
            </select>
          </label>
        </div>
      </nav>
    </header>
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
    <footer class="site-footer">
      <span>{{ t("shell.footerLab") }}</span>
      <span>{{ t("shell.footerStack") }}</span>
    </footer>
  </div>
</template>
