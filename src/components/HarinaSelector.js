import React, { useState } from 'react'; // Importamos React y useState para manejar estados
import { motion } from 'framer-motion'; // Librería para animaciones suaves
import { Check } from 'lucide-react'; // Icono de check para selección
import { harinas } from '../data/products'; // Datos de harinas disponibles
import { formatPrice } from '../utils/formatPrice'; // Función para formatear precios
import { useTranslation } from 'react-i18next';

const HarinaSelector = ({ onAddPan }) => {
  const { t } = useTranslation();
  // Estado para almacenar las harinas seleccionadas por el usuario
  const [selectedHarinas, setSelectedHarinas] = useState([]);

  const maxHarinas = 6; // Máximo de harinas que se pueden seleccionar
  const fixedHarinaPrice = 5.50; // Precio fijo del pan base (sin extras)

  // Función para seleccionar o deseleccionar una harina
  const toggleHarina = (harina) => {
    setSelectedHarinas(prev => {
      // Si la harina ya estaba seleccionada, la eliminamos
      if (prev.find(h => h.id === harina.id)) {
        return prev.filter(h => h.id !== harina.id);
        // Si no está seleccionada y no se ha alcanzado el máximo, la añadimos
      } else if (prev.length < maxHarinas) {
        return [...prev, harina];
      }
      // Si se alcanzó el máximo, no hacer nada
      return prev;
    });
  };

  // Función que se ejecuta al añadir un pan al carrito
  const handleAddPan = () => {
    if (selectedHarinas.length === 0) return; // No añadir si no hay harinas seleccionadas

    // Crear un objeto pan personalizado y enviarlo al carrito
    onAddPan({
      id: Date.now(), // ID único para cada pan
      type: 'panPersonalizado', // Tipo de producto
      harinas: selectedHarinas, // Harinas seleccionadas
      price: fixedHarinaPrice, // Precio base
      quantity: 1, // Cantidad inicial
      extras: [] // Inicia sin extras, luego se pueden añadir
    });

    // Limpiar selección para que se pueda crear otro pan
    setSelectedHarinas([]);
  };

  return (
    // Contenedor principal con animación de aparición
    <motion.div
      className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg dark:shadow-none mb-6 transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Título del selector */}
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
        {t('harina_selector.title')}
      </h2>

      {/* Instrucciones para el usuario */}
      <p className="text-gray-500 dark:text-slate-300 text-center mb-4">
        {t('harina_selector.instructions', { price: formatPrice(fixedHarinaPrice) })}
      </p>

      {/* Grid de las harinas disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map((harina, index) => (
          <motion.div
            key={harina.id}
            className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedHarinas.find(h => h.id === harina.id)
              ? 'border-amber-500 bg-amber-50 dark:bg-slate-700 dark:border-amber-400 shadow-md' // Estilo cuando está seleccionada
              : 'border-gray-200 dark:border-slate-600 hover:border-amber-300 dark:hover:border-amber-500 dark:bg-slate-700/50' // Estilo normal / hover
              }`}
            onClick={() => toggleHarina(harina)} // Selecciona/deselecciona al hacer click
            whileHover={{ scale: 1.02 }} // Pequeño efecto al pasar el ratón
            whileTap={{ scale: 0.98 }} // Efecto al hacer click
            initial={{ opacity: 0, y: 20 }} // Animación inicial
            animate={{ opacity: 1, y: 0 }} // Animación final
            transition={{ delay: index * 0.05 }} // Animación con retraso progresivo
          >
            {/* Check visible cuando la harina está seleccionada */}
            {selectedHarinas.find(h => h.id === harina.id) && (
              <motion.div
                className="absolute top-2 right-2 bg-amber-500 text-white rounded-full p-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Check className="w-4 h-4" /> {/* Icono check */}
              </motion.div>
            )}

            {/* Contenido de la tarjeta de harina */}
            <div className="text-center">
              <div className="text-4xl mb-2">{harina.image}</div> {/* Emoji o imagen de la harina */}
              <h3 className="font-bold text-gray-800 dark:text-white mb-1">{t(`products.harinas.${harina.id}.name`)}</h3> {/* Nombre */}
              <p className="text-sm text-gray-600 dark:text-slate-300 mb-2">{t(`products.harinas.${harina.id}.description`)}</p> {/* Descripción */}
              <span className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatPrice(harina.price)}</span> {/* Precio individual */}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botón para añadir pan al carrito, solo visible si hay harinas seleccionadas */}
      {selectedHarinas.length > 0 && (
        <div className="text-center mt-4">
          <button
            onClick={handleAddPan} // Llama a la función para añadir pan
            className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-amber-600 transition"
          >
            {t('harina_selector.add_button')}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default HarinaSelector;
