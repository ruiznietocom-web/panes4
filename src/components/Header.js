import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <motion.header
      className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-white p-4 shadow-xl backdrop-blur-sm transition-colors duration-300"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">

        {/* Logo principal */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="p-1 bg-white/20 rounded-full overflow-hidden shadow-md"
            animate={{ scale: [1, 1.05, 1, 1.05, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          >
            <img
              src={logo}
              alt="Logo PanZen"
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-cover rounded-full"
            />
          </motion.div>

          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">
              {t('header.title')}
            </h1>
            <p className="text-amber-50 font-medium text-xs md:text-sm font-sans hidden md:block drop-shadow-sm">
              {t('header.subtitle')}
            </p>
            {/* Banderitas para cambio de idioma */}
            <div className="flex gap-2 mt-1">
              <button onClick={() => changeLanguage('es')} className="hover:scale-110 transition-transform" title="Español">
                <img src="/images/banderaespana.png" alt="Español" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
              </button>
              <button onClick={() => changeLanguage('de')} className="hover:scale-110 transition-transform" title="Deutsch">
                <img src="/images/banderaalemania.png" alt="Deutsch" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
              </button>
              <button onClick={() => changeLanguage('en')} className="hover:scale-110 transition-transform" title="English">
                <img src="/images/banderareinounido.png" alt="English" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
              </button>
              <button onClick={() => changeLanguage('fr')} className="hover:scale-110 transition-transform" title="Français">
                <img src="/images/banderafrancia.png" alt="Français" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Contenedor derecha: Descarga + Toggle */}
        <div className="flex items-start gap-4">
          {/* Botón de descarga APK */}
          <motion.a
            href="/PanZen.apk"
            download
            className="flex flex-col items-center text-white hover:opacity-90 transition-opacity duration-200 group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="bg-white p-1.5 rounded-full shadow-md flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
              <motion.img
                src="/logoandroid.png"
                alt="Descargar App Android"
                className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] object-contain"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </div>
            <span className="font-medium text-[10px] md:text-xs tracking-wide text-amber-50 text-center leading-tight drop-shadow-sm">
              App
            </span>
          </motion.a>

          {/* Theme Toggle Button Container */}
          <div className="flex flex-col items-center group">
            <motion.button
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition-all duration-300 shadow-lg border border-white/10 mb-1"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] text-amber-300 drop-shadow-md" />
              ) : (
                <Moon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px] text-white drop-shadow-md" />
              )}
            </motion.button>
            {/* Invisible spacer to match "App" text height */}
            <span className="font-medium text-[10px] md:text-xs tracking-wide text-transparent select-none leading-tight">
              App
            </span>
          </div>
        </div>

      </div>
    </motion.header>
  );
};

export default Header;
