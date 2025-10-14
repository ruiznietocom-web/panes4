import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <div className="absolute top-4 right-4 flex gap-2 text-2xl cursor-pointer select-none">
      <span onClick={() => i18n.changeLanguage("es")} role="img" aria-label="Español">🇪🇸</span>
      <span onClick={() => i18n.changeLanguage("en")} role="img" aria-label="English">🇬🇧</span>
      <span onClick={() => i18n.changeLanguage("de")} role="img" aria-label="Deutsch">🇩🇪</span>
      <span onClick={() => i18n.changeLanguage("it")} role="img" aria-label="Italiano">🇮🇹</span>
    </div>
  );
};

export default LanguageSelector;
