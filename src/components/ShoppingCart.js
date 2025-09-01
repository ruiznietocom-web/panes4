import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X } from 'lucide-react';
import CartItem from './CartItem';
import { harinas, bollitos, pulguitas } from '../data/products';

const ShoppingCart = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClose,
  isOpen
}) => {
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      if (item.type === 'harina') {
        const harina = harinas.find(h => h.id === item.id);
        if (harina) total += harina.price * item.quantity;
      } else if (item.type === 'extra') {
        total += item.price;
      } else if (item.type === 'bollito') {
        const bollito = bollitos.find(b => b.id === item.id);
        if (bollito) total += bollito.price * item.quantity;
      } else if (item.type === 'pulguita') {
        const pulguita = pulguitas.find(p => p.id === item.id);
        if (pulguita) total += pulguita.price * item.quantity;
      }
    });
    return total.toFixed(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white w-full max-w-md h-full shadow-xl p-6 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" />
                Tu Carrito
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
              <AnimatePresence>
                {cartItems.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-gray-500 py-10"
                  >
                    <p>Tu carrito está vacío. ¡Añade algo delicioso!</p>
                  </motion.div>
                ) : (
                  cartItems.map(item => (
                    <CartItem
                      key={`${item.type}-${item.id}`}
                      item={item.type === 'harina' ? { ...item, harina: harinas.find(h => h.id === item.id) } : item}
                      type={item.type}
                      onUpdateQuantity={onUpdateQuantity}
                      onRemoveItem={onRemoveItem}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-xl font-bold mb-4">
                <span className="text-gray-800">Total:</span>
                <span className="text-amber-600">${calculateTotal()}</span>
              </div>
              <motion.button
                onClick={onClose} // Just close the cart, actual order is sent from OrderSummary
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cerrar Carrito
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;