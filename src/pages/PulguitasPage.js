import React, { useState } from "react"; // React y hook useState
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion"; // Para animaciones suaves
import { pulguitas } from "../data/products"; // Lista de productos (pulguitas)
import { formatPrice } from "../utils/formatPrice"; // Función para formatear precios

// import Mistletoe from "../components/Mistletoe";

const PulguitasPage = ({ selectedPulguitas, onUpdatePulguitaQuantity }) => {
  const { t } = useTranslation();
  // Estado para controlar qué foto mostrar en el modal
  const [modalPhoto, setModalPhoto] = useState(null);

  return (
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }} // animación inicial: transparente y abajo
      animate={{ opacity: 1, y: 0 }}  // animación final: visible y en su posición
      transition={{ duration: 0.5 }}   // duración de la animación
    >
      {/* Título de la página */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* <Mistletoe className="w-8 h-8" /> */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          {t('pulguitas_page.title')}
        </h2>
        {/* <Mistletoe className="w-8 h-8" /> */}
      </div>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        {t('pulguitas_page.message')}
      </p>

      {/* Contenedor centrado con Flexbox */}
      <div className="flex flex-wrap justify-center gap-6">
        {pulguitas.map((pulguita, index) => (
          <motion.div
            key={pulguita.id} // clave única para React
            className="w-full sm:w-80 p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-700 transition-all duration-300 text-center flex flex-col justify-between"
            whileHover={{ scale: 1.02 }} // efecto al pasar el cursor
            whileTap={{ scale: 0.98 }}   // efecto al hacer click
            initial={{ opacity: 0, y: 20 }} // animación inicial
            animate={{ opacity: 1, y: 0 }}  // animación final
            transition={{ delay: index * 0.1 }} // animación escalonada
          >
            {/* Icono del producto */}
            <div className="text-4xl mb-2">{pulguita.image}</div>

            {/* Nombre del producto */}
            {/* Nombre del producto */}
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{t(`products.pulguitas.${pulguita.id.toString().replace('.', '_')}.name`)}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{t(`products.pulguitas.${pulguita.id.toString().replace('.', '_')}.description`)}</p>

            {/* Precio formateado */}
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              {formatPrice(pulguita.price)}
            </p>




            {/* Botón para ver la foto si existe */}
            {pulguita.photo && (
              <button
                onClick={() => setModalPhoto(pulguita.photo)}
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                {t('pulguitas_page.view_photo')}
              </button>
            )}






            {/* Controles de cantidad */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {/* Botón para restar 1 unidad */}
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                onClick={() =>
                  onUpdatePulguitaQuantity(
                    pulguita.id,
                    (selectedPulguitas[pulguita.id] || 0) - 1
                  )
                }
              >
                -
              </button>

              {/* Cantidad seleccionada */}
              <span className="dark:text-white">{selectedPulguitas[pulguita.id] || 0}</span>

              {/* Botón para sumar 1 unidad */}
              <button
                className="px-3 py-1 bg-gray-200 dark:bg-slate-600 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-slate-500 transition"
                onClick={() =>
                  onUpdatePulguitaQuantity(
                    pulguita.id,
                    (selectedPulguitas[pulguita.id] || 0) + 1
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
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setModalPhoto(null)} // Cierra el modal
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center text-white bg-purple-500 rounded-full text-3xl font-bold hover:bg-purple-700"
            >
              ✕
            </button>

            {/* Imagen del modal */}
            <img
              src={modalPhoto} // Se muestra la foto seleccionada
              alt="Pulguitas Clásicas"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PulguitasPage;
