import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const optionalExtras = [
    { id: 'propina', name: 'Propina', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Café', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Cerveza', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => {
      if (prev.includes(extra.id)) return prev.filter(id => id !== extra.id);
      return [...prev, extra.id];
    });
  };

  const calculateTotal = () => {
    let total = 0;
    const harinasInCart = cartItems.filter(item => item.type === 'harina');
    if (harinasInCart.length > 0) total += fixedHarinaPrice;

    cartItems.forEach(item => {
      if (item.type === 'extra') total += item.price;
      else if (item.type === 'bollito') {
        const bollito = bollitos.find(b => b.id === item.id);
        if (bollito) total += bollito.price * item.quantity;
      } else if (item.type === 'pulguita') {
        const pulguita = pulguitas.find(p => p.id === item.id);
        if (pulguita) total += pulguita.price * item.quantity;
      }
    });

    selectedOptionalExtras.forEach(id => {
      const extra = optionalExtras.find(e => e.id === id);
      if (extra) total += extra.price;
    });

    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `🍞 *NUEVO PEDIDO - PanApp* 🍞\n\n`;
    message += `📋 *Resumen del Pedido:*\n`;

    // Harinas (pan personalizado)
    const harinasInCart = cartItems.filter(item => item.type === 'harina');
    if (harinasInCart.length > 0) {
      const harinaNames = harinasInCart.map(item => {
        const h = harinas.find(h => h.id === item.id);
        return h ? h.name : '';
      }).join(', ');
      message += `\n🥖 *Pan Personalizado:*\n* Harinas seleccionadas: ${harinaNames} - ${formatPrice(fixedHarinaPrice)}\n`;
    }

    // Extras
    const extrasInCart = cartItems.filter(item => item.type === 'extra');
    if (extrasInCart.length > 0) {
      message += `\n🌟 *Extras añadidos:*\n`;
      extrasInCart.forEach(extra => {
        message += `* ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    // Bollitos
    const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
    if (bollitosInCart.length > 0) {
      message += `\n🥐 *Bollitos:*\n`;
      bollitosInCart.forEach(item => {
        const bollito = bollitos.find(b => b.id === item.id);
        if (bollito) message += `* ${bollito.name} x${item.quantity} - ${formatPrice(bollito.price * item.quantity)}\n`;
      });
    }

    // Pulguitas
    const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
    if (pulguitasInCart.length > 0) {
      message += `\n🥪 *Pulguitas:*\n`;
      pulguitasInCart.forEach(item => {
        const pulguita = pulguitas.find(p => p.id === item.id);
        if (pulguita) message += `* ${pulguita.name} x${item.quantity} - ${formatPrice(pulguita.price * item.quantity)}\n`;
      });
    }

    // Extras opcionales
    if (selectedOptionalExtras.length > 0) {
      message += `\n✨ *Extras opcionales:*\n`;
      selectedOptionalExtras.forEach(id => {
        const extra = optionalExtras.find(e => e.id === id);
        if (extra) message += `* ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            <p>Tu carrito está vacío. ¡Añade algo delicioso!</p>
          </div>
        )}

        {/* Opcionales */}
        {optionalExtras.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras Opcionales:</h3>
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
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{formatPrice(calculateTotal())}</span>
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
