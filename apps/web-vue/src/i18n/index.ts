import { createI18n } from "vue-i18n";

import { getInitialLanguage } from "../stores/preferencesStore";
import { resources } from "./resources";

export const i18n = createI18n({
  fallbackLocale: "en",
  legacy: false,
  locale: getInitialLanguage(),
  messages: resources,
});

export default i18n;
