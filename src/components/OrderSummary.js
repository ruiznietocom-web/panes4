 import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, Trash2 } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
  // Extras opcionales (propina, café, cerveza)
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  // Estado para extras opcionales
  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  // Estado para el código de descuento introducido
  const [discountCode, setDiscountCode] = React.useState("");
  const [appliedDiscount, setAppliedDiscount] = React.useState(null);

  // Lista de descuentos configurables
  const discountCodes = {
    PANZEN30: { type: "percent", value: 30, min: 30 }, // -30% si gasto > 30€
    PAN10: { type: "percent", value: 10, min: 0 }, // -10% siempre
    FREESHIP: { type: "shipping", value: 5, min: 20 }, // Simulación envío gratis
  };

  // Cambiar selección de extras opcionales
  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  // Filtrar items por tipo
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  // Calcular total (sin descuentos)
  const calculateSubtotal = () => {
    let total = 0;
    // Panes personalizados con extras
    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      total += p.price + extrasTotal;
    });
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
    // Extras opcionales
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) total += e.price;
    });
    return total;
  };

  // Calcular total con descuento aplicado
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (!appliedDiscount) return subtotal;

    // Si el pedido no cumple condiciones (min)
    if (subtotal < appliedDiscount.min) return subtotal;

    if (appliedDiscount.type === "percent") {
      return subtotal * (1 - appliedDiscount.value / 100);
    } else if (appliedDiscount.type === "shipping") {
      return subtotal - appliedDiscount.value;
    }
    return subtotal;
  };

  // Aplicar un código de descuento
  const applyDiscount = () => {
    const code = discountCode.toUpperCase().trim();
    const discount = discountCodes[code];

    if (!discount) {
      alert("Código inválido ❌");
      setAppliedDiscount(null);
      return;
    }

    if (calculateSubtotal() < discount.min) {
      alert(`Este código requiere un gasto mínimo de ${discount.min}€`);
      setAppliedDiscount(null);
      return;
    }

    setAppliedDiscount({ code, ...discount });
  };

  // Generar mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    // Panes personalizados
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

    // Totales
    const subtotal = calculateSubtotal();
    const total = calculateTotal();

    if (appliedDiscount) {
      message += `\n🔑 Código aplicado: ${appliedDiscount.code}`;
      message += `\n💰 Subtotal: ${formatPrice(subtotal)}`;
      message += `\n✅ Total con descuento: ${formatPrice(total)}`;
    } else {
      message += `\n*TOTAL: ${formatPrice(total)}*`;
    }

    message += `\n\n🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.🙏\n`;
    message += `📱 *PARA MÁS PEDIDOS USA LA AppWeb* ---> https://panespersonalizados.netlify.app/. 📱\n`;

    return encodeURIComponent(message);
  };

  // Enviar pedido a WhatsApp
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

      {/* Aquí irían las secciones de panes, bollitos, pulguitas (igual que antes) */}

      {/* Casilla para código de descuento */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          placeholder="Código descuento"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={applyDiscount}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Aplicar
        </button>
      </div>

      {/* Mostrar total */}
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          {appliedDiscount ? (
            <>
              <span className="line-through text-gray-500 mr-2">
                {formatPrice(calculateSubtotal())}
              </span>
              <span className="text-green-600">
                {formatPrice(calculateTotal())}
              </span>
            </>
          ) : (
            <span>{formatPrice(calculateTotal())}</span>
          )}
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

