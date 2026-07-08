import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

// Barra fija inferior que solo se muestra en móvil/tablet (oculta en lg+,
// donde el resumen ya es visible en la columna derecha).
// Muestra nº de artículos + subtotal y lleva al resumen del pedido al tocarla.
const MobileCartBar = ({ itemCount, subtotal }) => {
  const { t } = useTranslation();

  const scrollToSummary = () => {
    const el = document.getElementById('order-summary');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {itemCount > 0 && (
        <motion.button
          type="button"
          onClick={scrollToSummary}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-5 py-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-amber-200 dark:border-slate-600 shadow-[0_-4px_16px_rgba(0,0,0,0.12)]"
          aria-label={t('cart_bar.view', { defaultValue: 'Ver pedido' })}
        >
          {/* Cesta con contador */}
          <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-amber-100 dark:bg-slate-700">
            <ShoppingBasket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <motion.span
              key={itemCount}
              initial={{ scale: 1.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold"
            >
              {itemCount}
            </motion.span>
          </span>

          {/* Subtotal */}
          <span className="flex-1 text-left">
            <span className="block text-xs text-gray-500 dark:text-gray-400 leading-none mb-0.5">
              {t('order_summary.total')}
            </span>
            <span className="block text-lg font-bold text-gray-800 dark:text-white leading-none">
              {formatPrice(subtotal)}
            </span>
          </span>

          {/* Llamada a la acción */}
          <span className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm px-4 py-2.5 rounded-full shadow-md">
            {t('cart_bar.view', { defaultValue: 'Ver pedido' })}
            <ChevronUp className="w-4 h-4" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MobileCartBar;
