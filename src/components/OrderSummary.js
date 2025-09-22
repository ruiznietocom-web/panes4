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

  // CALCULAR TOTALES
  const calculateSubtotals = () => {
    let subtotal = 0;
    let discountBase = 0; // solo productos aplicables al descuento

    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      const panTotal = p.price + extrasTotal;
      subtotal += panTotal;
      discountBase += panTotal;
    });

    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) {
        subtotal += b.price * item.quantity;
        discountBase += b.price * item.quantity;
      }
    });

    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) {
        subtotal += p.price * item.quantity;
        discountBase += p.price * item.quantity;
      }
    });

    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) subtotal += e.price;
    });

    return { subtotal, discountBase };
  };

  const calculateTotal = () => {
    const { subtotal, discountBase } = calculateSubtotals();
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      return (subtotal - discountBase * (appliedDiscount.value / 100)).toFixed(2);
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

    // Totales con descuento
    const { subtotal, discountBase } = calculateSubtotals();
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      const discountAmount = (discountBase * appliedDiscount.value / 100).toFixed(2);
      const total = calculateTotal();
      message += `\n*TOTAL ANTES DE DESCUENTO: ${formatPrice(subtotal)}*\n`;
      message += `*DESCUENTO: -${formatPrice(discountAmount)}*\n`;
      message += `*TOTAL FINAL: ${formatPrice(total)}*\n`;
    } else {
      message += `\n*TOTAL: ${formatPrice(subtotal)}*\n`;
    }

    message += `\n🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
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
  const { subtotal, discountBase } = calculateSubtotals();
  const discountAmount = (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount?.minPurchase)
    ? (discountBase * appliedDiscount.value / 100)
    : 0;

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* ======== AQUÍ VA TODO TU CÓDIGO ORIGINAL TAL CUAL: productos, bollitos, pulguitas, extras, botones ======== */}

      {/* Total con descuento visible */}
      <div className="border-t pt-3 mt-3">
        <div className="flex flex-col gap-1 text-xl font-bold">
          {discountAmount > 0 && (
            <>
              <span>Total antes de descuento: {formatPrice(subtotal)}</span>
              <span>Descuento: -{formatPrice(discountAmount)}</span>
            </>
          )}
          <span>Total final: {formatPrice(calculateTotal())}</span>
        </div>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 shadow-sm">
          🚴‍♂️ <span><strong>Entrega a domicilio en Chiclana</strong> <span className="text-green-600 font-semibold">GRATUITA!</span> 🎉</span>
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
