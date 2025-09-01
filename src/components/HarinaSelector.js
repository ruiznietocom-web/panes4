import React from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus } from 'lucide-react'; // Importar Plus y Minus
import { harinas, otrosPanes } from '../data/products';

const HarinaSelector = ({ selectedHarinas, onToggleHarina, selectedOtrosPanes, onUpdateOtroPanQuantity }) => {
  const maxHarinas = 5;

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Elige tus Harinas Base
      </h2>
      <p className="text-gray-500 text-center mb-4">
        Puedes seleccionar hasta {maxHarinas} harinas para tu pan personalizado.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map((harina, index) => {
          const isSelected = selectedHarinas.some(h => h.id === harina.id);
          const isDisabled = selectedHarinas.length >= maxHarinas && !isSelected;

          return (
            <motion.div
              key={harina.id}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
              } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => {
                if (!isDisabled) {
                  onToggleHarina(harina);
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {isSelected && (
                <motion.div 
                  className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
              
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center text-5xl">
                  {harina.image}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{harina.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{harina.description}</p>
                <span className="text-lg font-bold text-amber-600">${harina.price}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center mt-8">
        O Elige Otros Tipos de Pan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otrosPanes.map((pan, index) => {
          const quantity = selectedOtrosPanes[pan.id] || 0;
          return (
            <motion.div
              key={pan.id}
              className="relative p-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center text-5xl">
                  {pan.image}
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{pan.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{pan.description}</p>
                <span className="text-lg font-bold text-amber-600">${pan.price}</span>
              </div>
              <div className="flex items-center justify-center mt-3 gap-2">
                <motion.button
                  onClick={() => onUpdateOtroPanQuantity(pan.id, quantity - 1)}
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="font-bold text-lg text-gray-800">{quantity}</span>
                <motion.button
                  onClick={() => onUpdateOtroPanQuantity(pan.id, quantity + 1)}
                  className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HarinaSelector;