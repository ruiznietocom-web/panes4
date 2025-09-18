import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const PanExtrasModal = ({ isOpen, pan, extrasOptions = [], onCancel, onConfirm }) => {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) setSelectedIds([]);
  }, [isOpen, pan]);

  if (!isOpen || !pan) return null;

  const toggle = (opt) => {
    setSelectedIds(prev => prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]);
  };

  const selectedExtrasObjects = extrasOptions.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Extras para este pan</h3>
          <button onClick={onCancel}><X className="w-6 h-6 text-gray-600" /></button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Elige los extras que quieras añadir a este pan. Se sumarán al precio base.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {extrasOptions.map(opt => {
            const selected = selectedIds.includes(opt.id);
            return (
              <button key={opt.id} onClick={() => toggle(opt)} className={`flex items-center gap-3 p-3 rounded-lg border transition ${selected ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                <span className="text-2xl">{opt.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">{opt.name}</div>
                  <div className="text-sm text-gray-600">{formatPrice(opt.price)}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm">Subtotal extras: <strong>{formatPrice(selectedExtrasObjects.reduce((s, e) => s + e.price, 0))}</strong></div>
            <div className="text-sm text-gray-500">Precio base pan: <strong>{formatPrice(pan.basePrice || pan.price || 0)}</strong></div>
          </div>

          <div className="flex gap-3">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-200">Omitir</button>
            <button onClick={() => onConfirm(pan.id, selectedExtrasObjects)} className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold">Confirmar y añadir</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PanExtrasModal;
