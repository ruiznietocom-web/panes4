 import React, { useState } from "react";
import { motion } from "framer-motion";
import { pulguitas } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

const PulguitasPage = ({ selectedPulguitas, onUpdatePulguitaQuantity }) => {
  const [modalPhoto, setModalPhoto] = useState(null); // Estado para la foto del modal

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Pulguitas
      </h2>

      <p className="text-sm text-gray-500 mb-4 text-center">
        Si deseas alguna pulguita de una harina en especial contacta conmigo por WhatsApp cuando envíes el pedido.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pulguitas.map((pulguita, index) => (
          <motion.div
            key={pulguita.id}
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-4xl mb-2">{pulguita.image}</div>
            <h3 className="font-bold text-gray-800 mb-1">{pulguita.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{pulguita.description}</p>
            <p className="text-lg font-semibold text-purple-600">
              {formatPrice(pulguita.price)}
            </p>

            {/* Botón "Ver foto" para el pack específico */}
            {pulguita.id === 1.05 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitaclasica12.jpg")}
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}

            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                className="px-3 py-1 bg-gray-200 rounded"
                onClick={() =>
                  onUpdatePulguitaQuantity(
                    pulguita.id,
                    (selectedPulguitas[pulguita.id] || 0) - 1
                  )
                }
              >
                -
              </button>
              <span>{selectedPulguitas[pulguita.id] || 0}</span>
              <button
                className="px-3 py-1 bg-gray-200 rounded"
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
          <div className="relative bg-white p-4 rounded-lg max-w-md w-full">
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-2 right-2 text-gray-700 font-bold text-lg hover:text-red-500"
            >
              ✕
            </button>
            <img
              src={modalPhoto}
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

