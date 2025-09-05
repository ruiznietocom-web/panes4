import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const calculateTotal = () => {
    let total = 0;
    const selectedHarinasCount = cartItems.filter(item => item.type === 'harina').length;

    if (selectedHarinasCount > 0) {
      total += fixedHarinaPrice; // precio fijo si hay harinas
    }

    cartItems.forEach(item => {
      if (item.type === 'extra') {
        total += item.price;
      } else if (item.type === 'bollito') {
        const bollito = bollitos.find(b => b.id === item.id);
        if (bollito) total += bollito.price * item.quantity;
      } else if (item.type === 'pulguita') {
        const pulguita = pulguitas.find(p => p.id === item.id);
        if (pulguita) total += pulguita.price * item.quantity;
      }
    });

    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `🍞 *NUEVO PEDIDO - PanApp* 🍞\n\n`;
    message += `📋 *Resumen del Pedido:*\n`;

    // Harinas
    const harinasSeleccionadas = cartItems.filter(item => item.type === 'harina');
    if (harinasSeleccionadas.length > 0) {
      message += `\n🥖 *Harinas (precio fijo ${formatPrice(fixedHarinaPrice)})*\n`;
      harinasSeleccionadas.forEach(harina => {
        message += `• ${harina.name}\n`;
      });
    }

    // Extras
    cartItems.filter(item => item.type === 'extra').forEach(extra => {
      message += `• ${extra.name} - ${formatPrice(extra.price)}\n`;
    });

    // Bollitos
    cartItems.filter(item => item.type === 'bollito').forEach(bollitoItem => {
      const bollito = bollitos.find(b => b.id === bollitoItem.id);
      if (bollito) {
        message += `• ${bollito.name} x${bollitoItem.quantity} - ${formatPrice(bollito.price * bollitoItem.quantity)}\n`;
      }
    });

    // Pulguitas
    cartItems.filter(item => item.type === 'pulguita').forEach(pulguitaItem => {
      const pulguita = pulguitas.find(p => p.id === pulguitaItem.id);
      if (pulguita) {
        message += `• ${pulguita.name} x${pulguitaItem.quantity} - ${formatPrice(pulguita.price * pulguitaItem.quantity)}\n`;
      }
    });

    message += `\n💰 *Total: ${formatPrice(calculateTotal())}*\n\n`;
    message += `📞 Por favor confirma la disponibilidad y tiempo de preparación.\n`;
    message += `¡Gracias por elegir PanApp! 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380"; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Resumen del Pedido
      </h2>
      
      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            <p>Tu carrito está vacío. ¡Añade algo delicioso!</p>
          </div>
        )}

        {/* Harinas */}
        {cartItems.filter(item => item.type === 'harina').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Harinas:</h3>
            {cartItems.filter(item => item.type === 'harina').map(harina => (
              <div key={harina.id} className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                <span className="text-gray-800 flex items-center gap-2">
                  <span>{harina.image}</span>
                  {harina.name}
                </span>
                <span className="font-semibold text-amber-600">
                  {harina.price === 0 ? "Gratis" : ""}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Precio fijo</span>
              <span>{formatPrice(fixedHarinaPrice)}</span>
            </div>
          </div>
        )}

        {/* Extras */}
        {cartItems.filter(item => item.type === 'extra').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {cartItems.filter(item => item.type === 'extra').map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-gray-800 flex items-center gap-2">
                  <span>{extra.icon}</span>
                  {extra.name}
                </span>
                <span className="font-semibold text-green-600">+{formatPrice(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="border-t pt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-amber-600">{formatPrice(calculateTotal())}</span>
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
        whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
        whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
      >
        <MessageCircle className="w-6 h-6" />
        Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
