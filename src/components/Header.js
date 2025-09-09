import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import logo from '../assets/logo.jpg';

const Header = ({ cartItemCount, onOpenCart }) => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <motion.div 
          className="flex items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Logo redondo aumentado 50% */}
          <div className="p-1 bg-white/20 rounded-full overflow-hidden">
            <img src={logo} alt="Logo PanZen" className="w-[80px] h-[80px] object-cover rounded-full" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold">PanZen &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>
            <p className="text-amber-100 font-medium">Tu pan consciente personalizado</p>
          </div>
        </motion.div>

        <motion.button
          onClick={onOpenCart}
          className="relative p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ShoppingBag className="w-8 h-8" />
          {cartItemCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {cartItemCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
