import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, setCartItems }) => {
  const panesPersonalizadosInCart = cartItems.filter(item => item.type === 'panPersonalizado');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');

  const calculateTotal = () => {
    let total = 0;
    panesPersonalizadosInCart.forEach(pan => {
      total += pan.price * pan.quantity;
    });
    extrasInCart.forEach(extra => {
      total += extra.price * extra.quantity;
    });
    return total;
  };

  const generateWhatsAppMessage = () => {
    let message = "🛒 *Resumen de tu pedido:*\n\n";

    if (panesPersonalizadosInCart.length > 0) {
      message += `*PANES PERSONALIZADOS:*\n`;
      panesPersonalizadosInCart.forEach((pan, index) => {
        message += `Pan ${index + 1} (${formatPrice(pan.price)}):\n`;
        pan.harinas.forEach(h => {
          message += `• ${h.image ? h.image + " " : ""}${h.name}\n`;
        });
        message += "\n";
      });
    }

    if (extrasInCart.length > 0) {
      message += `*EXTRAS:*\n`;
      extrasInCart.forEach(extra => {
        message += `• ${extra.image ? extra.image + " " : ""}${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    message += `\n*Total:* ${formatPrice(calculateTotal())}`;
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "34600111222"; // cambia por tu número
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Resumen del Pedido</h2>

      {/* Panes Personalizados */}
      {panesPersonalizadosInCart.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-700">Panes Personalizados:</h3>
          {panesPersonalizadosInCart.map((pan, index) => (
            <div
              key={pan.id}
              className="p-3 bg-amber-50 rounded-lg shadow-sm"
            >
              <h4 className="font-bold text-amber-700">
                Pan {index + 1}
              </h4>
              <ul className="ml-4 list-disc text-gray-700">
                {pan.harinas.map((h) => (
                  <li key={h.id}>
                    {h.image ? h.image + " " : ""}{h.name}
                  </li>
                ))}
              </ul>
              <div className="mt-2 font-bold text-gray-900">
                {formatPrice(pan.price)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extras */}
      {extrasInCart.length > 0 && (
        <div className="space-y-2 mb-6">
          <h3 className="font-semibold text-gray-700">Extras:</h3>
          {extrasInCart.map((extra) => (
            <div key={extra.id} className="flex justify-between items-center p-2 border-b">
              <span>{extra.image ? extra.image + " " : ""}{extra.name}</span>
              <span>{formatPrice(extra.price)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="text-right text-xl font-bold text-gray-900 mb-4">
        Total: {formatPrice(calculateTotal())}
      </div>

      {/* Botón WhatsApp */}
      <button
        onClick={handleSendWhatsApp}
        className="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-green-600 transition"
      >
        Enviar Pedido por WhatsApp
      </button>
    </motion.div>
  );
};

export default OrderSummary;
