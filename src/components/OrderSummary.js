import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach(item => {
      if (item.type === 'harina') {
        const harina = harinas.find(h => h.id === item.id);
        if (harina) total += harina.price * item.quantity;
      } else if (item.type === 'extra') {
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

    const harinasInCart = cartItems.filter(item => item.type === 'harina');
    if (harinasInCart.length > 0) {
      message += `\n🥖 *Pan Personalizado:*\n`;
      harinasInCart.forEach(harinaItem => {
        const harina = harinas.find(h => h.id === harinaItem.id);
        if (harina) message += `• Harina: ${harina.name} x${harinaItem.quantity} - $${(harina.price * harinaItem.quantity).toFixed(2)}\n`;
      });
    }
    
    const extrasInCart = cartItems.filter(item => item.type === 'extra');
    if (extrasInCart.length > 0) {
      message += `\n🌟 *Extras añadidos:*\n`;
      extrasInCart.forEach(extra => {
        message += `• ${extra.name} - $${extra.price}\n`;
      });
    }

    const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
    if (bollitosInCart.length > 0) {
      message += `\n🥐 *Bollitos:*\n`;
      bollitosInCart.forEach(bollitoItem => {
        const bollito = bollitos.find(b => b.id === bollitoItem.id);
        if (bollito) message += `• ${bollito.name} x${bollitoItem.quantity} - $${(bollito.price * bollitoItem.quantity).toFixed(2)}\n`;
      });
    }

    const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
    if (pulguitasInCart.length > 0) {
      message += `\n🥪 *Pulguitas:*\n`;
      pulguitasInCart.forEach(pulguitaItem => {
        const pulguita = pulguitas.find(p => p.id === pulguitaItem.id);
        if (pulguita) message += `• ${pulguita.name} x${pulguitaItem.quantity} - $${(pulguita.price * pulguitaItem.quantity).toFixed(2)}\n`;
      });
    }
    
    message += `\n💰 *Total: $${calculateTotal()}*\n\n`;
    message += `📞 Por favor confirma la disponibilidad y tiempo de preparación.\n`;
    message += `¡Gracias por elegir PanApp! 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "1234567890"; // Cambia por tu número de WhatsApp
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
        {cartItems.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <p>Tu carrito está vacío. ¡Añade algo delicioso!</p>
          </div>
        )}

        {cartItems.filter(item => item.type === 'harina').length > 0 && (
          <>
            <h3 className="font-semibold text-gray-700">Pan Personalizado:</h3>
            {cartItems.filter(item => item.type === 'harina').map(harinaItem => {
              const harina = harinas.find(h => h.id === harinaItem.id);
              return harina && (
                <div key={harina.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div>
                    <span className="font-semibold text-gray-800">{harina.name} x{harinaItem.quantity}</span>
                  </div>
                  <span className="font-bold text-amber-600">${(harina.price * harinaItem.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </>
        )}
        
        {cartItems.filter(item => item.type === 'extra').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {cartItems.filter(item => item.type === 'extra').map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-gray-800 flex items-center gap-2">
                  <span>{extra.icon}</span>
                  {extra.name}
                </span>
                <span className="font-semibold text-green-600">+${extra.price}</span>
              </div>
            ))}
          </div>
        )}

        {cartItems.filter(item => item.type === 'bollito').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {cartItems.filter(item => item.type === 'bollito').map(bollitoItem => {
              const bollito = bollitos.find(b => b.id === bollitoItem.id);
              return bollito && (
                <div key={bollito.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-gray-800 flex items-center gap-2">
                    <span>{bollito.image}</span>
                    {bollito.name} x{bollitoItem.quantity}
                  </span>
                  <span className="font-semibold text-blue-600">${(bollito.price * bollitoItem.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}

        {cartItems.filter(item => item.type === 'pulguita').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {cartItems.filter(item => item.type === 'pulguita').map(pulguitaItem => {
              const pulguita = pulguitas.find(p => p.id === pulguitaItem.id);
              return pulguita && (
                <div key={pulguita.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="text-gray-800 flex items-center gap-2">
                    <span>{pulguita.image}</span>
                    {pulguita.name} x{pulguitaItem.quantity}
                  </span>
                  <span className="font-semibold text-purple-600">${(pulguita.price * pulguitaItem.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-amber-600">${calculateTotal()}</span>
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