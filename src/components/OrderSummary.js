import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Trash2 } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
  // Extras opcionales (propina, café, cerveza)
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  // Alternar extras opcionales
  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  // Filtrados por tipo de producto
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  // Cálculo total del pedido
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

  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n`;

    // Panes personalizados
    if (pansPersonalizados.length > 0) {
      message += `\n*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        message += `Pan ${index + 1}:\n`;
        pan.harinas.forEach(h => {
          message += `• ${h.icon ? h.icon + ' ' : ''}${h.name}\n`;
        });
        if (pan.cortado) {
          message += `• 🔪 Cortado\n`;
        }
        if (pan.extras?.length > 0) {
          message += `Extras:\n`;
          pan.extras.forEach(e => {
            message += `• ${e.icon ? e.icon + ' ' : ''}${e.name} (${formatPrice(e.price)})\n`;
          });
        }
        const panTotal = pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0);
        message += `Precio: ${formatPrice(panTotal)}\n`;
      });
    }

    // Bollitos
    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.image ? b.image + ' ' : ''}${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    // Pulguitas
    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.image ? p.image + ' ' : ''}${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    // Extras opcionales
    if (selectedOptionalExtras.length > 0) {
      message += `\n*MANUEL, QUÉ RICO TU PAN!...:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.icon ? e.icon + ' ' : ''}${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.🙏\n`;
    message += `🙏 *PARA MÁS PEDIDOS EN LA AppWeb ---> https://panespersonalizados.netlify.app/.* 🙏\n`;

    return encodeURIComponent(message);
  };

  // Acción enviar WhatsApp
  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380"; 
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
      {/* Cabecera */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {/* Carrito vacío */}
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
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg relative">
                {/* Botón eliminar */}
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                {/* Icono trigo 🌾 siempre + Pan # + icono cuchillo si cortado */}
                <span className="font-bold flex items-center gap-2">
                  🌾 Pan {index + 1}
                  {pan.cortado && <span>🔪</span>}
                </span>

                {/* Harinas */}
                {pan.harinas.map(h => (
                  <span key={h.id}>• {h.icon ? h.icon + ' ' : ''}{h.name}</span>
                ))}

                {/* Extras */}
                {pan.extras?.length > 0 && (
                  <div className="mt-1 ml-2">
                    <span className="font-semibold">Extras:</span>
                    {pan.extras.map(extra => (
                      <div key={extra.id}>
                        • {extra.icon ? extra.icon + ' ' : ''}{extra.name} ({formatPrice(extra.price)})
                      </div>
                    ))}
                  </div>
                )}

                {/* Precio total pan */}
                <span className="mt-1 font-bold">
                  Precio: {formatPrice(pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0))}
                </span>
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
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg relative">
                  <span className="flex items-center gap-2">{b.image ? b.image + ' ' : ''}{b.name} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'bollito')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
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
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg relative">
                  <span className="flex items-center gap-2">{p.image ? p.image + ' ' : ''}{p.name} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                  <button
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'pulguita')}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Extras opcionales */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">MANUEL, QUÉ RICO TU PAN!...:</h3>
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

        {/* Total + entrega */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 shadow-sm">
            🚴‍♂️ <span><strong>Entrega a domicilio en Chiclana</strong> <span className="text-green-600 font-semibold">GRATUITA!</span> 🎉</span>
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
