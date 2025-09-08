import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { extras } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const ExtrasSelector = ({ selectedExtras, onToggleExtra, onToggleHarina }) => {
  const isSelected = (extraId) => selectedExtras.some(extra => extra.id === extraId);

  // Opciones para Pan Cortado
  const panOpciones = ['Normal', 'Fino', 'Grueso'];
  const [panSeleccionado, setPanSeleccionado] = useState('Normal');

  const handlePanClick = (opcion) => {
    setPanSeleccionado(opcion);
    if (onToggleHarina) {
      const panCortado = { id: 'panCortado', name: 'Pan Cortado', price: 0, image: '', type: 'harina' };
      onToggleHarina(panCortado, opcion);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Elige tus Extras
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Añade un toque especial a tu pan.
      </p>

      {/* Cuadro de Pan Cortado */}
      <div className="border border-gray-300 rounded-xl p-4 mb-6 max-w-xs mx-auto bg-gray-50">
        <h3 className="text-sm font-medium mb-2 text-center">Pan Cortado (gratuito)</h3>
        <div className="flex justify-center gap-2">
          {panOpciones.map((opcion) => (
            <button
              key={opcion}
              onClick={() => handlePanClick(opcion)}
              className={`text-xs px-3 py-1 rounded-full border ${
                panSeleccionado === opcion
                  ? 'bg-orange-500 text-white border-orange-500'
                  : 'bg-white text-gray-700 border-gray-300'
              } transition-colors`}
            >
              {opcion}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Extras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {extras.map((extra, index) => (
          <motion.div
            key={extra.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              isSelected(extra.id)
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
            }`}
            onClick={() => onToggleExtra(extra)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{extra.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{extra.name}</h3>
              <span className="text-lg font-bold text-green-600">{formatPrice(extra.price)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExtrasSelector;
