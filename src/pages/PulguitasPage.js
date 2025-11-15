 import React, { useState } from "react"; // React y hook useState
import { motion } from "framer-motion"; // Para animaciones suaves
import { pulguitas } from "../data/products"; // Lista de productos (pulguitas)
import { formatPrice } from "../utils/formatPrice"; // Función para formatear precios

const PulguitasPage = ({ selectedPulguitas, onUpdatePulguitaQuantity }) => {
  // Estado para controlar qué foto mostrar en el modal
  const [modalPhoto, setModalPhoto] = useState(null);

  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }} // animación inicial: transparente y abajo
      animate={{ opacity: 1, y: 0 }}  // animación final: visible y en su posición
      transition={{ duration: 0.5 }}   // duración de la animación
    >
      {/* Título de la página */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Pulguitas Integrales Ecológicas
      </h2>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 mb-4 text-center">
        Si deseas alguna pulguita de una harina en especial contacta conmigo por WhatsApp cuando envíes el pedido.
      </p>

      {/* Contenedor de los productos en grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pulguitas.map((pulguita, index) => (
          <motion.div
            key={pulguita.id} // clave única para React
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 text-center"
            whileHover={{ scale: 1.02 }} // efecto al pasar el cursor
            whileTap={{ scale: 0.98 }}   // efecto al hacer click
            initial={{ opacity: 0, y: 20 }} // animación inicial
            animate={{ opacity: 1, y: 0 }}  // animación final
            transition={{ delay: index * 0.1 }} // animación escalonada
          >
            {/* Icono del producto */}
            <div className="text-4xl mb-2">{pulguita.image}</div>

            {/* Nombre del producto */}
            <h3 className="font-bold text-gray-800 mb-1">{pulguita.name}</h3>

            {/* Descripción */}
            <p className="text-sm text-gray-600 mb-2">{pulguita.description}</p>

            {/* Precio formateado */}
            <p className="text-lg font-semibold text-purple-600">
              {formatPrice(pulguita.price)}
            </p>




            {/* Botón "Ver foto" solo para el pack de pulguitas clásicas */}
            {pulguita.id === 1.05 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitaclasica12.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}


 {/* Botón "Ver foto" solo para una de pulguitas semilla */}
            {pulguita.id === 6 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitasemilla.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}








  {/* Botón "Ver foto" solo para el pack de pulguitas semillas */}
            {pulguita.id === 1.2 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitasemilla12.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}



       {/* Botón "Ver foto" solo para el pack de pulguitas nueces */}
            {pulguita.id === 1.3 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitanuez12.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}



       {/* Botón "Ver foto" solo para el pack de pulguitas unidad */}
            {pulguita.id === 1 && (
              <button
                onClick={() => setModalPhoto("/images/pulguitaclasicaunidad.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}









            {/* Controles de cantidad */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {/* Botón para restar 1 unidad */}
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

              {/* Cantidad seleccionada */}
              <span>{selectedPulguitas[pulguita.id] || 0}</span>

              {/* Botón para sumar 1 unidad */}
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

