import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { harinas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const cortes = ['Corto', 'Medio', 'Largo'];

const HarinaSelector = ({ onAddPan }) => {
  const [selectedHarinas, setSelectedHarinas] = useState([]);
  const [selectedCorte, setSelectedCorte] = useState('');

  const toggleHarina = (harina) => {
    setSelectedHarinas(prev =>
      prev.includes(harina) ? prev.filter(h => h !== harina) : [...prev, harina]
    );
  };

  const handleAddPan = () => {
    onAddPan(selectedHarinas, selectedCorte);
    setSelectedHarinas([]);
    setSelectedCorte('');
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Elige tus Harinas Base</h2>
      <p className="text-gray-500 text-center mb-4">Selecciona las harinas para tu pan y luego el tipo de corte.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {harinas.map(h => (
          <div
            key={h.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedHarinas.includes(h) ? 'border-amber-500 bg-amber-50 shadow-md' : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'}`}
            onClick={() => toggleHarina(h)}
          >
            {selectedHarinas.includes(h) && <Check className="absolute top-2 right-2 w-4 h-4 text-amber-500" />}
            <div className="text-center">
              <div className="text-4xl mb-2">{h.image}</div>
              <h3 className="font-bold text-gray-800 mb-1">{h.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{h.description}</p>
              <span className="text-lg font-bold text-amber-600">{formatPrice(h.price)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Selecciona corte:</h3>
        <div className="flex gap-2 flex-wrap">
          {cortes.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCorte(c)}
              className={`px-3 py-2 rounded-lg border transition ${selectedCorte === c ? 'bg-amber-100 border-amber-400' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddPan}
        disabled={selectedHarinas.length === 0 || !selectedCorte}
        className={`w-full py-3 rounded-xl font-bold text-white ${selectedHarinas.length === 0 || !selectedCorte ? 'bg-gray-300 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}`}
      >
        Añadir Pan Personalizado
      </button>
    </motion.div>
  );
};

export default HarinaSelector;
