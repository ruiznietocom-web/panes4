import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from "framer-motion";
import { pulguitas } from "../data/products";
import { formatPrice } from "../utils/formatPrice";
import AllergenBadges from "../components/AllergenBadges";
import MitadYMitadCard from "../components/MitadYMitadCard";
import { Sparkles, CircleDot, Plus, Minus, X, ZoomIn } from "lucide-react";

const PulguitasPage = ({ selectedPulguitas = {}, onUpdatePulguitaQuantity, cartItems = [] }) => {
  const { t } = useTranslation();
  const [modalPhoto, setModalPhoto] = useState(null);

  return (
    <motion.div
      className="bg-white/90 dark:bg-stone-900/90 rounded-3xl p-6 sm:p-8 shadow-artisan border border-amber-900/10 dark:border-stone-800 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Título de la página */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-900/30 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <CircleDot className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Pulguitas</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-white">
          {t('pulguitas_page.title')}
        </h2>
        <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
          {t('pulguitas_page.message')}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {pulguitas.map((pulguita, index) => {
          const qty = selectedPulguitas[pulguita.id] || 0;
          const isPack = pulguita.name.toUpperCase().includes('PACK');

          return (
            <motion.div
              key={pulguita.id}
              className={`rounded-2xl border-2 p-4 text-center flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                qty > 0
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-stone-800 dark:border-amber-400 shadow-md ring-2 ring-amber-400/20'
                  : 'border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-500/60 bg-stone-50/40 hover:bg-white dark:bg-stone-800/40 dark:hover:bg-stone-800'
              }`}
              whileHover={{ y: -3 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              {/* Badge superior */}
              {isPack && (
                <div className="absolute top-3 left-3 z-10 bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Pack Ahorro
                </div>
              )}

              {/* Imagen o Icono */}
              <div className="relative mb-3">
                {pulguita.photo ? (
                  <button
                    type="button"
                    onClick={() => setModalPhoto({ src: pulguita.photo, name: pulguita.name })}
                    className="relative block w-full h-44 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-700 shadow-inner group/img"
                    title={t('pulguitas_page.view_photo')}
                  >
                    <img
                      src={pulguita.photo}
                      alt={t(`products.pulguitas.${pulguita.id.toString().replace('.', '_')}.name`)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/img:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="p-2 rounded-full bg-white/80 dark:bg-stone-900/80 text-stone-900 dark:text-white shadow-md">
                        <ZoomIn className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="h-44 flex items-center justify-center text-5xl bg-amber-100/40 dark:bg-stone-700/50 rounded-xl">
                    {pulguita.image}
                  </div>
                )}
              </div>

              {/* Nombre y descripción */}
              <div className="flex-1 flex flex-col justify-between mb-3">
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white mb-1 leading-snug">
                    {t(`products.pulguitas.${pulguita.id.toString().replace('.', '_')}.name`)}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-2">
                    {t(`products.pulguitas.${pulguita.id.toString().replace('.', '_')}.description`)}
                  </p>
                </div>

                <AllergenBadges allergens={pulguita.allergens} className="mb-2" />

                <p className="text-lg font-serif font-bold text-amber-700 dark:text-amber-400">
                  {formatPrice(pulguita.price)}
                </p>
              </div>

              {/* Selector de cantidad táctil */}
              <div className="pt-2 border-t border-stone-200/80 dark:border-stone-700/60 flex items-center justify-center">
                <div className="inline-flex items-center bg-stone-100 dark:bg-stone-700/80 p-1 rounded-full border border-stone-200 dark:border-stone-600 shadow-inner">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-amber-100 dark:hover:bg-stone-600 transition shadow-xs disabled:opacity-40"
                    aria-label="-1"
                    disabled={qty === 0}
                    onClick={() => onUpdatePulguitaQuantity(pulguita.id, qty - 1)}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="w-9 text-center font-bold text-sm text-stone-900 dark:text-white">
                    {qty}
                  </span>

                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition shadow-xs"
                    aria-label="+1"
                    onClick={() => onUpdatePulguitaQuantity(pulguita.id, qty + 1)}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Opción Mitad y Mitad */}
      <div className="mt-10">
        <MitadYMitadCard
          productType="pulguita"
          cartItems={cartItems}
          onUpdateQuantity={onUpdatePulguitaQuantity}
        />
      </div>

      {/* Modal Lightbox de Foto */}
      <AnimatePresence>
        {modalPhoto && (
          <div
            className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setModalPhoto(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white dark:bg-stone-900 p-3 sm:p-4 rounded-3xl max-w-lg w-full shadow-2xl border border-amber-900/20 dark:border-stone-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalPhoto(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-stone-900/70 text-white hover:bg-stone-950 transition"
                aria-label="Cerrar foto"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={modalPhoto.src}
                alt={modalPhoto.name}
                className="w-full h-auto max-h-[75vh] object-cover rounded-2xl shadow-lg"
              />
              <p className="text-center font-serif font-bold text-stone-800 dark:text-stone-200 mt-3 text-sm">
                {modalPhoto.name}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PulguitasPage;
