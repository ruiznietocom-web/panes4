import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { harinas, bollitos, pulguitas } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const fixedHarinaPrice = 5.5;

  const calculateTotal = () => {
    let total = 0;

    const selectedHarinasCount = cartItems.filter(
      (item) => item.type === "harina"
    ).length;
    if (selectedHarinasCount > 0) {
      total += fixedHarinaPrice;
    }

    cartItems.forEach((item) => {
      if (item.type === "extra") {
        total += item.price;
      } else if (item.type === "bollito") {
        const bollito = bollitos.find((b) => b.id === item.id);
        if (bollito) total += bollito.price * item.quantity;
      } else if (item.type === "pulguita") {
        const pulguita = pulguitas.find((p) => p.id === item.id);
        if (pulguita) total += pulguita.price * item.quantity;
      }
    });

    return total.toFixed(2);
  };

  const handleSendWhatsApp = () => {
    const total = calculateTotal();
    const phoneNumber = "627526380";
    const message = `🍞 *NUEVO PEDIDO - PanApp* 🍞\n\n💰 *Total: ${formatPrice(
      total
    )}*`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
        <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
      </h2>

      <div className="space-y-3 mb-6">
        {isOrderEmpty ? (
          <div className="text-center text-gray-500">Tu carrito está vacío</div>
        ) : (
          <>
            {cartItems
              .filter((item) => item.type === "harina")
              .length > 0 && (
              <div className="flex justify-between p-3 bg-amber-50 rounded-lg">
                <span className="font-semibold">Harinas seleccionadas</span>
                <span className="font-bold text-amber-600">
                  {formatPrice(fixedHarinaPrice)}
                </span>
              </div>
            )}

            {cartItems
              .filter((item) => item.type === "extra")
              .map((extra) => (
                <div
                  key={extra.id}
                  className="flex justify-between p-2 bg-green-50 rounded-lg"
                >
                  <span>{extra.name}</span>
                  <span className="text-green-600 font-semibold">
                    +{formatPrice(extra.price)}
                  </span>
                </div>
              ))}

            {cartItems
              .filter((item) => item.type === "bollito")
              .map((bollitoItem) => {
                const bollito = bollitos.find((b) => b.id === bollitoItem.id);
                return (
                  bollito && (
                    <div
                      key={bollito.id}
                      className="flex justify-between p-2 bg-blue-50 rounded-lg"
                    >
                      <span>
                        {bollito.name} x{bollitoItem.quantity}
                      </span>
                      <span className="text-blue-600 font-semibold">
                        {formatPrice(bollito.price * bollitoItem.quantity)}
                      </span>
                    </div>
                  )
                );
              })}

            {cartItems
              .filter((item) => item.type === "pulguita")
              .map((pulguitaItem) => {
                const pulguita = pulguitas.find((p) => p.id === pulguitaItem.id);
                return (
                  pulguita && (
                    <div
                      key={pulguita.id}
                      className="flex justify-between p-2 bg-purple-50 rounded-lg"
                    >
                      <span>
                        {pulguita.name} x{pulguitaItem.quantity}
                      </span>
                      <span className="text-purple-600 font-semibold">
                        {formatPrice(pulguita.price * pulguitaItem.quantity)}
                      </span>
                    </div>
                  )
                );
              })}
          </>
        )}

        <div className="border-t pt-3 flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span className="text-amber-600">{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full py-4 px-6 rounded-xl text-white font-bold flex items-center justify-center gap-3 ${
          isOrderEmpty
            ? "opacity-50 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        <MessageCircle className="w-6 h-6" /> Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
