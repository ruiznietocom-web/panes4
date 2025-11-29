import React, { useState } from "react"; // React y hook useState
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion"; // Para animaciones suaves
import { bollitos } from "../data/products"; // Lista de productos (bollitos)
import { formatPrice } from "../utils/formatPrice"; // Función para formatear precios

import Mistletoe from "../components/Mistletoe";

const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
  const { t } = useTranslation();
  // Estado para controlar qué foto mostrar en el modal
  const [modalPhoto, setModalPhoto] = useState(null);

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }} // animación inicial
      animate={{ opacity: 1, y: 0 }}  // animación final
      transition={{ duration: 0.5 }}   // duración de la animación
    >
      {/* Título */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Mistletoe className="w-8 h-8" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          {t('bollitos_page.title')}
        </h2>
        <Mistletoe className="w-8 h-8" />
      </div>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        {t('bollitos_page.message')}
      </p>

      {/* Contenedor centrado con Flexbox */}
      <div className="flex flex-wrap justify-center gap-6">
        {bollitos.map((bollito, index) => (
          <motion.div
            key={bollito.id}
            className="w-full sm:w-80 p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 text-center flex flex-col justify-between snow-cap"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Icono del producto */}
            <div className="text-4xl mb-2">{bollito.image}</div>

            {/* Nombre */}
            {/* Nombre */}
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{t(`products.bollitos.${bollito.id.toString().replace('.', '_')}.name`)}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t(`products.bollitos.${bollito.id.toString().replace('.', '_')}.description`)}</p>

            {/* Precio */}
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatPrice(bollito.price)}
            </p>




            {/* Botón para ver la foto si existe */}
            {bollito.photo && (
              <button
                onClick={() => setModalPhoto(bollito.photo)}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                {t('bollitos_page.view_photo')}
              </button>
            )}




            {/* Controles de cantidad */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                onClick={() =>
                  onUpdateBollitoQuantity(
                    bollito.id,
                    (selectedBollitos[bollito.id] || 0) - 1
                  )
                }
              >
                -
              </button>
              <span className="dark:text-white">{selectedBollitos[bollito.id] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                onClick={() =>
                  onUpdateBollitoQuantity(
                    bollito.id,
                    (selectedBollitos[bollito.id] || 0) + 1
                  )
                }
              >
                +
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal para mostrar la foto */}
      {modalPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative bg-white dark:bg-slate-800 p-4 rounded-lg max-w-md w-full">
            {/* Botón cerrar */}
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center text-white bg-blue-500 rounded-full text-3xl font-bold hover:bg-blue-700"
            >
              ✕
            </button>

            {/* Imagen */}
            <img
              src={modalPhoto}
              alt="Bollitos Clásicos"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BollitosPage;
