import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { harinas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const HarinaSelector = ({ onAddPan }) => {
  const [selectedHarinas, setSelectedHarinas] = useState([]);
  const maxHarinas = 6;
  const fixedHarinaPrice = 5.50;

  const toggleHarina = (harina) => {
    setSelectedHarinas(prev => {
      if (prev.find(h => h.id === harina.id)) {
        return prev.filter(h => h.id !== harina.id);
      } else if (prev.length < maxHarinas) {
        return [...prev, harina];
      }
      return prev;
    });
  };

  const handleAddPan = () => {
    if (selectedHarinas.length === 0) return;
    onAddPan({
      id: Date.now(),
      type: 'panPersonalizado',
      harinas: selectedHarinas,
      price: fixedHarinaPrice,
      quantity: 1,
    });
    setSelectedHarinas([]);
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
        Puedes seleccionar hasta 5 harinas.  
        El precio final de tu pan (sin extras) es fijo: {formatPrice(fixedHarinaPrice)}.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map((harina, index) => (
          <motion.div
            key={harina.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedHarinas.find(h => h.id === harina.id)
                ? 'border-amber-500 bg-amber-50 shadow-md'
                : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
            }`}
            onClick={() => toggleHarina(harina)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {selectedHarinas.find(h => h.id === harina.id) && (
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
            </div>
          </motion.div>
        ))}
      </div>

      {selectedHarinas.length > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={handleAddPan}
            className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-amber-600 transition"
          >
            Añadir Pan Personalizado
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default HarinaSelector;
