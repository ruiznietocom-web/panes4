import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Info, Sparkles, Wheat, Gauge, Layers, Sliders } from 'lucide-react';
import { harinas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from 'react-i18next';
import { calculatePanBasePrice } from '../utils/calculatePanPrice';
import FlourInfoModal from './FlourInfoModal';
import CorteReminderModal from './CorteReminderModal';
import { toast } from 'react-hot-toast';

// Atributos y perfiles específicos por harina para enriquecer la tarjeta
const FLOUR_PROFILES = {
  1: { badge: 'Clásico & Versátil', glutenText: 'Gluten medio', glutenLevel: 2, iconColor: 'text-amber-500' },
  2: { badge: 'Bajo en Gluten', glutenText: 'Bajo en gluten', glutenLevel: 1, iconColor: 'text-amber-700' },
  3: { badge: 'Cereal Ancestral', glutenText: 'Alta digestibilidad', glutenLevel: 2, iconColor: 'text-amber-600' },
  4: { badge: 'Alto en Proteína', glutenText: 'Gran sabor', glutenLevel: 2, iconColor: 'text-yellow-600' },
  5: { badge: 'Híbrido Innovador', glutenText: 'Digestión ligera', glutenLevel: 2, iconColor: 'text-orange-500' },
};

// Configuración visual de los cortes
const CORTE_DETAILS = {
  6: { thickness: 'Fino (~10 mm)', desc: 'Crujiente y ligero', bars: 1 },
  7: { thickness: 'Normal (~14 mm)', desc: 'El estándar de obrador', bars: 2 },
  8: { thickness: 'Grueso (~20 mm)', desc: 'Rústico y contundente', bars: 3 },
};

const HarinaSelector = ({
  onAddPan,
  existingPanesCount,
  setIsAddButtonVisible,
  selectedHarinas: externalSelectedHarinas,
  setSelectedHarinas: externalSetSelectedHarinas
}) => {
  const { t, i18n } = useTranslation();
  const [internalSelectedHarinas, setInternalSelectedHarinas] = useState([]);
  const selectedHarinas = externalSelectedHarinas !== undefined ? externalSelectedHarinas : internalSelectedHarinas;
  const setSelectedHarinas = externalSetSelectedHarinas || setInternalSelectedHarinas;
  const [infoHarina, setInfoHarina] = useState(null);
  const [showCorteReminder, setShowCorteReminder] = useState(false);

  const flours = harinas.filter(h => h.price > 0);
  const cortes = harinas.filter(h => h.price === 0);
  const selectedFlourCount = selectedHarinas.filter(h => h.price > 0).length;

  useEffect(() => {
    if (setIsAddButtonVisible) {
      setIsAddButtonVisible(selectedFlourCount > 0);
    }
    return () => {
      if (setIsAddButtonVisible) {
        setIsAddButtonVisible(false);
      }
    };
  }, [selectedFlourCount, setIsAddButtonVisible]);

  const maxHarinas = 5;
  const currentPanPrice = calculatePanBasePrice(selectedHarinas);

  const toggleHarina = (harina) => {
    setSelectedHarinas(prev => {
      if (prev.find(h => h.id === harina.id)) {
        return prev.filter(h => h.id !== harina.id);
      }
      if (harina.price === 0) {
        return [...prev.filter(h => h.price !== 0), harina];
      }
      if (prev.filter(h => h.price > 0).length < maxHarinas) {
        return [...prev, harina];
      }
      return prev;
    });
  };

  const addPanToCart = (harinasToAdd) => {
    onAddPan({
      id: Date.now(),
      type: 'panPersonalizado',
      harinas: harinasToAdd,
      price: calculatePanBasePrice(harinasToAdd),
      quantity: 1,
      extras: []
    });

    toast.success(t('harina_selector.pan_added_toast'), {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#B8860B',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '16px',
        padding: '12px 20px',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#B8860B',
      },
    });

    setSelectedHarinas([]);
    setShowCorteReminder(false);
  };

  const handleAddPan = () => {
    if (selectedFlourCount === 0) return;
    const hasCorte = selectedHarinas.some(h => h.price === 0);
    if (!hasCorte) {
      setShowCorteReminder(true);
      return;
    }
    addPanToCart(selectedHarinas);
  };

  const handleConfirmNoCut = () => {
    addPanToCart(selectedHarinas.filter(h => h.price > 0));
  };

  const handleConfirmWithCut = (corte) => {
    addPanToCart([...selectedHarinas.filter(h => h.price > 0), corte]);
  };

  return (
    <motion.div
      className="bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-8 shadow-artisan border border-amber-900/10 dark:border-stone-800 mb-8 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Título de la sección */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Wheat className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Obrador a Medida</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
          {t('harina_selector.title')}
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-sm max-w-lg mx-auto mt-1">
          {t('harina_selector.instructions')}
        </p>
      </div>

      {/* Barra de progreso de selección */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
          <Wheat className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          {t('harina_selector.flour_counter', { count: selectedFlourCount, max: maxHarinas })}
        </span>
        <span className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1">
          <Info className="w-3 h-3" />
          {t('flour_info.tap_hint')}
        </span>
      </div>

      {/* Grid de harinas con diseño enriquecido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {flours.map((harina, index) => {
          const isSelected = !!selectedHarinas.find(h => h.id === harina.id);
          const profile = FLOUR_PROFILES[harina.id] || { badge: 'Integral', glutenText: 'Ecológico', glutenLevel: 2 };

          return (
            <div key={harina.id} className="relative group">
              <motion.button
                type="button"
                aria-pressed={isSelected}
                className={`w-full h-full p-5 rounded-2xl border-2 text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/80 dark:bg-stone-800 dark:border-amber-400 shadow-md ring-2 ring-amber-400/20'
                    : 'border-stone-200 dark:border-stone-700/80 hover:border-amber-300 dark:hover:border-amber-500/70 bg-stone-50/50 hover:bg-white dark:bg-stone-800/40 dark:hover:bg-stone-800/80'
                }`}
                onClick={() => toggleHarina(harina)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                {/* Cabecera de la tarjeta con badge y selección */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
                      {profile.badge}
                    </span>
                    <span className="text-xl" aria-hidden="true">
                      {harina.image}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white leading-snug mb-1">
                    {t(`products.harinas.${harina.id}.name`).replace(' Integral Ecológico', '')}
                    <span className="block text-xs font-sans font-normal text-amber-700 dark:text-amber-400">
                      100% Integral Ecológico
                    </span>
                  </h3>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mt-1 mb-3">
                    {t(`products.harinas.${harina.id}.description`)}
                  </p>
                </div>

                {/* Footer de la tarjeta con digestibilidad */}
                <div className="pt-2.5 border-t border-amber-900/10 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Gauge className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    {profile.glutenText}
                  </span>
                  {harina.id !== 4 && harina.id !== 5 && (
                    <span className="font-semibold text-amber-800 dark:text-amber-300">
                      Molida a la piedra
                    </span>
                  )}
                </div>
              </motion.button>

              {/* Botón Info ⓘ */}
              <button
                type="button"
                aria-label={t('flour_info.aria', { name: t(`products.harinas.${harina.id}.name`) })}
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoHarina(harina);
                }}
                className="absolute top-3 right-3 z-10 p-1 rounded-full text-stone-400 hover:text-amber-600 hover:bg-amber-100 dark:text-stone-400 dark:hover:text-amber-300 dark:hover:bg-stone-700 transition-colors"
                title="Ver propiedades nutricionales"
              >
                <Info className="w-4 h-4" />
              </button>

              {/* Check de seleccionado */}
              {isSelected && (
                <motion.div
                  className="absolute bottom-3 right-3 bg-amber-500 text-stone-950 rounded-full p-1 shadow-sm pointer-events-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sección de corte con diagramas y estilo rústico */}
      <div className="mt-8 pt-6 border-t border-dashed border-amber-200 dark:border-stone-700">
        <div className="text-center mb-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-white flex items-center justify-center gap-2">
            <span>🔪</span>
            <span>{t('harina_selector.cut_title', { defaultValue: '¿Cómo quieres el corte?' })}</span>
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {t('harina_selector.cut_subtitle', { defaultValue: 'Opcional y gratuito • Cortado fresco en obrador' })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {cortes.map(corte => {
            const selected = !!selectedHarinas.find(h => h.id === corte.id);
            const detail = CORTE_DETAILS[corte.id] || { thickness: 'Corte estándar', desc: '', bars: 1 };

            return (
              <button
                key={corte.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleHarina(corte)}
                className={`p-3.5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-between ${
                  selected
                    ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-md dark:bg-stone-800 dark:border-amber-400 dark:text-amber-100 ring-2 ring-amber-400/20'
                    : 'border-stone-200 hover:border-amber-300 dark:border-stone-700 dark:hover:border-amber-500 bg-stone-50/50 hover:bg-white dark:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                }`}
              >
                {/* Visualizador de grosor de rebanada */}
                <div className="flex items-center gap-1 my-1.5 h-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-5 rounded-full transition-colors ${
                        i < detail.bars
                          ? 'bg-amber-600 dark:bg-amber-400'
                          : 'bg-stone-300 dark:bg-stone-700'
                      }`}
                      style={{ width: `${(i + 1) * 3 + 2}px` }}
                    />
                  ))}
                </div>

                <div>
                  <span className="block font-bold text-xs sm:text-sm">
                    {detail.thickness}
                  </span>
                  <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {detail.desc}
                  </span>
                </div>

                {selected && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    <Check className="w-3.5 h-3.5" /> Seleccionado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón flotante para añadir el pan al carrito */}
      {selectedFlourCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-20 lg:bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4"
        >
          <button
            onClick={handleAddPan}
            className="pointer-events-auto flex items-center gap-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-bold px-7 py-3.5 rounded-full shadow-2xl hover:shadow-amber-500/25 transition-all transform hover:scale-105 border-2 border-white dark:border-stone-800 animate-shimmer"
          >
            <Sparkles className="w-5 h-5 text-stone-950" />
            <span className="text-sm sm:text-base">
              Añadir a la cesta ({selectedFlourCount} {selectedFlourCount === 1 ? 'harina' : 'harinas'})
            </span>
            <span className="bg-stone-950/20 px-2.5 py-0.5 rounded-full text-xs font-black">
              {formatPrice(currentPanPrice)}
            </span>
          </button>
        </motion.div>
      )}

      {/* Modales */}
      <FlourInfoModal harina={infoHarina} onClose={() => setInfoHarina(null)} />
      <CorteReminderModal
        isOpen={showCorteReminder}
        cortes={cortes}
        onConfirmNoCut={handleConfirmNoCut}
        onConfirmWithCut={handleConfirmWithCut}
        onClose={() => setShowCorteReminder(false)}
      />
    </motion.div>
  );
};

export default HarinaSelector;
