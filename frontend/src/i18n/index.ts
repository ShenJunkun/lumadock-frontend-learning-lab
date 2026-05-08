import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { getInitialLanguage } from "../store/preferencesStore";
import { resources } from "./resources";

void i18n.use(initReactI18next).init({
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  lng: getInitialLanguage(),
  resources,
  returnNull: false,
});

export default i18n;
