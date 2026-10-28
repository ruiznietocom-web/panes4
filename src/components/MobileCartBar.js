import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBasket, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

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
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-5 py-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-amber-900/10 dark:border-stone-800 shadow-[0_-8px_25px_rgba(120,53,15,0.12)]"
          aria-label={t('cart_bar.view', { defaultValue: 'Ver pedido' })}
        >
          {/* Cesta con contador */}
          <span className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-100 dark:bg-stone-800 text-amber-800 dark:text-amber-300">
            <ShoppingBasket className="w-5 h-5" />
            <motion.span
              key={itemCount}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-amber-500 text-stone-950 text-[11px] font-black shadow-sm"
            >
              {itemCount}
            </motion.span>
          </span>

          {/* Subtotal */}
          <span className="flex-1 text-left">
            <span className="block text-[11px] font-medium text-stone-500 dark:text-stone-400 leading-none mb-0.5">
              {t('order_summary.total')}
            </span>
            <span className="block text-lg font-serif font-bold text-stone-900 dark:text-white leading-none">
              {formatPrice(subtotal)}
            </span>
          </span>

          {/* Llamada a la acción */}
          <span className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-md animate-shimmer">
            {t('cart_bar.view', { defaultValue: 'Ver pedido' })}
            <ChevronUp className="w-4 h-4" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default MobileCartBar;
