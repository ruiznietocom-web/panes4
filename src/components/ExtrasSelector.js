import React from 'react';
import { motion } from 'framer-motion';
import { extras as allExtras } from '../data/products';

const ExtrasSelector = ({ cartItems, onUpdatePanExtras }) => {
  // Función para añadir o quitar extras de un pan
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
    onUpdatePanExtras(newCartItems); // Actualiza el carrito
  };

  return (
    <div className="space-y-4">
      {cartItems
        .filter(item => item.type === 'panPersonalizado') // Solo panes personalizados
        .map((pan, index) => (
          <div key={pan.id} className="bg-green-50 p-4 rounded-xl shadow-md">
            {/* Título con número de pan y harinas seleccionadas */}
            <h3 className="font-bold mb-2">
              Extras Pan {index + 1} ({pan.harinas.map(h => h.name).join(', ')})
            </h3>

            {/* Contenedor de los botones de extras */}
            <div className="flex gap-3 flex-wrap">
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id); // Comprueba si está seleccionado
                return (
                  <motion.button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    className={`px-3 py-2 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                      selected
                        ? 'bg-green-200 border-green-400 scale-105 shadow-lg'
                        : 'bg-white border-gray-300 hover:bg-gray-100 hover:scale-105'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* ICONO DEL EXTRA CON ROTACIÓN */}
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }} // Animación de rotación
                      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
                      className="text-8XL mb-2" // <-- TAMAÑO DEL ICONO AUMENTADO
                    >
                      {extra.icon} 
                    </motion.span>

                    {/* NOMBRE DEL EXTRA */}
                    <span className="text-center font-semibold text-sm">{extra.name}</span>

                    {/* PRECIO DEL EXTRA */}
                    <span className="text-center text-xs text-gray-600">{extra.price.toFixed(2)}€</span>
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
