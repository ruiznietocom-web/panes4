import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, X } from 'lucide-react';

const CartItem = ({ item, type, onUpdateQuantity, onRemoveItem }) => {
  const isHarina = type === 'harina';
  const isExtra = type === 'extra';
  const isBollito = type === 'bollito';
  const isPulguita = type === 'pulguita';

  const itemPrice = isHarina ? item.harina.price : item.price;
  const itemQuantity = isHarina ? item.quantity : 1; // Extras, bollitos, pulguitas already have quantity in their structure

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
    >
      <div className="flex items-center gap-3">
        {item.image && (
          <div className="text-2xl">
            {isHarina ? item.harina.image : item.image}
          </div>
        )}
        <div>
          <h4 className="font-semibold text-gray-800">
            {isHarina ? item.harina.name : item.name}
          </h4>
          <p className="text-sm text-gray-600">
            ${itemPrice.toFixed(2)} {isHarina && `x ${itemQuantity}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(isHarina || isBollito || isPulguita) && (
          <>
            <motion.button
              onClick={() => onUpdateQuantity(item.id, itemQuantity - 1, type)}
              className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <span className="font-bold text-gray-800">{itemQuantity}</span>
            <motion.button
              onClick={() => onUpdateQuantity(item.id, itemQuantity + 1, type)}
              className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </>
        )}
        <motion.button
          onClick={() => onRemoveItem(item.id, type)}
          className="p-1 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors ml-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CartItem;