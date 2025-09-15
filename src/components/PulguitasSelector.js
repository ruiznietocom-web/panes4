import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const PulguitasSelector = ({ onAddItem }) => {
  const [selected, setSelected] = useState([]);

  const togglePulguita = (pulguita) => {
    setSelected(prev => {
      const exists = prev.find(p => p.id === pulguita.id);
      if (exists) {
        return prev.filter(p => p.id !== pulguita.id);
      } else {
        return [...prev, { ...pulguita, quantity: 1 }];
      }
    });
  };

  const handleAddPulguitas = () => {
    selected.forEach(item => onAddItem({ ...item, type: 'pulguita' }));
    setSelected([]);
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Selecciona Pulguitas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pulguitas.map(p => (
          <div key={p.id} onClick={() => togglePulguita(p)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selected.find(sel => sel.id === p.id)
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
            }`}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{p.image}</div>
              <h3 className="font-bold text-gray-800 mb-1">{p.name}</h3>
              <span className="text-lg font-bold text-purple-600">{formatPrice(p.price)}</span>
            </div>
          </div>
        ))}
      </div>
      {selected.length > 0 && (
        <div className="text-center mt-4">
          <button onClick={handleAddPulguitas} className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-purple-600 transition">
            Añadir Pulguitas
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PulguitasSelector;
