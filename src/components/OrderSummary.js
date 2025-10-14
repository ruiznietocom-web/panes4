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
  const [customerNote, setCustomerNote] = React.useState(""); // 🆕 Campo para anotaciones del cliente

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
    PANZEN20: { type: "percentage", value: 20, minPurchase: 40 },
    BIENVENIDA10: { type: "percentage", value: 10, minPurchase: 15 },
    CUPON5: { type: "fixed", value: 5, minPurchase: 20 },
    REGALO3: { type: "fixed", value: 3, minPurchase: 10 }
  };

  const applyDiscount = () => {
    const code = discountCode.toUpperCase();
    if (discountCodes[code]) setAppliedDiscount(discountCodes[code]);
    else {
      setAppliedDiscount(null);
      alert("Código no válido");
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let discountBase = 0;

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

    let discountAmount = 0;
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      discountAmount = discountBase * (appliedDiscount.value / 100);
    }

    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    // PANES PERSONALIZADOS
    if (pansPersonalizados.length > 0) {
      message += `*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        const panExtrasTotal = pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
        const panTotal = pan.price + panExtrasTotal;

        message += `🌾 Pan ${index + 1}:\n`;

        pan.harinas.forEach(h => {
          const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
          message += `   • ${h.icon ? h.icon + ' ' : ''}${h.name}${hasCortado ? ' 🔪' : ''}\n`;
        });

        if (pan.extras?.length > 0) {
          message += `   Extras:\n`;
          pan.extras.forEach(e => {
            message += `   • ${e.icon ? e.icon + ' ' : ''}${e.name} (${formatPrice(e.price)})\n`;
          });
        }

        message += `👉 Precio Pan con extras: *${formatPrice(panTotal)}*\n\n`;
      });
    }

    // BOLLITOS
    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) {
          message += `• ${b.image ? b.image + " " : ""}${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
        }
      });
    }

    // PULGUITAS
    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) {
          message += `• ${p.image ? p.image + " " : ""}${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
        }
      });
    }

    // MANUEL, QUÉ RICO TU PAN!
    if (selectedOptionalExtras.length > 0) {
      message += `\n*MANUEL, QUÉ RICO TU PAN!:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) {
          message += `• ${e.icon ? e.icon + " " : ""}${e.name} - ${formatPrice(e.price)}\n`;
        }
      });
    }

    // 🆕 ANOTACIÓN DEL CLIENTE
    if (customerNote.trim() !== "") {
      message += `\n*PETICIÓN DEL CLIENTE:*\n"${customerNote}"\n`;
    }

    // Descuento
    if (appliedDiscount) {
      message += `\n*DESCUENTO APLICADO: ${appliedDiscount.value}%*\n`;
    }

    message += `\n*TOTAL: ${formatPrice(total)}*\n\n`;
    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 PUEDES HACERME CUALQUIER CONSULTA o ESPECIFICACIÓN SOBRE EL PEDIDO POR WHATSAPP.\n\n`;
    message += `📱 PARA MÁS PEDIDOS USA LA AppWeb ---> https://panespersonalizados.netlify.app/\n\n`;
    message += `🙏 *MUCHAS GRACIAS!* 🙏\n\n`;

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

        {/* Panes personalizados */}
        {/* ... (todo tu código de panes, bollitos, pulguitas, extras, descuentos y totales se mantiene igual) ... */}

        {/* ANOTACIÓN DEL CLIENTE */}
        <div className="mt-4">
          <p className="font-semibold text-gray-700 mb-2">
            ✍️ Escribe cualquier petición sobre el pedido:
          </p>
          <textarea
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="Por ejemplo: que el pan venga bien tostado, entregar a las 10:30, etc."
            className="w-full border border-gray-300 rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          />
        </div>

        {/* BOTÓN WHATSAPP */}
        <motion.button
          onClick={handleSendWhatsApp}
          disabled={isOrderEmpty}
          className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
          whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
          whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
        >
          <MessageCircle className="w-6 h-6" /> Enviar Pedido por WhatsApp
        </motion.button>

        {/* Totales detallados (sin tocar nada) */}
        {appliedDiscount && (
          <div className="mt-4 p-4 bg-gray-100 border rounded-lg text-gray-800">
            {/* ... se mantiene igual ... */}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderSummary;

