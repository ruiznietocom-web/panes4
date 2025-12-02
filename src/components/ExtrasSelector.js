import React from 'react';
import { useTranslation } from 'react-i18next';
import { extras as allExtras } from '../data/products';

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

  return (
    <div className="space-y-6">
      {cartItems
        .filter(item => item.type === 'panPersonalizado')
        .map((pan, index) => (
          <div key={pan.id} className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-stone-100 dark:border-slate-700 relative overflow-hidden group">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 dark:bg-amber-900/20 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700 ease-out"></div>

            <div className="relative z-10 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  {t('EXTRAS.pan')} {index + 1}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-200 to-transparent dark:from-slate-600"></div>
              </div>

              <h3 className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 mb-2">
                {pan.harinas.map(h => t(`products.harinas.${h.id}.name`).replace(' Integral Ecológico', '')).join(' + ')}
              </h3>

              <p className="text-stone-500 dark:text-stone-400 text-sm font-medium">
                {t('extras_selector.subtitle', { defaultValue: 'Personaliza tu pan con nuestros ingredientes premium' })}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group/btn
                      ${selected
                        ? 'bg-amber-50 border-amber-500 shadow-md dark:bg-slate-700 dark:border-amber-400'
                        : 'bg-stone-50 border-transparent hover:border-amber-200 hover:bg-white hover:shadow-lg dark:bg-slate-700/50 dark:hover:bg-slate-700 dark:hover:border-slate-500'}`}
                  >
                    {selected && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    )}
                    <span className="text-3xl mb-3 transform group-hover/btn:scale-110 transition-transform duration-300">{extra.icon}</span>
                    <span className={`text-center font-medium text-sm leading-tight mb-1 ${selected ? 'text-amber-900 dark:text-amber-100' : 'text-stone-600 dark:text-stone-300'}`}>
                      {t(`products.extras.${extra.id}`)}
                    </span>
                    <span className={`text-xs font-bold ${selected ? 'text-amber-600 dark:text-amber-400' : 'text-stone-400 dark:text-stone-500'}`}>
                      {extra.price.toFixed(2)}€
                    </span>
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
