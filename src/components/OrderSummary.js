import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Trash2 } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
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

  // Filtrados por tipo
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;
    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      total += p.price + extrasTotal;
    });
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

  const handleSendWhatsApp = () => {
    const phoneNumber = "627526380"; 
    const message = encodeURIComponent("Tu pedido está listo 🚀");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
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
            Tu carrito está vacío. ¡Añade algo delicioso!
          </div>
        )}

        {/* Panes Personalizados */}
        {pansPersonalizados.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Panes Personalizados:</h3>
            {pansPersonalizados.map((pan, index) => {
              const tienePanCortado = pan.harinas.some(h => h.name.toLowerCase().includes("pan cortado"));
              return (
                <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg relative">
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <span className="font-bold flex items-center gap-2">
                    🌾 Pan {index + 1} {tienePanCortado && "🔪"}
                  </span>
                  {pan.harinas.map(h => (
                    <span key={h.id}>• {h.icon ? h.icon + ' ' : ''}{h.name}</span>
                  ))}
                  {pan.extras?.length > 0 && (
                    <div className="mt-1 ml-2">
                      <span className="font-semibold">Extras:</span>
                      {pan.extras.map(extra => (
                        <div key={extra.id}>• {extra.icon ? extra.icon + ' ' : ''}{extra.name} ({formatPrice(extra.price)})</div>
                      ))}
                    </div>
                  )}
                  <span className="mt-1 font-bold">
                    Precio: {formatPrice(pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0))}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ... resto igual */}
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
