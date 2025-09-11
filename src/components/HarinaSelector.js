import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { harinas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const HarinaSelector = ({ selectedHarinas, onAddHarina }) => {
  const [selectedCorte, setSelectedCorte] = useState('Normal');

  const corteOptions = ['Normal', 'Fino', 'Grueso'];

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Elige tus Harinas y Cortes
      </h2>

      <p className="text-gray-500 text-center mb-4">
        Cada pan agregado tiene un precio fijo de {formatPrice(5.50)}.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map((harina, index) => (
          <motion.div
            key={harina.id}
            className="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 border-gray-200 hover:border-amber-300 hover:bg-amber-25"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{harina.image || '🌾'}</div>
              <h3 className="font-bold text-gray-800 mb-1">{harina.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{harina.description}</p>
              <span className="text-lg font-bold text-amber-600">{formatPrice(5.50)}</span>
            </div>

            {/* Selección de corte */}
            <div className="flex justify-center gap-2 mt-2">
              {corteOptions.map(corte => (
                <button
                  key={corte}
                  onClick={() => setSelectedCorte(corte)}
                  className={`px-2 py-1 rounded-lg border ${
                    selectedCorte === corte ? 'bg-amber-100 border-amber-400' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {corte}
                </button>
              ))}
            </div>

            {/* Botón Añadir */}
            <button
              onClick={() => onAddHarina(harina, selectedCorte)}
              className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600 transition"
            >
              Añadir Pan
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HarinaSelector;
