import React from "react";
import { motion } from "framer-motion";
import { bollitos } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Elige tus Bollitos</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bollitos.map((bollito, index) => (
          <motion.div
            key={bollito.id}
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-4xl mb-2">{bollito.image}</div>
            <h3 className="font-bold text-gray-800 mb-1">{bollito.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{bollito.description}</p>
            <p className="text-lg font-semibold text-blue-600">{formatPrice(bollito.price)}</p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => onUpdateBollitoQuantity(bollito.id, (selectedBollitos[bollito.id] || 0) - 1)}
              >-</button>
              <span>{selectedBollitos[bollito.id] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() => onUpdateBollitoQuantity(bollito.id, (selectedBollitos[bollito.id] || 0) + 1)}
              >+</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BollitosPage;
