import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  // Filtrados por tipo
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;

    // Panes personalizados
    pansPersonalizados.forEach(p => {
      const extrasSum = (p.extras || []).reduce((sum, e) => sum + (e.price || 0), 0);
      total += (p.basePrice || p.price || 0) + extrasSum;
    });

    // Extras globales
    extrasInCart.forEach(e => total += e.price);

    // Bollitos
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) total += b.price * item.quantity;
    });

    // Pulguitas
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) total += p.price * item.quantity;
    });

    return total.toFixed(2);
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
            {pansPersonalizados.map((pan, index) => (
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg">
                <span className="font-bold">Pan {index + 1}:</span>
                {pan.harinas.map(h => (
                  <span key={h.id}>• {h.icon ? h.icon + ' ' : '🌾 '}{h.name}</span>
                ))}
                {pan.extras && pan.extras.length > 0 && (
                  <div className="mt-1 ml-4">
                    <strong>Extras:</strong>
                    {pan.extras.map(ex => (
                      <div key={ex.id}>• {ex.icon ? ex.icon + ' ' : ''}{ex.name} - {formatPrice(ex.price)}</div>
                    ))}
                  </div>
                )}
                <span className="mt-1 font-bold">
                  Precio: {formatPrice((pan.basePrice || pan.price || 0) + (pan.extras || []).reduce((s,e)=> s + (e.price||0), 0))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Extras globales */}
        {extrasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {extrasInCart.map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">{extra.icon ? extra.icon + ' ' : ''}{extra.name}</span>
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
                  <span className="flex items-center gap-2">{b.image ? b.image + ' ' : ''}{b.name} x{item.quantity}</span>
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
                  <span className="flex items-center gap-2">{p.image ? p.image + ' ' : ''}{p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Total y botón */}
      {!isOrderEmpty && (
        <div className="text-center mt-4">
          <span className="font-bold text-lg block mb-2">Total: {formatPrice(calculateTotal())}</span>
          <button
            onClick={onSendWhatsApp}
            className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-amber-600 transition"
          >
            Enviar Pedido por WhatsApp
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default OrderSummary;
