import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from './formatPrice';

export const generateWhatsAppMessage = (cartItems, optionalExtras = []) => {
  const fixedHarinaPrice = 5.50;

  const harinasInCart = cartItems.filter(item => item.type === 'harina');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  let message = ` *NUEVO PEDIDO - PanZen* \n\n *RESUMEN DE TU PEDIDO:*\n`;

  if (harinasInCart.length > 0) {
    message += `\n *PAN PERSONALIZADO:*\n`;
    harinasInCart.forEach(item => {
      const h = harinas.find(h => h.id === item.id);
      if (h) message += `• ${h.icon || ''} ${h.name}\n`;
    });
    message += `Precio total de harinas: ${formatPrice(fixedHarinaPrice)}\n`;
  }

  if (extrasInCart.length > 0) {
    message += `\n *EXTRAS AÑADIDOS:*\n`;
    extrasInCart.forEach(extra => {
      message += `• ${extra.icon || ''} ${extra.name} - ${formatPrice(extra.price)}\n`;
    });
  }

  if (bollitosInCart.length > 0) {
    message += `\n *BOLLITOS:*\n`;
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) message += `• ${b.image || ''} ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
    });
  }

  if (pulguitasInCart.length > 0) {
    message += `\n *PULGUITAS:*\n`;
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) message += `• ${p.image || ''} ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
    });
  }

  if (optionalExtras.length > 0) {
    message += `\n *MANUEL, QUÉ RICO TU PAN!...:*\n`;
    optionalExtras.forEach(e => {
      message += `• ${e.icon} ${e.name} - ${formatPrice(e.price)}\n`;
    });
  }

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  message += `\n *TOTAL: ${formatPrice(total)}*\n\n`;
  message += `🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
  message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. ¡MUCHAS GRACIAS!\n`;

  return encodeURIComponent(message);
};
