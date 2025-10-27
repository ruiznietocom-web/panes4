 import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.jpg';

const Header = () => {
  return (
    <motion.header 
      className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-white p-6 shadow-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Logo principal */}
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

        {/* Botón de descarga APK */}
        <motion.a
          href="/PanZen.apk"
          download
          className="flex flex-col items-center text-white hover:opacity-90 transition-opacity duration-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Fondo redondeado detrás del logo */}
          <div className="bg-white p-3 rounded-full shadow-lg flex items-center justify-center mb-1">
            <motion.img 
              src="/logoandroid.png" 
              alt="Descargar App Android" 
              className="w-[45px] h-[45px] object-contain"
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>

          <span className="font-medium text-xs tracking-wide text-amber-100">
            Descarga la App
          </span>
        </motion.a>

      </div>
    </motion.header>
  );
};

export default Header;

