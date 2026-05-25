import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createApp } from "vue";

import "../../web/src/styles/global.css";
import App from "./App.vue";
import i18n from "./i18n";
import { registerPwaServiceWorker } from "./lib/pwa";
import { router } from "./router";
import { useAuthStore, wireAuthTokenProvider } from "./stores/authStore";

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  await worker.start({ onUnhandledRequest: "bypass" });
}

void enableMocking().then(() => {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  useAuthStore().hydrate();
  wireAuthTokenProvider();
  app.use(VueQueryPlugin);
  app.use(i18n);
  app.use(router);
  app.use(Antd);
  app.mount("#app");
  void registerPwaServiceWorker({ isProduction: import.meta.env.PROD });
});
