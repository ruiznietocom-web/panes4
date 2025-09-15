import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);
  const toggleOptionalExtra = extra =>
    setSelectedOptionalExtras(prev =>
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );

  const harinasInCart = cartItems.filter(item => item.type === 'panPersonalizado' || item.type === 'harina');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;
    harinasInCart.forEach(item => total += item.price);
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

  const isOrderEmpty = cartItems.length === 0;

  const handleSendWhatsAppClick = () => {
    onSendWhatsApp();
  };

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
            Tu carrito está vacío. ¡Añade algo delicioso!
          </div>
        )}

        {/* Panes personalizados */}
        {harinasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pan Personalizado:</h3>
            <div className="flex flex-col p-2 bg-amber-50 rounded-lg">
              {harinasInCart.map(item => (
                <span key={item.id}>
                  • {item.harinas ? item.harinas.map(h => h.name).join(', ') : item.name}
                </span>
              ))}
              <span className="mt-1 font-bold">Precio total de harinas: {formatPrice(fixedHarinaPrice)}</span>
            </div>
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
                  <span>{b.image} {b.name} x{item.quantity}</span>
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
                  <span>{p.image} {p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      {/* Botón WhatsApp */}
      <motion.button
        onClick={handleSendWhatsAppClick}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg mt-4 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
      >
        <MessageCircle className="w-6 h-6" />
        Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
