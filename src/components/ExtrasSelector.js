import React from 'react';
import { extras as allExtras } from '../data/products';

const ExtrasSelector = ({ cartItems, onUpdatePanExtras }) => {
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
          <div key={pan.id} className="bg-green-50 dark:bg-slate-800 p-4 rounded-2xl shadow-md transition-colors duration-300">
            <h3 className="font-bold mb-3 text-lg text-gray-800 dark:text-white">
              ELIGE LOS EXTRAS DE TU PAN {index + 1} ({pan.harinas.map(h => h.name).join(', ')})
            </h3>
            <div className="flex flex-wrap gap-4">
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    className={`flex flex-col items-center justify-center w-24 h-28 p-3 rounded-xl border transition-all duration-200
                      ${selected
                        ? 'bg-green-200 border-green-400 scale-105 shadow-lg dark:bg-green-900 dark:border-green-500 dark:text-white'
                        : 'bg-white border-gray-300 hover:bg-gray-100 hover:scale-105 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600'}`}
                  >
                    <span className="text-4xl mb-2">{extra.icon}</span>
                    <span className="text-center font-semibold text-sm">{extra.name}</span>
                    <span className="text-center text-xs text-gray-600 dark:text-gray-400">{extra.price.toFixed(2)}€</span>
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
