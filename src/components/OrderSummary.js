import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const extraOpciones = [
  { id: 'propina', name: 'Propina', price: 0.50, icon: '💰' },
  { id: 'cafe', name: 'Café', price: 1.00, icon: '☕' },
  { id: 'cerveza', name: 'Cerveza', price: 1.50, icon: '🍺' }
];

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const calculateTotal = () => {
    let total = 0;

    // Harinas
    const harinasInCart = cartItems.filter(item => item.type === 'harina');
    if (harinasInCart.length > 0) total += fixedHarinaPrice;

    // Extras y extras especiales
    cartItems.forEach(item => {
      if (item.type === 'extra') total += item.price;
      if (item.type === 'extraEspecial') {
        const extra = extraOpciones.find(e => e.id === item.id);
        if (extra) total += extra.price;
      }
      else if (item.type === 'bollito') {
        const b = bollitos.find(b => b.id === item.id);
        if (b) total += b.price * item.quantity;
      } else if (item.type === 'pulguita') {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) total += p.price * item.quantity;
      }
    });

    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `🍞 *NUEVO PEDIDO - PanApp* 🍞\n\n📋 *Resumen del Pedido:*\n`;

    // HARINAS
    const harinasInCart = cartItems.filter(item => item.type === 'harina');
    if (harinasInCart.length > 0) {
      message += `\n🥖 *Pan Personalizado (precio fijo ${formatPrice(fixedHarinaPrice)}):*\n`;
      harinasInCart.forEach(item => {
        const h = harinas.find(h => h.id === item.id);
        if (h) {
          const priceText = h.price === 0 ? 'gratis' : formatPrice(0);
          message += `* ${h.name} x${item.quantity || 1} - ${priceText}\n`;
        }
      });
    }

    // EXTRAS NORMALES
    const extrasInCart = cartItems.filter(item => item.type === 'extra');
    if (extrasInCart.length > 0) {
      message += `\n🌟 *Extras añadidos:*\n`;
      extrasInCart.forEach(extra => {
        message += `* ${extra.icon} ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    // EXTRAS ESPECIALES: propina, café, cerveza
    const especialesInCart = cartItems.filter(item => item.type === 'extraEspecial');
    if (especialesInCart.length > 0) {
      message += `\n🌟 *Extras especiales:*\n`;
      especialesInCart.forEach(item => {
        const extra = extraOpciones.find(e => e.id === item.id);
        if (extra) message += `* ${extra.icon} ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    // BOLLITOS
    const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
    if (bollitosInCart.length > 0) {
      message += `\n🥐 *Bollitos:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `* ${b.image} ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    // PULGUITAS
    const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
    if (pulguitasInCart.length > 0) {
      message += `\n🥪 *Pulguitas:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `* ${p.image} ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    message += `\n💰 *Total: ${formatPrice(calculateTotal())}*\n\n`;
    message += `📞 Por favor confirma la disponibilidad y tiempo de preparación.\n¡Gracias por elegir PanApp! 🙏`;

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
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
        <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
      </h2>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            <p>Tu carrito está vacío. ¡Añade algo delicioso!</p>
          </div>
        )}

        {/* HARINAS DESGLOSADAS */}
        {cartItems.filter(item => item.type === 'harina').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pan Personalizado (precio fijo {formatPrice(fixedHarinaPrice)}):</h3>
            {cartItems.filter(item => item.type === 'harina').map(item => {
              const h = harinas.find(h => h.id === item.id);
              if (!h) return null;
              return (
                <div key={h.id} className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
                  <span>{h.name} x{item.quantity || 1}</span>
                  <span>{h.price === 0 ? 'gratis' : formatPrice(0)}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* EXTRAS NORMALES */}
        {cartItems.filter(item => item.type === 'extra').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras añadidos:</h3>
            {cartItems.filter(item => item.type === 'extra').map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">{extra.icon} {extra.name}</span>
                <span>{formatPrice(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        {/* EXTRAS ESPECIALES */}
        {cartItems.filter(item => item.type === 'extraEspecial').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras especiales:</h3>
            {cartItems.filter(item => item.type === 'extraEspecial').map(item => {
              const extra = extraOpciones.find(e => e.id === item.id);
              return (
                <div key={extra.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="flex items-center gap-2">{extra.icon} {extra.name}</span>
                  <span>{formatPrice(extra.price)}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* BOLLITOS */}
        {cartItems.filter(item => item.type === 'bollito').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {cartItems.filter(item => item.type === 'bollito').map(item => {
              const b = bollitos.find(b => b.id === item.id);
              if (!b) return null;
              return (
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span>{b.image} {b.name} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* PULGUITAS */}
        {cartItems.filter(item => item.type === 'pulguita').length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {cartItems.filter(item => item.type === 'pulguita').map(item => {
              const p = pulguitas.find(p => p.id === item.id);
              if (!p) return null;
              return (
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span>{p.image} {p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                </div>
              )
            })}
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
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
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
