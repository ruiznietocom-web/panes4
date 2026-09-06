import React, { useState, useEffect } from 'react'; // Estado local de la edición y efectos
import { motion, AnimatePresence } from 'framer-motion'; // Animaciones del modal
import { X, Check } from 'lucide-react'; // Iconos de cerrar y selección
import { harinas, extras as allExtras } from '../data/products'; // Catálogo de harinas, cortes y extras
import { formatPrice } from '../utils/formatPrice'; // Formateo de precios
import { calculatePanBasePrice } from '../utils/calculatePanPrice'; // Cálculo dinámico del precio base del pan
import { useTranslation } from 'react-i18next';

const MAX_HARINAS = 5; // Debe coincidir con el máximo del selector principal

// Modal para editar un pan que ya está en la cesta:
// sus harinas, el corte y también los extras añadidos.
const EditPanModal = ({ pan, onSave, onClose }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Al abrir, cargar la selección actual del pan (harinas, corte y extras)
  useEffect(() => {
    if (pan) {
      setSelected(pan.harinas || []);
      setSelectedExtras(pan.extras || []);
    }
  }, [pan]);

  // Cerrar con Escape y bloquear el scroll de fondo
  useEffect(() => {
    if (!pan) return;
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
  }, [pan, onClose]);

  const flours = harinas.filter(h => h.price > 0);
  const cortes = harinas.filter(h => h.price === 0);
  const selectedFlourCount = selected.filter(h => h.price > 0).length;

  // Misma lógica de selección que el selector principal
  const toggle = (harina) => {
    setSelected(prev => {
      if (prev.find(h => h.id === harina.id)) {
        return prev.filter(h => h.id !== harina.id);
      }
      if (harina.price === 0) {
        return [...prev.filter(h => h.price !== 0), harina];
      }
      if (prev.filter(h => h.price > 0).length < MAX_HARINAS) {
        return [...prev, harina];
      }
      return prev;
    });
  };

  // Añadir o quitar un extra del pan
  const toggleExtra = (extra) => {
    setSelectedExtras(prev =>
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  // Precio total del pan con los extras elegidos (para mostrarlo en el botón de guardar)
  const currentBasePrice = calculatePanBasePrice(selected);
  const panTotal = currentBasePrice + selectedExtras.reduce((acc, e) => acc + e.price, 0);

  const handleSave = () => {
    if (selectedFlourCount === 0) return; // Un pan necesita al menos una harina
    onSave(pan.id, selected, selectedExtras);
    onClose();
  };

  return (
    <AnimatePresence>
      {pan && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t('edit_pan_modal.title')}
        >
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto"
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
              aria-label={t('edit_pan_modal.cancel')}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 text-gray-500 hover:text-gray-800 hover:bg-white shadow-sm dark:bg-slate-700/80 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera */}
            <div className="bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-slate-700 dark:via-slate-700 dark:to-slate-800 pt-6 pb-4 px-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                ✏️ {t('edit_pan_modal.title')}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-1">
                {t('harina_selector.flour_counter', { count: selectedFlourCount, max: MAX_HARINAS })}
              </p>
            </div>

            <div className="px-6 pb-6 pt-4">
              {/* Harinas */}
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                {t('edit_pan_modal.flours')}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {flours.map(harina => {
                  const isSelected = !!selected.find(h => h.id === harina.id);
                  return (
                    <button
                      key={harina.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(harina)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm dark:bg-slate-700 dark:border-amber-400 dark:text-amber-100'
                        : 'border-gray-200 text-gray-600 hover:border-amber-300 dark:border-slate-600 dark:text-slate-300 dark:hover:border-amber-500'
                        }`}
                    >
                      <span>{harina.image}</span>
                      <span>{t(`products.harinas.${harina.id}.short_name`)}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Corte */}
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                🔪 {t('edit_pan_modal.cut')}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {cortes.map(corte => {
                  const isSelected = !!selected.find(h => h.id === corte.id);
                  return (
                    <button
                      key={corte.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggle(corte)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm dark:bg-slate-700 dark:border-amber-400 dark:text-amber-100'
                        : 'border-gray-200 text-gray-600 hover:border-amber-300 dark:border-slate-600 dark:text-slate-300 dark:hover:border-amber-500'
                        }`}
                    >
                      <span>{corte.image}</span>
                      <span>{t(`products.harinas.${corte.id}.short_name`)}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Extras del pan */}
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                ✨ {t('edit_pan_modal.extras')}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {allExtras.map(extra => {
                  const isSelected = !!selectedExtras.find(e => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-sm font-medium transition-all duration-200 ${isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-sm dark:bg-slate-700 dark:border-amber-400 dark:text-amber-100'
                        : 'border-gray-200 text-gray-600 hover:border-amber-300 dark:border-slate-600 dark:text-slate-300 dark:hover:border-amber-500'
                        }`}
                    >
                      <span>{extra.icon}</span>
                      <span>{t(`products.extras.${extra.id}`)}</span>
                      {extra.price > 0 && (
                        <span className={`text-xs ${isSelected ? 'text-amber-600 dark:text-amber-300' : 'text-gray-400 dark:text-slate-500'}`}>
                          +{formatPrice(extra.price)}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-amber-500" />}
                    </button>
                  );
                })}
              </div>

              {/* Acciones */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {t('edit_pan_modal.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={selectedFlourCount === 0}
                  className={`flex-1 py-3 rounded-xl font-bold text-white transition-all ${selectedFlourCount === 0
                    ? 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 shadow-md'
                    }`}
                >
                  {t('edit_pan_modal.save')} · {formatPrice(panTotal)}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditPanModal;
