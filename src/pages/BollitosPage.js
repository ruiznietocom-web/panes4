import React from 'react';
import { motion } from 'framer-motion';
import ProductCounter from '../components/ProductCounter';
import { bollitos } from '../data/products';

const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Bollitos
      </h2>
      
      <div className="space-y-4">
        {bollitos.map((bollito) => (
          <ProductCounter
            key={bollito.id}
            product={bollito}
            count={selectedBollitos[bollito.id] || 0}
            onIncrement={() => onUpdateBollitoQuantity(bollito.id, (selectedBollitos[bollito.id] || 0) + 1)}
            onDecrement={() => onUpdateBollitoQuantity(bollito.id, (selectedBollitos[bollito.id] || 0) - 1)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BollitosPage;