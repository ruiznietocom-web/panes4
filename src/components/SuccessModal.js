import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Sparkles } from 'lucide-react';

const SuccessModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-stone-900 rounded-3xl p-8 max-w-md w-full text-center relative border border-amber-900/15 dark:border-stone-700 shadow-2xl"
            initial={{ scale: 0.85, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            
            <motion.div
              className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50 dark:ring-emerald-900/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 20 }}
            >
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </motion.div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-stone-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              ¡Directo a Obrador!
            </div>

            <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white mb-2">
              ¡Pedido Enviado!
            </h3>
            
            <p className="text-sm text-stone-600 dark:text-stone-300 mb-6 leading-relaxed">
              Tu pedido ha sido preparado y enviado por WhatsApp. Te contactaremos enseguida para confirmar la hora de entrega. ¡Muchas gracias por apoyar el pan artesano y ecológico!
            </p>
            
            <motion.button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold py-3.5 px-6 rounded-2xl shadow-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Volver a la tienda
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
