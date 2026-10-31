import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Share2, PlusSquare, Sparkles, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PwaInstallModal = ({ isOpen, onClose, onInstall, isIOS }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-7 max-w-md w-full relative border border-amber-900/15 dark:border-stone-700 shadow-2xl text-center"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-stone-950 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Smartphone className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-stone-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Acceso Rápido
          </div>

          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white mb-2">
            Instalar App PanZen
          </h3>

          <p className="text-xs text-stone-600 dark:text-stone-300 mb-5 leading-relaxed">
            Instala la app PanZen en la pantalla de inicio de tu móvil.
          </p>

          {isIOS ? (
            /* Guía para iPhone / Safari */
            <div className="text-left bg-amber-50/80 dark:bg-stone-800/80 p-4 rounded-2xl border border-amber-200/80 dark:border-stone-700 space-y-3 mb-5 text-xs text-stone-700 dark:text-stone-300">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </span>
                <span>
                  Pulsa el botón de <strong>Compartir</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-blue-500" /> en la barra inferior de Safari.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </span>
                <span>
                  Desliza hacia abajo y elige <strong>"Añadir a pantalla de inicio"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-stone-700 dark:text-stone-200" />.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </span>
                <span>
                  Pulsa <strong>Añadir</strong>. ¡Ya tendrás el icono de PanZen junto a WhatsApp!
                </span>
              </div>
            </div>
          ) : (
            /* Botón de instalación nativa para Android / Chrome */
            <div className="space-y-3 mb-5">
              <button
                onClick={() => {
                  onInstall();
                  onClose();
                }}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-stone-950 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition transform hover:scale-[1.02] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Instalar en mi móvil</span>
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="text-xs font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            Continuar usando la web
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PwaInstallModal;
