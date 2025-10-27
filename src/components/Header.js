 import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg'; // tu logo redondo de la izquierda

const Header = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white p-6 shadow-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* 🥖 Logo PanZen a la izquierda */}
        <motion.div 
          className="flex items-center gap-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div
            className="p-1 bg-white/20 rounded-full overflow-hidden shadow-md"
            animate={{ scale: [1, 1.05, 1, 1.05, 1] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
          >
            <img 
              src={logo} 
              alt="Logo PanZen" 
              className="w-[80px] h-[80px] object-cover rounded-full" 
            />
          </motion.div>

          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-tight font-poppins drop-shadow-md">
              PanZen
            </h1>
            <p className="text-amber-100 font-medium text-sm font-poppins">
              Tu pan consciente personalizado
            </p>
          </div>
        </motion.div>

        {/* 📱 Botón de descarga app a la derecha */}
        <motion.a
          href="/PanZen.apk"
          download
          className="flex items-center gap-3 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-2xl shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src="/logoandroid.png" 
            alt="Descargar App Android" 
            className="w-[35px] h-[35px] object-contain" 
          />
          <span className="font-semibold text-white text-sm">
            Descarga la app
          </span>
        </motion.a>
      </div>
    </motion.header>
  );
};

export default Header;

