import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  // Extras opcionales con Unicode
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '\u{1F4B0}' }, // 💰
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '\u2615' },      // ☕
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '\u{1F37A}' }, // 🍺
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  const harinasInCart = cartItems.filter(item => item.type === 'harina');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;
    if (harinasInCart.length > 0) total += fixedHarinaPrice;
    extrasInCart.forEach(e => total += e.price);
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) total += b.price * item.quantity;
    });
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) total += p.price * item.quantity;
    });
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) total += e.price;
    });
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = '\u{1F35E} *NUEVO PEDIDO - PanApp* \u{1F35E}\n\n\u{1F4CB} *Resumen del Pedido:*\n';

    if (harinasInCart.length > 0) {
      const harinaNames = harinasInCart.map(item => {
        const h = harinas.find(h => h.id === item.id);
        return h ? h.name : '';
      }).join(', ');
      message += `\n\u{1F956} *PAN PERSONALIZADO:*\n• Harinas seleccionadas: ${harinaNames} - ${formatPrice(fixedHarinaPrice)}\n`;
    }

    if (extrasInCart.length > 0) {
      message += `\n\u{1F7E2} *EXTRAS AÑADIDOS:*\n`;
      extrasInCart.forEach(extra => {
        message += `• ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    if (bollitosInCart.length > 0) {
      message += `\n\u{1F7E6} *BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += `\n\u{1F7EB} *PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    if (selectedOptionalExtras.length > 0) {
      message += `\n⭐ *EXTRAS OPCIONALES:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.icon} ${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    message += `\n\u{1F4B0} *TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += `\u{1F4DE} ¡Muchas Gracias! 🙏`;

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

        {/* Aquí puedes mantener la UI normal para el resumen */}
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
