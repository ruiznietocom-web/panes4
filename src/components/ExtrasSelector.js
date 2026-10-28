import React from 'react';
import { useTranslation } from 'react-i18next';
import { extras as allExtras, calculatePanWeight } from '../data/products';
import AllergenBadges from './AllergenBadges';
import { Sparkles } from 'lucide-react';

const ExtrasSelector = ({ cartItems, onUpdatePanExtras }) => {
  const { t } = useTranslation();

  const toggleExtra = (panId, extra) => {
    const newCartItems = cartItems.map(pan => {
      if (pan.id === panId) {
        const exists = pan.extras?.find(e => e.id === extra.id);
        const updatedExtras = exists
          ? pan.extras.filter(e => e.id !== extra.id)
          : [...(pan.extras || []), extra];
        return { ...pan, extras: updatedExtras };
      }
      return pan;
    });
    onUpdatePanExtras(newCartItems);
  };

  const panes = cartItems.filter(item => item.type === 'panPersonalizado');
  if (panes.length === 0) return null;

  return (
    <div className="space-y-6">
      {panes.map((pan, index) => (
        <div
          key={pan.id}
          className="bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-8 shadow-artisan border border-amber-900/10 dark:border-stone-800 relative overflow-hidden group transition-all duration-300"
        >
          {/* Luz decorativa */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 dark:bg-amber-500/5 rounded-bl-full pointer-events-none transition-transform group-hover:scale-125 duration-700"></div>

          <div className="relative z-10 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-stone-950" />
                {t('EXTRAS.pan')} {index + 1}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-amber-300/40 to-transparent dark:from-stone-700"></div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                {pan.harinas.map(h => t(`products.harinas.${h.id}.name`).replace(' Integral Ecológico', '')).join(' + ')}
              </h3>
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-stone-800 px-2.5 py-1 rounded-full border border-amber-300/40">
                {calculatePanWeight(pan.extras).label}
              </span>
            </div>

            <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm font-medium">
              {t('extras_selector.subtitle', { defaultValue: 'Personaliza tu pan con nuestros ingredientes y semillas de cultivo biológico' })}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {allExtras.map(extra => {
              const selected = pan.extras?.some(e => e.id === extra.id);
              return (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(pan.id, extra)}
                  className={`relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-300 group/btn ${
                    selected
                      ? 'bg-amber-50/90 border-amber-500 shadow-md dark:bg-stone-800 dark:border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-stone-50/50 border-stone-200/80 hover:border-amber-300 hover:bg-white hover:shadow-md dark:bg-stone-800/40 dark:border-stone-700 dark:hover:bg-stone-800 dark:hover:border-stone-500'
                  }`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                  )}
                  <span className="text-2xl sm:text-3xl mb-2 transform group-hover/btn:scale-115 transition-transform duration-300">
                    {extra.icon}
                  </span>
                  <span className={`text-center font-semibold text-xs leading-tight mb-1 ${
                    selected ? 'text-amber-950 dark:text-amber-100' : 'text-stone-700 dark:text-stone-300'
                  }`}>
                    {t(`products.extras.${extra.id}`)}
                  </span>
                  <span className={`text-[11px] font-bold ${
                    selected ? 'text-amber-700 dark:text-amber-400' : 'text-stone-400 dark:text-stone-500'
                  }`}>
                    {extra.price === 0 ? 'Gratuito' : `+${extra.price.toFixed(2)}€`}
                  </span>
                  <AllergenBadges allergens={extra.allergens} className="mt-1" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExtrasSelector;
