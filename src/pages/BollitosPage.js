 // Importa React, necesario para crear componentes
import React from "react";

// Importa "motion" de Framer Motion para animaciones
import { motion } from "framer-motion";

// Importa los datos de los bollitos desde el archivo de productos
import { bollitos } from "../data/products";

// Importa la función para formatear los precios (por ejemplo, 2.5 → "2,50 €")
import { formatPrice } from "../utils/formatPrice";

// Define el componente BollitosPage, que recibe props desde el componente padre
const BollitosPage = ({ selectedBollitos, onUpdateBollitoQuantity }) => {
  return (
    // Contenedor principal animado
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-lg"
      // Estado inicial de la animación (invisible y desplazado hacia abajo)
      initial={{ opacity: 0, y: 20 }}
      // Estado final (visible y en posición normal)
      animate={{ opacity: 1, y: 0 }}
      // Duración de la animación (0.5 segundos)
      transition={{ duration: 0.5 }}
    >
      {/* Título principal */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Bollitos
      </h2>

      {/* Mensaje informativo */}
      <p className="text-sm text-gray-500 mb-4 text-center">
        Si deseas algún bollito de una harina en especial contacta conmigo por WhatsApp cuando envíes el pedido.
      </p>

      {/* Contenedor en cuadrícula para mostrar los bollitos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recorre el array "bollitos" y pinta cada producto */}
        {bollitos.map((bollito, index) => (
          <motion.div
            key={bollito.id} // Clave única para cada elemento
            className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 text-center"
            // Efecto de escala cuando se pasa el ratón
            whileHover={{ scale: 1.02 }}
            // Efecto al hacer clic (ligera reducción)
            whileTap={{ scale: 0.98 }}
            // Aparece con animación progresiva
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }} // Retraso para animación secuencial
          >
            {/* Icono o imagen del bollito */}
            <div className="text-4xl mb-2">{bollito.image}</div>

            {/* Nombre del bollito */}
            <h3 className="font-bold text-gray-800 mb-1">{bollito.name}</h3>

            {/* Descripción corta */}
            <p className="text-sm text-gray-600 mb-2">{bollito.description}</p>

            {/* Precio formateado */}
            <p className="text-lg font-semibold text-blue-600">
              {formatPrice(bollito.price)}
            </p>

                 {/* Botón "Ver foto" solo para el pack de bollito clasico */}
            {bollito.id === 1.06 && (
              <button
                onClick={() => setModalPhoto("/images/bollitoclasico6.jpg")} 
                // Al hacer click, se abre el modal con la foto
                className="mt-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
              >
                Ver foto
              </button>
            )}




            {/* Controles de cantidad */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {/* Botón para restar cantidad */}
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

              {/* Muestra la cantidad actual seleccionada */}
              <span>{selectedBollitos[bollito.id] || 0}</span>

              {/* Botón para sumar cantidad */}
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
            {/* Botón para cerrar el modal */}
            <button
              onClick={() => setModalPhoto(null)} // Cierra el modal
              className="absolute top-2 right-2 w-12 h-12 flex items-center justify-center text-white bg-orange-500 rounded-full text-3xl font-bold hover:bg-orange-700"
>
              ✕
            </button>

            {/* Imagen del modal */}
            <img
              src={modalPhoto} // Se muestra la foto seleccionada
              alt="Bollitos Clásicos"
              className="w-full h-auto rounded"
            />
          </div>
        </div>
      )}


    </motion.div>
  );
};

// Exporta el componente para que pueda ser usado en App.js u otras partes
export default BollitosPage;

