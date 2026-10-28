import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Modal recordatorio que pregunta al usuario si desea el pan cortado (Sí o No)
 * y qué tipo de corte prefiere en caso afirmativo (Fino, Normal, Grueso).
 */
const CorteReminderModal = ({ isOpen, cortes = [], onConfirmNoCut, onConfirmWithCut, onClose }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState('ask'); // 'ask' (Sí/No) o 'choose' (seleccionar tipo de corte)

  // Resetear al paso inicial cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      setStep('ask');
    }
  }, [isOpen]);

  // Cerrar con Escape y bloquear scroll de fondo mientras esté abierto
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('corte_reminder.title', { defaultValue: '¿Quieres el pan cortado?' })}
        >
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 overflow-hidden border border-amber-100 dark:border-slate-700 transition-colors duration-300"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de cerrar */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('corte_reminder.close_aria', { defaultValue: 'Cerrar recordatorio' })}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {step === 'ask' ? (
                /* PASO 1: Recordatorio Sí o No */
                <motion.div
                  key="step-ask"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  className="text-center pt-2"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-3xl shadow-inner">
                    🔪
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {t('corte_reminder.title', { defaultValue: '¿Quieres el pan cortado?' })}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {t('corte_reminder.subtitle', {
                      defaultValue: 'No has seleccionado ningún tipo de corte. Recuerda que el corte es 100% gratuito.'
                    })}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                    {/* Botón NO */}
                    <button
                      type="button"
                      onClick={onConfirmNoCut}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-gray-200 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all font-semibold text-gray-700 dark:text-gray-200 group active:scale-95"
                    >
                      <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🍞</span>
                      <span className="text-base font-bold">
                        {t('corte_reminder.no_button', { defaultValue: 'No, entero' })}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t('corte_reminder.no_desc', { defaultValue: 'Pan sin cortar' })}
                      </span>
                    </button>

                    {/* Botón SÍ */}
                    <button
                      type="button"
                      onClick={() => setStep('choose')}
                      className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-amber-500 bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/25 transition-all font-semibold group active:scale-95"
                    >
                      <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">🔪</span>
                      <span className="text-base font-bold">
                        {t('corte_reminder.yes_button', { defaultValue: 'Sí, cortado' })}
                      </span>
                      <span className="text-xs text-amber-100 mt-0.5">
                        {t('corte_reminder.yes_desc', { defaultValue: 'Elegir tipo de corte' })}
                      </span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* PASO 2: Elegir qué tipo de corte */
                <motion.div
                  key="step-choose"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="pt-2"
                >
                  <div className="text-center mb-5">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 flex items-center justify-center text-2xl shadow-inner">
                      🔪
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {t('corte_reminder.choose_title', { defaultValue: '¿Qué tipo de corte prefieres?' })}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-300">
                      {t('corte_reminder.choose_subtitle', { defaultValue: 'Selecciona el grosor que más te guste (gratuito):' })}
                    </p>
                  </div>

                  <div className="space-y-2.5 mb-5">
                    {cortes.map((corte) => (
                      <button
                        key={corte.id}
                        type="button"
                        onClick={() => onConfirmWithCut(corte)}
                        className="w-full flex items-center justify-between p-3.5 rounded-2xl border-2 border-amber-200/80 dark:border-slate-600 hover:border-amber-500 dark:hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/60 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-all text-left group active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-10 text-center">{corte.image}</span>
                          <div>
                            <span className="font-bold text-gray-800 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {t(`products.harinas.${corte.id}.name`).replace(' (gratuito)', '').replace(' (free)', '')}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">
                              {t(`products.harinas.${corte.id}.description`)}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2.5 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded-full whitespace-nowrap">
                          {t('corte_reminder.free_badge', { defaultValue: 'Gratis' })}
                        </span>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('ask')}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-gray-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t('corte_reminder.back', { defaultValue: 'Volver' })}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CorteReminderModal;
