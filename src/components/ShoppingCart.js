import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { formatPrice } from "../utils/formatPrice";

const ShoppingCart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
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
            {cartItems.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity - 1, item.type)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() =>
                      onUpdateQuantity(item.id, item.quantity + 1, item.type)
                    }
                  >
                    +
                  </button>
                  <span className="font-bold">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <button
                    className="ml-2 text-red-500"
                    onClick={() => onRemoveItem(item.id, item.type)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ShoppingCart;
