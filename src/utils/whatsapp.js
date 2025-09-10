import { harinas, bollitos, pulguitas } from "../data/products";
import { formatPrice } from "./formatPrice";

export const generateWhatsAppMessage = (cartItems, selectedOptionalExtras = []) => {
  const fixedHarinaPrice = 5.50;

  const optionalExtras = [
    { id: "propina", name: "Toma una Propina!", price: 0.50, icon: "💰" },
    { id: "cafe", name: "Toma para un Café!", price: 1.00, icon: "☕" },
    { id: "cerveza", name: "Tómate una Cerveza a mi Salud!", price: 1.50, icon: "🍺" },
  ];

  const harinasInCart = cartItems.filter(item => item.type === "harina");
  const extrasInCart = cartItems.filter(item => item.type === "extra");
  const bollitosInCart = cartItems.filter(item => item.type === "bollito");
  const pulguitasInCart = cartItems.filter(item => item.type === "pulguita");

  const calculateTotal = () => {
    let total = 0;
    if (harinasInCart.length > 0) total += fixedHarinaPrice;
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

  let message = `*NUEVO PEDIDO - PanZen* \n\n*RESUMEN DE TU PEDIDO:*\n`;

  // Harinas
  if (harinasInCart.length > 0) {
    message += `\n*PAN PERSONALIZADO:*\n`;
    harinasInCart.forEach(item => {
      const h = harinas.find(h => h.id === item.id);
      if (h) message += `• ${h.icon} ${h.name}\n`;
    });
    message += `Precio total de harinas: ${formatPrice(fixedHarinaPrice)}\n`;
  }

  // Extras
  if (extrasInCart.length > 0) {
    message += `\n*EXTRAS AÑADIDOS:*\n`;
    extrasInCart.forEach(extra => message += `• ${extra.icon} ${extra.name} - ${formatPrice(extra.price)}\n`);
  }

  // Bollitos
  if (bollitosInCart.length > 0) {
    message += `\n*BOLLITOS:*\n`;
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) message += `• ${b.image || ""} ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
    });
  }

  // Pulguitas
  if (pulguitasInCart.length > 0) {
    message += `\n*PULGUITAS:*\n`;
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) message += `• ${p.image || ""} ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
    });
  }

  // Extras opcionales
  if (selectedOptionalExtras.length > 0) {
    message += `\n*MANUEL, QUÉ RICO TU PAN!...:*\n`;
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) message += `• ${e.icon} ${e.name} - ${formatPrice(e.price)}\n`;
    });
  }

  message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
  message += `🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
  message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. ¡MUCHAS GRACIAS!\n`;

  return encodeURIComponent(message);
};
