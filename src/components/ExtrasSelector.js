import React from 'react';
import { motion } from 'framer-motion';
import { extras as allExtras } from '../data/products';

const ExtrasSelector = ({ cartItems, onUpdatePanExtras }) => {
  // Función para seleccionar o deseleccionar un extra para un pan específico
  const toggleExtra = (panId, extra) => {
    const newCartItems = cartItems.map(pan => {
      if (pan.id === panId) {
        const exists = pan.extras?.find(e => e.id === extra.id);
        const updatedExtras = exists
          ? pan.extras.filter(e => e.id !== extra.id) // Quitar si ya estaba
          : [...(pan.extras || []), extra]; // Añadir si no estaba
        return { ...pan, extras: updatedExtras };
      }
      return pan;
    });
    onUpdatePanExtras(newCartItems); // Actualiza el carrito con extras modificados
  };

  return (
    <div className="space-y-4">
      {cartItems
        .filter(item => item.type === 'panPersonalizado') // Solo panes personalizados
        .map((pan, index) => (
          <div key={pan.id} className="bg-green-50 p-4 rounded-xl">
            <h3 className="font-bold mb-2">
              Extras Pan {index + 1} ({pan.harinas.map(h => h.name).join(', ')})
            </h3>
            <div className="flex gap-3 flex-wrap">
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id);
                return (
                  // Usamos motion.button para animar el botón y el icono
                  <motion.button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    className={`px-4 py-2 rounded-xl border flex items-center gap-2 transition-all ${
                      selected
                        ? 'bg-green-200 border-green-400'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.05 }} // Pequeño efecto al pasar el ratón
                    whileTap={{ scale: 0.95 }}   // Efecto al presionar
                  >
                    {/* Icono con rotación ligera animada */}
                    <motion.span
                      className="text-2xl" // Tamaño del icono
                      animate={{ rotate: [0, 10, -10, 0] }} // Giro suave
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                    >
                      {extra.icon}
                    </motion.span>
                    <span className="font-medium">{extra.name} ({extra.price.toFixed(2)}€)</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ExtrasSelector;
