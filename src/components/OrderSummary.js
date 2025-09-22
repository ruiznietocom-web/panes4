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
    const discountCodes = {
      PANZEN30: { type: "percentage", value: 30, minPurchase: 30 },
      PANZEN10: { type: "percentage", value: 10, minPurchase: 10 },
      DESCUENTO5: { type: "fixed", value: 5, minPurchase: 0 },
      NUEVO20: { type: "percentage", value: 20, minPurchase: 20 },
    };

    const code = discountCode.toUpperCase();
    if (discountCodes[code]) {
      setAppliedDiscount(discountCodes[code]);
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
    const { subtotal, discountAmount, total } = getTotals(cartItems, selectedOptionalExtras, optionalExtras, discountCode);
    if (discountAmount > 0) {
      message += `\n*DETALLE DEL TOTAL:*\n`;
      message += `Subtotal: ${formatPrice(subtotal)}\n`;
      message += `Descuento: -${formatPrice(discountAmount)}\n`;
      message += `*Total Final: ${formatPrice(total)}*\n`;
    } else {
      message += `\n*TOTAL: ${formatPrice(total)}*\n`;
    }

    message += `\n🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.🙏\n`;
    message += `📱 *PARA MÁS PEDIDOS USA LA AppWeb* ---> https://panespersonalizados.netlify.app/. 📱\n`;

    return encodeURIComponent(message);
  };

  const getTotals = (cartItems, selectedOptionalExtras, optionalExtras, code) => {
    let subtotal = 0;
    let discountBase = 0;

    const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
    pansPersonalizados.forEach(p => {
      const extrasTotal = p.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      const panTotal = p.price + extrasTotal;
      subtotal += panTotal;
      discountBase += panTotal;
    });

    const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) {
        const total = b.price * item.quantity;
        subtotal += total;
        discountBase += total;
      }
    });

    const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) {
        const total = p.price * item.quantity;
        subtotal += total;
        discountBase += total;
      }
    });

    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) subtotal += e.price;
    });

    const discountCodes = {
      PANZEN30: { type: "percentage", value: 30, minPurchase: 30 },
      PANZEN10: { type: "percentage", value: 10, minPurchase: 10 },
      DESCUENTO5: { type: "fixed", value: 5, minPurchase: 0 },
      NUEVO20: { type: "percentage", value: 20, minPurchase: 20 },
    };

    const discount = discountCodes[code.toUpperCase()];
    let discountAmount = 0;
    if (discount) {
      if (discount.type === "percentage" && discountBase >= discount.minPurchase) {
        discountAmount = discountBase * (discount.value / 100);
      }
      if (discount.type === "fixed" && discountBase >= discount.minPurchase) {
        discountAmount = discount.value;
      }
    }

    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  // ...Aquí sigue todo tu render original, incluyendo la sección de total y botón WhatsApp...

};

export default OrderSummary;
