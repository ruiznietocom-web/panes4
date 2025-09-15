import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { bollitos } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const BollitosSelector = ({ onAddItem }) => {
  const [selected, setSelected] = useState([]);

  const toggleBollito = (bollito) => {
    setSelected(prev => {
      const exists = prev.find(b => b.id === bollito.id);
      if (exists) {
        return prev.filter(b => b.id !== bollito.id);
      } else {
        return [...prev, { ...bollito, quantity: 1 }];
      }
    });
  };

  const handleAddBollitos = () => {
    selected.forEach(item => onAddItem({ ...item, type: 'bollito' }));
    setSelected([]);
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Selecciona Bollitos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bollitos.map(b => (
          <div key={b.id} onClick={() => toggleBollito(b)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.find(sel => sel.id === b.id)
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{b.image}</div>
              <h3 className="font-bold text-gray-800 mb-1">{b.name}</h3>
              <span className="text-lg font-bold text-blue-600">{formatPrice(b.price)}</span>
            </div>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="text-center mt-4">
          <button onClick={handleAddBollitos} className="bg-blue-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-blue-600 transition">
            Añadir Bollitos
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default BollitosSelector;
