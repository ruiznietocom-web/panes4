import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => total += item.price * item.quantity);
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = '*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n';

    cartItems.forEach(item => {
      if (item.type === 'panPersonalizado') {
        message += '\n*PAN PERSONALIZADO:*\n';
        item.harinas.forEach(h => message += `• 🌾 ${h.name}\n`);
        message += `Corte: ${item.corte}\n`;
        message += `Precio: ${formatPrice(item.price * item.quantity)}\n`;
      }
      if (item.type === 'extra') {
        message += `• ${item.icon} ${item.name} - ${formatPrice(item.price)}\n`;
      }
      if (item.type === 'bollito' || item.type === 'pulguita') {
        message += `• ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      }
    });

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += '🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n';
    message += '🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. ¡MUCHAS GRACIAS!\n';

    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const phoneNumber = "627526380";
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <MessageCircle className="w-6 h-6" /> Resumen del Pedido
      </h2>

      {cartItems.length === 0 && <p className="text-gray-500 text-center">Tu carrito está vacío.</p>}

      {cartItems.map(item => (
        <div key={item.cartId} className="mb-4 p-2 rounded-lg bg-amber-50">
          {item.type === 'panPersonalizado' && (
            <>
              <strong>PAN PERSONALIZADO:</strong>
              <ul className="ml-4">
                {item.harinas.map(h => <li key={h.id}>🌾 {h.name}</li>)}
              </ul>
              <p>Corte: {item.corte}</p>
              <p>Precio: {formatPrice(item.price * item.quantity)}</p>
            </>
          )}
          {item.type === 'bollito' || item.type === 'pulguita' ? (
            <div className="flex justify-between">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ) : null}
          {item.type === 'extra' && <p>{item.icon} {item.name} - {formatPrice(item.price)}</p>}
        </div>
      ))}

      <div className="border-t pt-3 mt-3 flex justify-between items-center text-xl font-bold">
        <span>Total:</span>
        <span>{formatPrice(calculateTotal())}</span>
      </div>

      <button
        onClick={handleSendWhatsApp}
        className="w-full mt-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl"
      >
        Enviar Pedido por WhatsApp
      </button>
    </motion.div>
  );
};

export default OrderSummary;
