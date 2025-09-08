import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  // Extras opcionales
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  // Filtrados para renderizado
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
    let message = ` *NUEVO PEDIDO - PanZen* \n\n *RESUMEN DE TU PEDIDO:*\n`;

    if (harinasInCart.length > 0) {
      const harinaNames = harinasInCart.map(item => {
        const h = harinas.find(h => h.id === item.id);
        return h ? h.name : '';
      }).join(', ');
      message += `\n *PAN PERSONALIZADO:*\n• Harinas seleccionadas: ${harinaNames} - ${formatPrice(fixedHarinaPrice)}\n`;
    }

    if (extrasInCart.length > 0) {
      message += `\n *EXTRAS AÑADIDOS:*\n`;
      extrasInCart.forEach(extra => {
        message += `• ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    if (bollitosInCart.length > 0) {
      message += `\n *BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += `\n *PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    if (selectedOptionalExtras.length > 0) {
      message += `\n *MANUEL, QUÉ RICO TU PAN!...:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    message += `\n *TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += ` MUCHAS GRACIAS!!.\n `;

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

        {/* Pan Personalizado */}
        {harinasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pan Personalizado:</h3>
            <div className="flex justify-between items-center p-2 bg-amber-50 rounded-lg">
              <span>Harinas seleccionadas: {harinasInCart.map(item => {
                const h = harinas.find(h => h.id === item.id);
                return h ? h.name : '';
              }).join(', ')}</span>
              <span>{formatPrice(fixedHarinaPrice)}</span>
            </div>
          </div>
        )}

        {/* Extras */}
        {extrasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {extrasInCart.map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">{extra.icon} {extra.name}</span>
                <span>{formatPrice(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bollitos */}
        {bollitosInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {bollitosInCart.map(item => {
              const b = bollitos.find(b => b.id === item.id);
              return b && (
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="flex items-center gap-2">{b.image} {b.name} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pulguitas */}
        {pulguitasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {pulguitasInCart.map(item => {
              const p = pulguitas.find(p => p.id === item.id);
              return p && (
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="flex items-center gap-2">{p.image} {p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Extras opcionales */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">Manuel, qué rico tu pan!...:</h3>
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

        {/* Total */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>
        </div>
      </div>

      {/* Botón WhatsApp */}
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
