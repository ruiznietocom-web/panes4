import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const optionalExtras = [
  { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
  { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
  { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
];

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev =>
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  const panesPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;
    panesPersonalizados.forEach(p => total += p.price * p.quantity);
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
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n`;

    panesPersonalizados.forEach(pan => {
      message += `\n*PAN PERSONALIZADO (${pan.corte}):*\n`;
      pan.harinas.forEach(h => message += `• ${h.icon ? h.icon+' ' : ''}${h.name}\n`);
      message += `Precio: ${formatPrice(pan.price)}\n`;
    });

    if (extrasInCart.length > 0) {
      message += `\n*EXTRAS:*\n`;
      extrasInCart.forEach(extra => message += `• ${extra.icon ? extra.icon+' ' : ''}${extra.name} - ${formatPrice(extra.price)}\n`);
    }

    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.image ? b.image+' ' : ''}${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.image ? p.image+' ' : ''}${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    if (selectedOptionalExtras.length > 0) {
      message += `\n*EXTRAS OPCIONALES:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.icon ? e.icon+' ' : ''}${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += `🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.\n`;
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const phoneNumber = "627526380"; 
    window.open(`https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && <div className="text-center py-4 text-gray-500">Tu carrito está vacío. ¡Añade algo delicioso!</div>}

        {/* Panes Personalizados */}
        {panesPersonalizados.map(pan => (
          <div key={pan.cartId} className="flex flex-col p-2 bg-amber-50 rounded-lg">
            <ul className="ml-4">
              {pan.harinas.map(h => <li key={h.id}>🌾 {h.name}</li>)}
            </ul>
            <p>Corte: {pan.corte}</p>
            <p className="font-bold">Precio: {formatPrice(pan.price)}</p>
          </div>
        ))}

        {/* Extras, bollitos, pulguitas y opcionales... (igual que antes, manteniéndolos como ya los tienes) */}

      </div>

      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
      >
        <MessageCircle className="w-6 h-6" /> Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
