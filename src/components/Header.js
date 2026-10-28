import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Globe, ChevronDown, Download, Sparkles } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'es', flag: '/images/banderaespana.png', label: 'Español' },
  { code: 'en', flag: '/images/banderareinounido.png', label: 'English' },
  { code: 'de', flag: '/images/banderaalemania.png', label: 'Deutsch' },
  { code: 'fr', flag: '/images/banderafrancia.png', label: 'Français' },
  { code: 'it', flag: '/images/banderaitalia.png', label: 'Italiano' },
];

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setLangOpen(false);
  };

  const currentLang = languages.find(l => (i18n.language || 'es').startsWith(l.code)) || languages[0];

  return (
    <motion.header
      className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 dark:from-[#181512] dark:via-[#1c1917] dark:to-[#181512] text-white p-4 shadow-xl border-b border-amber-600/30 dark:border-stone-800 relative z-30 transition-colors duration-300"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10 gap-3">

        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-3.5">
          <motion.div
            className="relative p-1 bg-gradient-to-tr from-amber-400/40 to-amber-200/20 rounded-full shadow-lg ring-2 ring-amber-300/40"
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <img
              src={logo}
              alt="Logo PanZen"
              className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-full shadow-inner"
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-stone-950 p-1 rounded-full shadow-md text-[10px]">
              <Sparkles className="w-3 h-3 text-stone-900" />
            </span>
          </motion.div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-serif text-amber-50 drop-shadow-sm">
                {t('header.title')}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-amber-400/20 text-amber-200 border border-amber-300/30">
                Artesanal
              </span>
            </div>
            <p className="text-amber-200/90 font-medium text-xs md:text-sm font-sans tracking-wide">
              {t('header.subtitle')}
            </p>
          </div>
        </div>

        {/* Actions Bar: Idioma + APK App + Theme Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Selector de idioma estilizado */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-xs font-medium text-amber-100 transition-all shadow-sm"
              aria-label="Seleccionar idioma"
            >
              <img src={currentLang.flag} alt={currentLang.label} className="w-4 h-3 object-cover rounded-xs" />
              <span className="uppercase font-semibold tracking-wider text-[11px]">{currentLang.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-amber-200 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-36 bg-white dark:bg-stone-900 rounded-xl shadow-2xl border border-amber-100 dark:border-stone-700 py-1.5 z-50 text-stone-800 dark:text-stone-200"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium hover:bg-amber-50 dark:hover:bg-stone-800 transition-colors text-left ${
                        currentLang.code === lang.code ? 'bg-amber-100/60 dark:bg-stone-800 font-bold text-amber-900 dark:text-amber-300' : ''
                      }`}
                    >
                      <img src={lang.flag} alt={lang.label} className="w-4 h-3 object-cover rounded-xs" />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Botón Descargar App APK */}
          <motion.a
            href="/PanZen.apk"
            download
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md border border-amber-300/40 transition-all"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            title="Descargar App para Android"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">App</span>
          </motion.a>

          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md text-amber-200 transition-all shadow-sm"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Cambiar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-amber-100" />
            )}
          </motion.button>
        </div>

      </div>
    </motion.header>
  );
};

export default Header;
