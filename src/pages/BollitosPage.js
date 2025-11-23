import React, { useState } from "react"; // React y hook useState
import { motion } from "framer-motion"; // Para animaciones suaves
import { bollitos } from "../data/products"; // Lista de productos (bollitos)
import { formatPrice } from "../utils/formatPrice"; // Función para formatear precios

const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
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
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">
        Elige tus Bollitos Integrales Ecológicos
      </h2>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
        Si deseas algún bollito de una harina en especial contacta conmigo por WhatsApp cuando envíes el pedido.
      </p>

      {/* Contenedor en cuadrícula */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bollitos.map((bollito, index) => (
          <motion.div
            key={bollito.id}
            className="p-4 rounded-xl border-2 border-gray-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Icono del producto */}
            <div className="text-4xl mb-2">{bollito.image}</div>

            {/* Nombre */}
            <h3 className="font-bold text-gray-800 dark:text-white mb-1">{bollito.name}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{bollito.description}</p>

            {/* Precio */}
            <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {formatPrice(bollito.price)}
            </p>




            {/* Botón para ver la foto solo en bollitos clásicos */}
            {bollito.id === 1 && (
              <button
                onClick={() => setModalPhoto("/images/bolloclasicounidad.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
              </button>
            )}


            {/* Botón para ver la foto solo 7 bollitos  */}
            {bollito.id === 1.1 && (
              <button
                onClick={() => setModalPhoto("/images/7bollos.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
              </button>
            )}






            {/* Botón para ver la foto solo en bollitos unidad */}
            {bollito.id === 1.06 && (
              <button
                onClick={() => setModalPhoto("/images/bollitoclasico6.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
              </button>
            )}



            {/* Botón para ver la foto solo en bollitos nueces 6 */}
            {bollito.id === 1.3 && (
              <button
                onClick={() => setModalPhoto("/images/bollitosnueces6.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
              </button>
            )}


            {/* Botón para ver la foto solo en bollitos unidad */}
            {bollito.id === 1.07 && (
              <button
                onClick={() => setModalPhoto("/images/molletescenteno.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
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

