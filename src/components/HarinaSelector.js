import React, { useState, useEffect } from 'react'; // Importamos React y useState para manejar estados
import { motion } from 'framer-motion'; // Librería para animaciones suaves
import { Check } from 'lucide-react'; // Icono de check para selección
import { harinas } from '../data/products'; // Datos de harinas disponibles
import { formatPrice } from '../utils/formatPrice'; // Función para formatear precios
import { useTranslation } from 'react-i18next';

import { toast } from 'react-hot-toast'; // Importar toast para notificaciones

// import Mistletoe from './Mistletoe';

const HarinaSelector = ({ onAddPan, existingPanesCount, setIsAddButtonVisible }) => {
  const { t, i18n } = useTranslation();
  // Estado para almacenar las harinas seleccionadas por el usuario
  const [selectedHarinas, setSelectedHarinas] = useState([]);

  // Separar harinas reales de las opciones de corte (gratuitas)
  const flours = harinas.filter(h => h.price > 0);
  const cortes = harinas.filter(h => h.price === 0);
  const selectedFlourCount = selectedHarinas.filter(h => h.price > 0).length;

  // Notificar al componente padre si el botón flotante debe ser visible
  useEffect(() => {
    if (setIsAddButtonVisible) {
      setIsAddButtonVisible(selectedFlourCount > 0);
    }
    return () => {
      if (setIsAddButtonVisible) {
        setIsAddButtonVisible(false);
      }
    };
  }, [selectedFlourCount, setIsAddButtonVisible]);

  const maxHarinas = 6; // Máximo de harinas que se pueden seleccionar
  const fixedHarinaPrice = 5.50; // Precio fijo del pan base (sin extras)

  // Función para seleccionar o deseleccionar una harina
  const toggleHarina = (harina) => {
    setSelectedHarinas(prev => {
      // Si ya estaba seleccionada, la eliminamos
      if (prev.find(h => h.id === harina.id)) {
        return prev.filter(h => h.id !== harina.id);
      }
      // Las opciones de corte son exclusivas: elegir una quita la anterior
      if (harina.price === 0) {
        return [...prev.filter(h => h.price !== 0), harina];
      }
      // Harinas: respetar el máximo
      if (prev.filter(h => h.price > 0).length < maxHarinas) {
        return [...prev, harina];
      }
      return prev;
    });
  };

  // Función que se ejecuta al añadir un pan al carrito
  const handleAddPan = () => {
    if (selectedFlourCount === 0) return; // Hace falta al menos una harina real (el corte solo no forma un pan)

    // Crear un objeto pan personalizado y enviarlo al carrito
    onAddPan({
      id: Date.now(), // ID único para cada pan
      type: 'panPersonalizado', // Tipo de producto
      harinas: selectedHarinas, // Harinas seleccionadas
      price: fixedHarinaPrice, // Precio base
      quantity: 1, // Cantidad inicial
      extras: [] // Inicia sin extras, luego se pueden añadir
    });

    // Mostrar notificación de éxito
    toast.success(t('harina_selector.pan_added_toast'), {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#10B981',
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#10B981',
      },
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
      <div className="flex items-center justify-center gap-2 mb-2">
        {/* <Mistletoe className="w-8 h-8" /> */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
          {t('harina_selector.title')}
        </h2>
        {/* <Mistletoe className="w-8 h-8" /> */}
      </div>

      {/* Instrucciones para el usuario */}
      <p className="text-gray-500 dark:text-slate-300 text-center mb-4">
        {t('harina_selector.instructions', { price: formatPrice(fixedHarinaPrice) })}
      </p>

      {/* Grid de las harinas disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flours.map((harina, index) => (
          <motion.button
            key={harina.id}
            type="button" // Botón real: accesible con teclado y lectores de pantalla
            aria-pressed={!!selectedHarinas.find(h => h.id === harina.id)} // Estado de selección accesible
            className={`relative w-full p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedHarinas.find(h => h.id === harina.id)
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

            </div>
          </motion.button>
        ))}
      </div>

      {/* Sección de corte del pan (opcional y gratuito) */}
      <div className="mt-6 pt-5 border-t border-dashed border-amber-200 dark:border-slate-600">
        <h3 className="font-bold text-gray-800 dark:text-white text-center mb-1">
          🔪 {t('harina_selector.cut_title', { defaultValue: '¿Cómo quieres el corte?' })}
        </h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-3">
          {t('harina_selector.cut_subtitle', { defaultValue: 'Opcional y gratuito' })}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {cortes.map(corte => {
            const selected = !!selectedHarinas.find(h => h.id === corte.id);
            return (
              <button
                key={corte.id}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleHarina(corte)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-300 ${selected
                  ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md dark:bg-slate-700 dark:border-amber-400 dark:text-amber-100'
                  : 'border-gray-200 text-gray-600 hover:border-amber-300 dark:border-slate-600 dark:text-slate-300 dark:hover:border-amber-500 dark:bg-slate-700/50'
                  }`}
              >
                <span>{corte.image}</span>
                <span>{t(`products.harinas.${corte.id}.name`).replace(' (gratuito)', '').replace(' (free)', '')}</span>
                {selected && <Check className="w-4 h-4 text-amber-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botón para añadir pan al carrito, solo visible si hay harinas seleccionadas */}
      {selectedFlourCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-24 lg:bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none"
        >
          <button
            onClick={handleAddPan}
            className="bg-amber-500 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-amber-600 transition-all transform hover:scale-105 pointer-events-auto border-2 border-white dark:border-slate-800"
          >
            {existingPanesCount > 0 ? `${existingPanesCount + 1}º ` : ''}
            {t('harina_selector.add_button_dynamic', {
              flours: new Intl.ListFormat(i18n.language, { style: 'long', type: 'conjunction' }).format(
                selectedHarinas.filter(h => h.price > 0).map(h => t(`products.harinas.${h.id}.short_name`))
              )
            })}
            {' · '}{formatPrice(fixedHarinaPrice)}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HarinaSelector;
