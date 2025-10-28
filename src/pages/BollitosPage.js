 import React, { useState } from "react"; // React y hook useState
import { motion } from "framer-motion"; // Para animaciones suaves
import { bollitos } from "../data/products"; // Lista de productos (bollitos)
import { formatPrice } from "../utils/formatPrice"; // Función para formatear precios

const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
  // Estado para controlar qué foto mostrar en el modal
  const [modalPhoto, setModalPhoto] = useState(null);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }} // animación inicial
      animate={{ opacity: 1, y: 0 }}  // animación final
      transition={{ duration: 0.5 }}   // duración de la animación
    >
      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Bollitos
      </h2>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 mb-4 text-center">
        Si deseas algún bollito de una harina en especial contacta conmigo por WhatsApp cuando envíes el pedido.
      </p>

      {/* Contenedor en cuadrícula */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bollitos.map((bollito, index) => (
          <motion.div
            key={bollito.id}
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Icono del producto */}
            <div className="text-4xl mb-2">{bollito.image}</div>

            {/* Nombre */}
            <h3 className="font-bold text-gray-800 mb-1">{bollito.name}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mb-2">{bollito.description}</p>

            {/* Precio */}
            <p className="text-lg font-semibold text-blue-600">
              {formatPrice(bollito.price)}
            </p>

            {/* Botón para ver la foto solo en bollitos clásicos */}
            {bollito.id === 2.03 && (
              <button
                onClick={() => setModalPhoto("/images/bollitoclasico6.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
              >
                Ver foto
              </button>
            )}

            {/* Controles de cantidad */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() =>
                  onUpdateBollitoQuantity(
                    bollito.id,
                    (selectedBollitos[bollito.id] || 0) - 1
                  )
                }
              >
                -
              </button>
              <span>{selectedBollitos[bollito.id] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded"
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
          <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
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

