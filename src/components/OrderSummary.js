import React from 'react'; 
import { motion } from 'framer-motion';
import { MessageCircle, Trash2 } from 'lucide-react';
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

  const discountCodes = {
    PANZEN30: { type: "percentage", value: 30, minPurchase: 30 },
    PANZEN10: { type: "percentage", value: 10, minPurchase: 10 },
    DESCUENTO5: { type: "fixed", value: 5, minPurchase: 0 },
    NUEVO20: { type: "percentage", value: 20, minPurchase: 20 },
  };

  const applyDiscount = () => {
    const code = discountCode.toUpperCase();
    if (discountCodes[code]) {
      setAppliedDiscount(discountCodes[code]);
    } else {
      setAppliedDiscount(null);
      alert("Código no válido");
    }
  };

  const calculateTotals = () => {
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
        subtotal += b.price * item.quantity;
        discountBase += b.price * item.quantity;
      }
    });

    // Pulguitas
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) {
        subtotal += p.price * item.quantity;
        discountBase += p.price * item.quantity;
      }
    });

    // Extras opcionales → NO cuentan para descuento
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) subtotal += e.price;
    });

    // Aplicar descuento
    let discountAmount = 0;
    if (appliedDiscount) {
      if (appliedDiscount.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
        discountAmount = discountBase * (appliedDiscount.value / 100);
      }
      if (appliedDiscount.type === "fixed" && discountBase >= appliedDiscount.minPurchase) {
        discountAmount = appliedDiscount.value;
      }
    }

    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const { subtotal, discountAmount, total } = calculateTotals();

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
      });
    }

    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    if (selectedOptionalExtras.length > 0) {
      message += `\n*EXTRAS OPCIONALES:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    if (appliedDiscount) {
      message += `\n*DESCUENTO APLICADO: ${appliedDiscount.value}${appliedDiscount.type === 'percentage' ? '%' : '€'}*\n`;
    }

    message += `\n*TOTAL: ${formatPrice(total)}*\n\n`;
    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.\n`;
    message += `📱 PARA MÁS PEDIDOS USA LA AppWeb ---> https://panespersonalizados.netlify.app/\n`;

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
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg"
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

        {/* Aquí irían tus mapas de panes, bollitos, pulguitas y extras como antes */}

        {/* CÓDIGO DE DESCUENTO */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">¿Tienes un código de descuento?</h3>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Introduce tu código"
              className="border rounded-lg p-2"
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
              Código aplicado: {appliedDiscount.value}{appliedDiscount.type === 'percentage' ? '%' : '€'} de descuento en pedidos superiores a {formatPrice(appliedDiscount.minPurchase)}
            </p>
          )}
        </div>

        {/* TOTAL Y ENTREGA */}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 shadow-sm">
            🚴‍♂️ <span><strong>Entrega a domicilio en Chiclana</strong> <span className="text-green-600 font-semibold">GRATUITA!</span> 🎉</span>
          </div>
        </div>
      </div>

      {/* BOTÓN WHATSAPP */}
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
