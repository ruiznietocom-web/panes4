import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const selectedOptionalExtras = cartItems.filter(i => i.type === 'extra');

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => total += item.price * item.quantity);
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = '*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n';

    // Panes personalizados
    cartItems.filter(i => i.type === 'panPersonalizado').forEach(pan => {
      message += '\n*PAN PERSONALIZADO:*\n';
      pan.harinas.forEach(h => message += `• 🌾 ${h.name}\n`);
      message += `Corte: ${pan.corte}\n`;
      message += `Precio: ${formatPrice(pan.price)}\n`;
    });

    // Extras opcionales
    if (selectedOptionalExtras.length > 0) {
      message += '\n*EXTRAS:*\n';
      selectedOptionalExtras.forEach(e => message += `• ${e.icon} ${e.name} - ${formatPrice(e.price)}\n`);
    }

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

      {cartItems.length === 0 ? <p className="text-gray-500 text-center">Tu carrito está vacío.</p> :
        cartItems.map(item => item.type === 'panPersonalizado' ? (
          <div key={item.cartId} className="mb-4 p-2 bg-amber-50 rounded-lg">
            <strong>PAN PERSONALIZADO:</strong>
            <ul className="ml-4">
              {item.harinas.map(h => <li key={h.id}>🌾 {h.name}</li>)}
            </ul>
            <p>Corte: {item.corte}</p>
            <p>Precio: {formatPrice(item.price)}</p>
          </div>
        ) : null)
      }

      {selectedOptionalExtras.length > 0 && (
        <div className="mb-4">
          <strong>Extras:</strong>
          <ul className="ml-4">
            {selectedOptionalExtras.map(e => <li key={e.cartId}>{e.icon} {e.name} - {formatPrice(e.price)}</li>)}
          </ul>
        </div>
      )}

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
