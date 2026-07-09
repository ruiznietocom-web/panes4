import React, { useEffect } from 'react'; // React y useEffect para gestionar el teclado y el scroll
import { motion, AnimatePresence } from 'framer-motion'; // Animaciones suaves de entrada/salida
import { X } from 'lucide-react'; // Icono para cerrar la ficha
import { useTranslation } from 'react-i18next';
import AllergenBadges from './AllergenBadges'; // Chips de alérgenos

// Ficha emergente con la información detallada de cada harina.
// Se abre desde el icono ⓘ de cada tarjeta del selector de harinas.
const FlourInfoModal = ({ harina, onClose }) => {
  const { t } = useTranslation();

  // Cerrar con la tecla Escape y bloquear el scroll del fondo mientras la ficha está abierta
  useEffect(() => {
    if (!harina) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [harina, onClose]);

  // Texto del nivel de gluten según el valor numérico (1 bajo, 2 moderado, 3 alto)
  const glutenLabel = (level) => {
    if (level >= 3) return t('flour_info.gluten_high');
    if (level === 2) return t('flour_info.gluten_medium');
    return t('flour_info.gluten_low');
  };

  return (
    <AnimatePresence>
      {harina && (
        // Fondo oscurecido con desenfoque; clic fuera cierra la ficha
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t(`products.harinas.${harina.id}.name`)}
        >
          {/* Tarjeta de la ficha */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre la ficha
          >
            {/* Botón de cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('flour_info.close')}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 text-gray-500 hover:text-gray-800 hover:bg-white shadow-sm dark:bg-slate-700/80 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera: foto real si existe, o degradado cálido con el emoji */}
            {harina.photo ? (
              <div className="relative">
                <img
                  src={harina.photo}
                  alt={t(`products.harinas.${harina.id}.name`)}
                  className="w-full h-44 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-0 right-0 text-center px-6">
                  <h3 className="text-2xl font-bold text-white tracking-wide drop-shadow">
                    {t(`products.harinas.${harina.id}.short_name`)}
                  </h3>
                  <p className="text-sm text-amber-100 font-medium">
                    {t(`products.harinas.${harina.id}.name`)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-slate-700 dark:via-slate-700 dark:to-slate-800 pt-8 pb-6 px-6 text-center">
                <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white dark:bg-slate-700 shadow-md text-5xl mb-3">
                  {harina.image}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
                  {t(`products.harinas.${harina.id}.short_name`)}
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 font-medium mt-1">
                  {t(`products.harinas.${harina.id}.name`)}
                </p>
              </div>
            )}

            {/* Cuerpo de la ficha con las secciones informativas */}
            <div className="px-6 pb-6 pt-4 space-y-4">
              {/* Sabor */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-slate-700 text-xl">😋</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {t('flour_info.flavor')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
                    {t(`products.harinas.${harina.id}.info.flavor`)}
                  </p>
                </div>
              </div>

              {/* Gluten: texto + indicador visual de tres puntos */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-slate-700 text-xl">🌾</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {t('flour_info.gluten')}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-700 dark:text-slate-200">
                      {glutenLabel(harina.glutenLevel)}
                    </span>
                    <span className="flex items-center gap-1" aria-hidden="true">
                      {[1, 2, 3].map((dot) => (
                        <span
                          key={dot}
                          className={`w-2.5 h-2.5 rounded-full ${dot <= (harina.glutenLevel || 1)
                            ? 'bg-amber-500'
                            : 'bg-gray-200 dark:bg-slate-600'
                            }`}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nutrición */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-slate-700 text-xl">💪</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {t('flour_info.nutrition')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
                    {t(`products.harinas.${harina.id}.info.nutrition`)}
                  </p>
                </div>
              </div>

              {/* Ideal para */}
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-amber-50 dark:bg-slate-700 text-xl">🍽️</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {t('flour_info.ideal')}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-200 leading-relaxed">
                    {t(`products.harinas.${harina.id}.info.ideal`)}
                  </p>
                </div>
              </div>

              {/* Alérgenos */}
              {harina.allergens?.length > 0 && (
                <div className="pt-3 border-t border-dashed border-amber-200 dark:border-slate-600">
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 text-center mb-2">
                    {t('allergens.title')}
                  </p>
                  <AllergenBadges allergens={harina.allergens} size="sm" />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FlourInfoModal;
