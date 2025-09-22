import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Trash2 } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);
  const [discountCode, setDiscountCode] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState(null);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let subtotal = 0;
    let discountBase = 0;

    // Panes personalizados
    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      const panTotal = p.price + extrasTotal;
      subtotal += panTotal;
      discountBase += panTotal;
    });

    // Bollitos
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) {
        const total = b.price * item.quantity;
        subtotal += total;
        discountBase += total;
      }
    });

    // Pulguitas
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) {
        const total = p.price * item.quantity;
        subtotal += total;
        discountBase += total;
      }
    });

    // Extras opcionales → NO cuentan para descuento
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) subtotal += e.price;
    });

    // Aplicar descuento solo sobre discountBase
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      subtotal = subtotal - discountBase * (appliedDiscount.value / 100);
    }

    return subtotal.toFixed(2);
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "PANZEN30") {
      setAppliedDiscount({ type: "percentage", value: 30, minPurchase: 30 });
    } else {
      setAppliedDiscount(null);
      alert("Código no válido");
    }
  };

  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    if (pansPersonalizados.length > 0) {
      message += `\n*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        message += `🌾 Pan ${index + 1}:\n`;
        pan.harinas.forEach(h => {
          const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
          message += `• ${h.icon ? h.icon + ' ' : ''}${h.name}${hasCortado ? ' 🔪' : ''}\n`;
        });
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

    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.image ? b.image + ' ' : ''}${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.image ? p.image + ' ' : ''}${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    if (selectedOptionalExtras.length > 0) {
      message += `\n*MANUEL, QUÉ RICO TU PAN!...:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.icon ? e.icon + ' ' : ''}${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    if (appliedDiscount) {
      message += `\n*DESCUENTO APLICADO: ${appliedDiscount.value}%*\n`;
    }

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.🙏\n`;
    message += `📱 *PARA MÁS PEDIDOS USA LA AppWeb* ---> https://panespersonalizados.netlify.app/. 📱\n`;

    return encodeURIComponent(message);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">🧺</span> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            Tu cesta está vacía. ¡Añade algo delicioso!
          </div>
        )}

        {/* ----------------------- PANES PERSONALIZADOS ----------------------- */}
        {pansPersonalizados.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">🌾 Panes Personalizados:</h3>
            {pansPersonalizados.map((pan, index) => (
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg relative">
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <span className="font-bold">🌾 Pan {index + 1}:</span>
                {pan.harinas.map(h => {
                  const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
                  return (
                    <span key={h.id}>
                      • {h.icon ? h.icon + ' ' : ''}{h.name}{hasCortado ? ' 🔪' : ''}
                    </span>
                  );
                })}
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
            ))}
          </div>
        )}

        {/* ----------------------- BOLLITOS ----------------------- */}
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

        {/* ----------------------- PULGUITAS ----------------------- */}
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

        {/* ----------------------- EXTRAS OPCIONALES ----------------------- */}
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

        {/* ----------------------- CÓDIGO DE DESCUENTO ----------------------- */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">¿Tienes un código de descuento?</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Introduce tu código"
              className="flex-1 border rounded-lg p-2"
            />
            <button
              onClick={applyDiscount}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Aplicar
            </button>
          </div>
          {appliedDiscount && (
            <p className="text-green-600 mt-2">
              Código aplicado: {appliedDiscount.value}% de descuento en pedidos superiores a {formatPrice(appliedDiscount.minPurchase)}
            </p>
          )}
        </div>

        {/* ----------------------- TOTAL Y ENTREGA ----------------------- */}
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

      {/* ----------------------- BOTÓN WHATSAPP ----------------------- */}
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
{/* ----------------------- TOTALES DETALLADOS CON DESCUENTO ----------------------- */}
{appliedDiscount && (
  <div className="mt-4 p-4 bg-gray-100 border rounded-lg text-gray-800">
    {(() => {
      // Recalcular subtotal y descuento
      let subtotal = 0;
      let discountBase = 0;

      // Panes
      pansPersonalizados.forEach(p => {
        const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
        const panTotal = p.price + extrasTotal;
        subtotal += panTotal;
        discountBase += panTotal;
      });

      // Bollitos
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) {
          const total = b.price * item.quantity;
          subtotal += total;
          discountBase += total;
        }
      });

      // Pulguitas
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) {
          const total = p.price * item.quantity;
          subtotal += total;
          discountBase += total;
        }
      });

      // Extras opcionales
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) subtotal += e.price;
      });

      const discountAmount = (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase)
        ? discountBase * (appliedDiscount.value / 100)
        : 0;

      const finalTotal = subtotal.toFixed(2);

      return (
        <>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>Descuento {appliedDiscount.value}%:</span>
            <span>- {formatPrice(discountAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-green-700">
            <span>Total Final:</span>
            <span>{formatPrice(finalTotal - discountAmount)}</span>
          </div>
        </>
      );
    })()}
  </div>
)}

    </motion.div>
  );
};

export default OrderSummary;
