// ... (todo tu código igual hasta generateWhatsAppMessage)

const generateWhatsAppMessage = () => {
  let message = ` *NUEVO PEDIDO - PanZen* \n\n *RESUMEN DE TU PEDIDO:*\n`;

  if (harinasInCart.length > 0) {
    const harinaNames = harinasInCart.map(item => {
      const h = harinas.find(h => h.id === item.id);
      return h ? h.name : '';
    }).join(', ');
    message += `\n *PAN PERSONALIZADO:*\n• Harinas seleccionadas: ${harinaNames} - ${formatPrice(fixedHarinaPrice)}\n`;
  }

  if (extrasInCart.length > 0) {
    message += `\n *EXTRAS AÑADIDOS:*\n`;
    extrasInCart.forEach(extra => {
      message += `• ${extra.name} - ${formatPrice(extra.price)}\n`;
    });
  }

  if (bollitosInCart.length > 0) {
    message += `\n *BOLLITOS:*\n`;
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) message += `• ${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
    });
  }

  if (pulguitasInCart.length > 0) {
    message += `\n *PULGUITAS:*\n`;
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) message += `• ${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
    });
  }

  if (selectedOptionalExtras.length > 0) {
    message += `\n *MANUEL, QUÉ RICO TU PAN!...:*\n`;
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) message += `• ${e.name} - ${formatPrice(e.price)}\n`;
    });
  }

  message += `\n *TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
  message += `🚚 Entrega a domicilio en *Chiclana* es *GRATUITA* 🎉\n\n`;
  message += `🙏 MUCHAS GRACIAS!!.\n `;

  return encodeURIComponent(message);
};

// ... (resto del código igual)

// Total + info de entrega
<div className="border-t pt-3 mt-3">
  <div className="flex justify-between items-center text-xl font-bold">
    <span>Total:</span>
    <span>{formatPrice(calculateTotal())}</span>
  </div>

  {/* Información de entrega */}
  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 shadow-sm">
    🚚 <span><strong>Entrega a domicilio en Chiclana</strong> es <span className="text-green-600 font-semibold">GRATUITA</span> 🎉</span>
  </div>
</div>
export default OrderSummary;

