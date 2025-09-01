import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const ProductCounter = ({ product, count, onIncrement, onDecrement }) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 flex items-center justify-center text-4xl bg-gray-100 rounded-full">
          {product.image}
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600">${product.price}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => onDecrement(product.id)}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        <span className="font-bold text-lg text-gray-800 w-6 text-center">{count}</span>
        <motion.button
          onClick={() => onIncrement(product.id)}
          className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCounter;