import React from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

const ShoppingCart = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white w-full sm:w-96 h-full shadow-lg p-6 flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tu Carrito</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {cartItems.map(item => (
              <div key={item.cartId} className="p-3 bg-gray-50 rounded-lg shadow-sm">
                {item.type === 'panPersonalizado' ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Pan Personalizado</span>
                      <span className="text-gray-700">{formatPrice(item.price)}</span>
                    </div>
                    <ul className="ml-4 mb-1">
                      {item.harinas.map(h => (
                        <li key={h.id}>🌾 {h.name}</li>
                      ))}
                    </ul>
                    <p className="mb-2">Corte: {item.corte}</p>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded"
                        onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        className="ml-auto text-red-500"
                        onClick={() => onRemoveItem(item.cartId)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span>{formatPrice(item.price)}</span>
                    <button
                      className="ml-2 text-red-500"
                      onClick={() => onRemoveItem(item.cartId)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ShoppingCart;
