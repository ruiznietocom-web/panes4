import React from 'react';
import { motion } from 'framer-motion';
import { extras } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const ExtrasSelector = ({ selectedExtras, onToggleExtra }) => {
  const isSelected = (extraId) => selectedExtras.some(extra => extra.id === extraId);

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
