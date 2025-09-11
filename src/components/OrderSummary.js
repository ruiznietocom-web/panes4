import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { harinas, bollitos, pulguitas } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.50;

  const harinasInCart = cartItems.filter(item => item.type === "harina");
  const extrasInCart = cartItems.filter(item => item.type === "extra");
  const bollitosInCart = cartItems.filter(item => item.type === "bollito");
  const pulguitasInCart = cartItems.filter(item => item.type === "pulguita");

  const calculateTotal = () => {
    let total = 0;
    total += harinasInCart.length * fixedHarinaPrice;
    extrasInCart.forEach(e => total += e.price * e.quantity);
    bollitosInCart.forEach(b => total += b.price * b.quantity);
    pulguitasInCart.forEach(p => total += p.price * p.quantity);
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n`;

    if (harinasInCart.length > 0) {
      message += "\n*PAN PERSONALIZADO:*\n";
      harinasInCart.forEach(item => {
        message += `• ${item.icon} ${item.name} (${item.corte})\n`;
      });
      message += `Precio total de harinas: ${formatPrice(harinasInCart.length * fixedHarinaPrice)}\n`;
    }

    if (extrasInCart.length > 0) {
      message += "\n*EXTRAS:*\n";
      extrasInCart.forEach(extra => {
        message += `• ${extra.icon} ${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    if (bollitosInCart.length > 0) {
      message += "\n*BOLLITOS:*\n";
      bollitosInCart.forEach(item => {
        message += `• ${item.image} ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      });
    }

    if (pulguitasInCart.length > 0) {
      message += "\n*PULGUITAS:*\n";
      pulguitasInCart.forEach(item => {
        message += `• ${item.image} ${item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity)}\n`;
      });
    }

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += "🚚 Entrega a domicilio en Chiclana GRATUITA!\n";
    message += "🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. ¡MUCHAS GRACIAS!\n";

    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
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
          <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
        </h2>
      </div>

      {isOrderEmpty && <p className="text-center text-gray-500 py-4">Tu carrito está vacío.</p>}

      <div className="space-y-2">
        {harinasInCart.length > 0 && (
          <div className="p-2 bg-amber-50 rounded-lg">
            <h3 className="font-semibold">Pan Personalizado:</h3>
            {harinasInCart.map(item => (
              <span key={item.cartId}>• {item.icon} {item.name} ({item.corte})</span>
            ))}
            <p className="font-bold mt-1">Precio total de harinas: {formatPrice(harinasInCart.length * fixedHarinaPrice)}</p>
          </div>
        )}

        {extrasInCart.length > 0 && (
          <div className="p-2 bg-green-50 rounded-lg">
            <h3 className="font-semibold">Extras:</h3>
            {extrasInCart.map(extra => (
              <div key={extra.id} className="flex justify-between">
                <span>{extra.icon} {extra.name}</span>
                <span>{formatPrice(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        {bollitosInCart.length > 0 && (
          <div className="p-2 bg-blue-50 rounded-lg">
            <h3 className="font-semibold">Bollitos:</h3>
            {bollitosInCart.map(item => (
              <div key={item.cartId} className="flex justify-between">
                <span>{item.image} {item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        {pulguitasInCart.length > 0 && (
          <div className="p-2 bg-purple-50 rounded-lg">
            <h3 className="font-semibold">Pulguitas:</h3>
            {pulguitasInCart.map(item => (
              <div key={item.cartId} className="flex justify-between">
                <span>{item.image} {item.name} x{item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-gray-700 flex items-center gap-2 shadow-sm">
            🚚 <span><strong>Entrega a domicilio en Chiclana</strong> <span className="text-green-600 font-semibold">GRATUITA!</span> 🎉</span>
          </div>
        </div>
      </div>

      {/* Botón WhatsApp */}
      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
      >
        <MessageCircle className="w-6 h-6" />
        Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
