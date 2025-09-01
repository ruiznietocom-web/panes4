import React from 'react';
import { motion } from 'framer-motion';
import ProductCounter from '../components/ProductCounter';
import { pulguitas } from '../data/products';

const PulguitasPage = ({ selectedPulguitas, onUpdatePulguitaQuantity }) => {
  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Pulguitas
      </h2>
      
      <div className="space-y-4">
        {pulguitas.map((pulguita) => (
          <ProductCounter
            key={pulguita.id}
            product={pulguita}
            count={selectedPulguitas[pulguita.id] || 0}
            onIncrement={() => onUpdatePulguitaQuantity(pulguita.id, (selectedPulguitas[pulguita.id] || 0) + 1)}
            onDecrement={() => onUpdatePulguitaQuantity(pulguita.id, (selectedPulguitas[pulguita.id] || 0) - 1)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PulguitasPage;