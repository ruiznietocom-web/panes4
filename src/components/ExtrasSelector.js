import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { extras } from '../data/products';

const ExtrasSelector = ({ selectedExtras, onToggleExtra }) => {
  const isSelected = (extraId) => selectedExtras.some(extra => extra.id === extraId);
  
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Añade Extras a tu Pan
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {extras.map((extra, index) => (
          <motion.div
            key={extra.id}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              isSelected(extra.id)
                ? 'border-green-500 bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
            }`}
            onClick={() => onToggleExtra(extra)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 + 0.3 }}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{extra.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{extra.name}</h3>
              <span className="text-sm font-bold text-green-600">+${extra.price}</span>
              
              <motion.div 
                className={`mt-2 w-6 h-6 mx-auto rounded-full flex items-center justify-center ${
                  isSelected(extra.id) 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                {isSelected(extra.id) ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExtrasSelector;