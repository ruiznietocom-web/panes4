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
    <div className="space-y-4">
      {cartItems
        .filter(item => item.type === 'panPersonalizado')
        .map((pan, index) => (
          <div key={pan.id} className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-bold mb-2">Extras Pan {index + 1} ({pan.harinas.map(h => h.name).join(', ')})</h3>
            <div className="flex gap-3 flex-wrap">
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    className={`px-3 py-2 rounded-lg border transition ${
                      selected
                        ? 'bg-green-200 border-green-400'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {extra.icon} {extra.name} ({extra.price.toFixed(2)}€)
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
