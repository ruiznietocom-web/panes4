import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { harinas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const HarinaSelector = ({ selectedHarinas, onToggleHarina }) => {
  const isSelected = (harinaId) => selectedHarinas.some(h => h.id === harinaId);
  const getSelectedOpcion = (harinaId) => selectedHarinas.find(h => h.id === harinaId)?.opcion || 'Normal';
  const maxHarinas = 6;
  const fixedHarinaPrice = 5.50;

  const handleCorteClick = (harina, opcion) => {
    onToggleHarina(harina, opcion);
  };

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
        Puedes seleccionar hasta {maxHarinas} harinas.  
        El precio de esta sección es fijo: {formatPrice(fixedHarinaPrice)}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map((harina, index) => {
          const selected = isSelected(harina.id);

          return (
            <motion.div
              key={harina.id}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                selected
                  ? 'border-amber-500 bg-amber-50 shadow-md'
                  : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
              } ${selectedHarinas.length >= maxHarinas && !selected ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (selectedHarinas.length < maxHarinas || selected) {
                  onToggleHarina(harina, getSelectedOpcion(harina.id));
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {selected && (
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
                <div className="text-4xl mb-2">{harina.image}</div>
                <h3 className="font-bold text-gray-800 mb-1">{harina.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{harina.description}</p>
                <span className="text-lg font-bold text-amber-600">{formatPrice(harina.price)}</span>

                {/* Opciones de corte para PAN CORTADO */}
                {harina.id === 'panCortado' && selected && (
                  <div className="mt-3 flex justify-center gap-3">
                    {['Normal', 'Fino', 'Grueso'].map(opcion => (
                      <button
                        key={opcion}
                        onClick={() => handleCorteClick(harina, opcion)}
                        className={`px-3 py-1 rounded-lg border text-sm transition ${
                          getSelectedOpcion(harina.id) === opcion
                            ? 'bg-amber-300 border-amber-500 text-white'
                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {opcion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default HarinaSelector;
