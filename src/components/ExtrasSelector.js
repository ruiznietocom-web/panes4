import React from 'react'; 
// Importa React, necesario para usar JSX y componentes funcionales

import { extras as allExtras } from '../data/products'; 
// Importa la lista de extras desde tu archivo de productos y la renombra como allExtras

const ExtrasSelector = ({ cartItems, onUpdatePanExtras }) => { 
  // Componente funcional que recibe el carrito y una función para actualizar los extras de cada pan

  // Función para alternar extras de un pan específico
  const toggleExtra = (panId, extra) => {
    const newCartItems = cartItems.map(pan => {
      // Recorre todos los panes en el carrito
      if (pan.id === panId) {
        // Solo modifica el pan que coincide con el ID recibido
        const exists = pan.extras?.find(e => e.id === extra.id);
        // Verifica si el extra ya está agregado en este pan
        const updatedExtras = exists
          ? pan.extras.filter(e => e.id !== extra.id) // Si ya existe, se elimina del array de extras
          : [...(pan.extras || []), extra]; // Si no existe, se añade al array (o se crea un array si no hay extras)
        return { ...pan, extras: updatedExtras }; 
        // Devuelve un nuevo objeto pan con los extras actualizados
      }
      return pan; 
      // Si no es el pan correcto, se deja igual
    });
    onUpdatePanExtras(newCartItems); 
    // Llama a la función que actualiza el carrito con los cambios de extras
  };

  return (
    <div className="space-y-6">
      {/* Contenedor principal de todos los panes con espacio vertical entre ellos */}
      {cartItems
        .filter(item => item.type === 'panPersonalizado') 
        // Filtra solo los panes personalizados
        .map((pan, index) => (
          <div key={pan.id} className="bg-green-50 p-4 rounded-2xl shadow-md">
            {/* Contenedor de cada pan: fondo verde claro, padding, bordes redondeados y sombra */}
            
            {/* Título con número de pan y harinas seleccionadas */}
            <h3 className="font-bold mb-3 text-lg">
              Extras Pan {index + 1} ({pan.harinas.map(h => h.name).join(', ')})
              {/* Muestra el número de pan y lista los nombres de las harinas separadas por comas */}
            </h3>

            <div className="flex flex-wrap gap-4">
              {/* Contenedor para los botones de extras, flexible y con saltos de línea si no caben */}
              {allExtras.map(extra => {
                const selected = pan.extras?.some(e => e.id === extra.id);
                // Verifica si el extra ya está seleccionado para este pan
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleExtra(pan.id, extra)}
                    // Llama a toggleExtra al hacer clic
                    className={`flex flex-col items-center justify-center w-24 h-28 p-3 rounded-xl border transition-all duration-200
                      ${selected ? 'bg-green-200 border-green-400 scale-105 shadow-lg' : 'bg-white border-gray-300 hover:bg-gray-100 hover:scale-105'}`}
                    // Cambia el color, borde, tamaño y sombra según si está seleccionado
                  >
                    {/* ICONO DEL EXTRA: puedes cambiar su tamaño aquí */}
                    <span className="text-4xl mb-2">{extra.icon}</span>
                    {/* Muestra el emoji o icono del extra */}

                    {/* NOMBRE DEL EXTRA */}
                    <span className="text-center font-semibold text-sm">{extra.name}</span>
                    {/* Muestra el nombre del extra centrado y con estilo de fuente semi-negrita */}

                    {/* PRECIO DEL EXTRA */}
                    <span className="text-center text-xs text-gray-600">{extra.price.toFixed(2)}€</span>
                    {/* Muestra el precio con dos decimales, centrado y en gris */}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
};

export default ExtrasSelector;
// Exporta el componente para poder usarlo en otros archivos
