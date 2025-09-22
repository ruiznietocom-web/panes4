import React from 'react'; 
// Importa React, necesario para crear componentes funcionales y usar hooks como useState.

import { motion } from 'framer-motion';
// Importa 'motion' de framer-motion para animar elementos (entrada, hover, tap, etc.).

import { MessageCircle, Trash2 } from 'lucide-react';
// Importa iconos: MessageCircle (WhatsApp) y Trash2 (botón eliminar).

import { bollitos, pulguitas } from '../data/products';
// Importa los productos "bollitos" y "pulguitas" desde un archivo de datos.

import { formatPrice } from '../utils/formatPrice';
// Función para formatear precios (ej: 1.5 → "1,50 €").


// Componente principal OrderSummary
const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
  // cartItems: array de productos en la cesta
  // onSendWhatsApp: función para enviar pedido por WhatsApp
  // onRemoveItem: función para eliminar un producto de la cesta

  // Lista de extras opcionales
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  // Estados
  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);
  // Guarda los ids de extras seleccionados

  const [discountCode, setDiscountCode] = React.useState("");
  // Código de descuento ingresado

  const [appliedDiscount, setAppliedDiscount] = React.useState(null);
  // Descuento aplicado actualmente (objeto o null)


  // Función para añadir o quitar un extra opcional
  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  // Filtra los productos por tipo
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');





  // Códigos de descuento válidos
  const discountCodes = {
    PANZEN30: { type: "percentage", value: 30, minPurchase: 30 },
    PANZEN20: { type: "percentage", value: 20, minPurchase: 40 }
  };

  // Aplica descuento si el código es válido
  const applyDiscount = () => {
    const code = discountCode.toUpperCase(); // pasar a mayúsculas
    if (discountCodes[code]) {
      setAppliedDiscount(discountCodes[code]);
    } else {
      setAppliedDiscount(null);
      alert("Código no válido");
    }
  };

  // Función para calcular subtotal, descuento y total
  const calculateTotals = () => {
    let subtotal = 0; // suma de todo
    let discountBase = 0; // suma que aplica para descuento

    // Panes personalizados
    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0; // sumar extras
      const panTotal = p.price + extrasTotal;
      subtotal += panTotal;
      discountBase += panTotal;
    });

    // Bollitos
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) {
        subtotal += b.price * item.quantity;
        discountBase += b.price * item.quantity;
      }
    });

    // Pulguitas
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) {
        subtotal += p.price * item.quantity;
        discountBase += p.price * item.quantity;
      }
    });

    // Extras opcionales → NO cuentan para descuento
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) subtotal += e.price;
    });

    // Aplicar descuento si corresponde
    let discountAmount = 0;
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      discountAmount = discountBase * (appliedDiscount.value / 100);
    }

    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  // Desestructurar los totales
  const { subtotal, discountAmount, total } = calculateTotals();

  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    // Agregar panes personalizados
    if (pansPersonalizados.length > 0) {
      message += `\n*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        message += `🌾 Pan ${index + 1}:\n`;
        pan.harinas.forEach(h => {
          const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
          message += `• ${h.icon ? h.icon + ' ' : ''}${h.name}${hasCortado ? ' 🔪' : ''}\n`;
        });
        if (pan.extras?.length > 0) {
          message += `Extras:\n`;
          pan.extras.forEach(e => {
            message += `• ${e.icon ? e.icon + ' ' : ''}${e.name} (${formatPrice(e.price)})\n`;
          });
        }
      });
    }

    // Bollitos
    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    // Pulguitas
    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    // Extras opcionales
    if (selectedOptionalExtras.length > 0) {
      message += `\n*EXTRAS OPCIONALES:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    // Descuento aplicado
    if (appliedDiscount) {
      message += `\n*DESCUENTO APLICADO: ${appliedDiscount.value}%*\n`;
    }

    message += `\n*TOTAL: ${formatPrice(total)}*\n\n`;
    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.\n`;
    message += `📱 PARA MÁS PEDIDOS USA LA AppWeb ---> https://panespersonalizados.netlify.app/\n`;

    return encodeURIComponent(message); // codifica el mensaje para URL
  };

  // Función para abrir WhatsApp con mensaje predefinido
  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  // Booleano para saber si la cesta está vacía
  const isOrderEmpty = cartItems.length === 0;

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }} // animación de entrada
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🧺</span> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {/* Mensaje cesta vacía */}
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            Tu cesta está vacía. ¡Añade algo delicioso!
          </div>
        )}

        {/* PANES PERSONALIZADOS */}
        {pansPersonalizados.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">🌾 Panes Personalizados:</h3>
            {pansPersonalizados.map((pan, index) => (
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg relative">
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <span className="font-bold">🌾 Pan {index + 1}:</span>
                {pan.harinas.map(h => {
                  const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
                  return (
                    <span key={h.id}>
                      • {h.icon ? h.icon + ' ' : ''}{h.name}{hasCortado ? ' 🔪' : ''}
                    </span>
                  );
                })}
                {pan.extras?.length > 0 && (
                  <div className="mt-1 ml-2">
                    <span className="font-semibold">Extras:</span>
                    {pan.extras.map(extra => (
                      <div key={extra.id}>• {extra.icon ? extra.icon + ' ' : ''}{extra.name} ({formatPrice(extra.price)})</div>
                    ))}
                  </div>
                )}
                <span className="mt-1 font-bold">
                  Precio: {formatPrice(pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* BOLLITOS */}
        {bollitosInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {bollitosInCart.map(item => {
              const b = bollitos.find(b => b.id === item.id);
              return b && (
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg relative">
                  <span>{b.name} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                  <button className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'bollito')}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PULGUITAS */}
        {pulguitasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {pulguitasInCart.map(item => {
              const p = pulguitas.find(p => p.id === item.id);
              return p && (
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg relative">
                  <span>{p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                  <button className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'pulguita')}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* EXTRAS OPCIONALES */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">MANUEL, QUÉ RICO TU PAN!...:</h3>
          <div className="flex gap-3 flex-wrap">
            {optionalExtras.map(extra => (
              <button
                key={extra.id}
                onClick={() => toggleOptionalExtra(extra)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${
                  selectedOptionalExtras.includes(extra.id)
                    ? 'bg-yellow-100 border-yellow-400'
                    : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <span>{extra.icon}</span>
                <span>{extra.name} ({formatPrice(extra.price)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* CÓDIGO DE DESCUENTO */}
        <div className="mt-4">
          <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Introduce tu código"
            className="border rounded-lg p-2 mr-2" />
          <button onClick={applyDiscount} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Aplicar</button>
          {appliedDiscount && <p className="text-green-600 mt-2">
            Código aplicado: {appliedDiscount.value}% de descuento
          </p>}
        </div>

        {/* TOTAL */}
        <div className="border-t pt-3 mt-3 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* BOTÓN WHATSAPP */}
      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
        whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
        whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
      >
        <MessageCircle className="w-6 h-6" /> Enviar Pedido por WhatsApp
      </motion.button>

    </motion.div>
  );
};

export default OrderSummary;
// Exporta el componente para poder usarlo en otros archivos
