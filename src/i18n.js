import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import es from "./locales/es/translation.json";
import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";
import it from "./locales/it/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it }
    },
    lng: localStorage.getItem('language') || "es", // idioma por defecto o guardado
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
