import React from 'react';
// Importa React, necesario para crear componentes funcionales y usar hooks como useState.

import { motion } from 'framer-motion';
// Importa 'motion' de framer-motion para animar elementos (entrada, hover, tap, etc.).

import { MessageCircle, Trash2 } from 'lucide-react';
// Importa iconos: MessageCircle (WhatsApp) y Trash2 (botón eliminar).

import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
// Importa confetti y toast

import { bollitos, pulguitas } from '../data/products';
// Importa los productos "bollitos" y "pulguitas" desde un archivo de datos.

import { formatPrice } from '../utils/formatPrice';
// Función para formatear precios (ej: 1.5 → "1,50 €").

import { useTranslation } from 'react-i18next';

const OrderSummary = ({ cartItems, onSendWhatsApp, onRemoveItem }) => {
  const { t } = useTranslation();
  // cartItems: array de productos en la cesta
  // onSendWhatsApp: función para enviar pedido por WhatsApp
  // onRemoveItem: función para eliminar un producto de la cesta

  const optionalExtras = [
    { id: 'propina', name: t('products.optional_extras.propina'), price: 0.50, icon: '💰' },
    { id: 'cafe', name: t('products.optional_extras.cafe'), price: 1.00, icon: '☕' },
    { id: 'cerveza', name: t('products.optional_extras.cerveza'), price: 1.50, icon: '🍺' },

  ];
  // Lista de extras opcionales

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);
  // Guarda los ids de extras seleccionados

  const [discountCode, setDiscountCode] = React.useState("");
  // Código de descuento ingresado

  const [appliedDiscount, setAppliedDiscount] = React.useState(null);
  // Descuento aplicado actualmente (objeto o null)

  const toggleOptionalExtra = (extra) => {
    // Añade o quita un extra opcional del estado
    setSelectedOptionalExtras(prev => {
      const isSelected = prev.includes(extra.id);
      if (!isSelected) {
        // Trigger confetti and toast when adding
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee'] // 7 colors (rainbow)
        });
        toast.custom((toastEntry) => (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`${toastEntry.visible ? 'animate-enter' : 'animate-leave'}
      max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl
      pointer-events-auto flex ring-1 ring-black ring-opacity-5
      border-2 border-amber-400 overflow-hidden`}
          >

            {/* CONTENIDO */}
            <div className="flex-1 w-0 p-4">
              <div className="flex items-center justify-center gap-3">

                {/* Estrella izquierda con animación */}
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ✨
                </motion.span>

                {/* Texto centrado */}
                <div className="flex flex-col text-center">
                  <p className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                    {t('order_summary.thank_you_title')}
                  </p>
                  <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
                    {t('order_summary.thank_you_body')}
                  </p>
                </div>

                {/* Estrella derecha con animación */}
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, -20, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  ✨
                </motion.span>

              </div>
            </div>

          </motion.div>
        ), {
          id: 'thank-you-toast',
          duration: 4000,
          position: 'top-center',
        });
        return [...prev, extra.id];
      } else {
        return prev.filter(id => id !== extra.id);
      }
    });
  };

  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
  // Filtra los productos según su tipo

  const discountCodes = {
    PANZEN30: { type: "percentage", value: 30, minPurchase: 30 },
    PANZEN20: { type: "percentage", value: 20, minPurchase: 40 },
    BIENVENIDA10: { type: "percentage", value: 10, minPurchase: 15 },
    CUPON5: { type: "fixed", value: 5, minPurchase: 20 },
    REGALO3: { type: "fixed", value: 3, minPurchase: 10 }
  };
  // Códigos de descuento válidos

  const applyDiscount = () => {
    // Aplica descuento si el código es válido
    const code = discountCode.toUpperCase(); // pasar a mayúsculas
    if (discountCodes[code]) setAppliedDiscount(discountCodes[code]);
    else {
      setAppliedDiscount(null);
      alert("Código no válido");
    }
  };

  const calculateTotals = () => {
    // Calcula subtotal, descuento y total
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

    // Aplicar descuento si corresponde
    let discountAmount = 0;
    if (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase) {
      discountAmount = discountBase * (appliedDiscount.value / 100);
    }

    const total = subtotal - discountAmount;
    return { subtotal, discountAmount, total };
  };

  const { subtotal, discountAmount, total } = calculateTotals();
  // Desestructurar los totales

  const generateWhatsAppMessage = () => {
    // Genera mensaje de WhatsApp con precios separados por tipo
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    // PANES PERSONALIZADOS
    if (pansPersonalizados.length > 0) {
      message += `*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        const panExtrasTotal = pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
        const panTotal = pan.price + panExtrasTotal;

        // Cabecera pan
        message += `🌾 Pan ${index + 1}:\n`;

        // Harinas
        pan.harinas.forEach(h => {
          const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
          message += `   • ${h.icon ? h.icon + ' ' : ''}${h.name}${hasCortado ? ' 🔪' : ''}\n`;
        });

        // Extras (si tiene)
        if (pan.extras?.length > 0) {
          message += `   Extras:\n`;
          pan.extras.forEach(e => {
            message += `   • ${e.icon ? e.icon + ' ' : ''}${e.name} (${formatPrice(e.price)})\n`;
          });
        }

        // Precio final
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


    // MANUEL, QUÉ RICO TU PAN!...
    if (selectedOptionalExtras.length > 0) {
      message += `\n*MANUEL, QUÉ RICO TU PAN!:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) {
          message += `• ${e.icon ? e.icon + " " : ""}${e.name} - ${formatPrice(e.price)}\n`;
        }
      });
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





    // ----------------------- TOTALES DETALLADOS CON DESCUENTO -----------------------
    if (appliedDiscount) {
      // Recalcular subtotal y descuento
      let subtotal = 0;
      let discountBase = 0;

      // Panes
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

      // Extras opcionales
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) subtotal += e.price;
      });

      const discountAmount = (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase)
        ? discountBase * (appliedDiscount.value / 100)
        : 0;

      const finalTotal = subtotal - discountAmount;

      message += `\n*DETALLE DEL TOTAL:*\n`;
      message += `Subtotal: ${formatPrice(subtotal)}\n`;
      message += `Descuento ${appliedDiscount.value}%: -${formatPrice(discountAmount)}\n`;
      message += `*Total Final: ${formatPrice(finalTotal)}*\n`;
    }


    return encodeURIComponent(message); // Codifica para URL
  };

  const handleSendWhatsApp = () => {
    // Abre WhatsApp con mensaje predefinido
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;
  // Booleano para saber si la cesta está vacía

  return (
    <motion.div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-2xl">🧺</span> {t('order_summary.title')}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            {t('order_summary.empty')}
          </div>
        )}

        {/* PANES PERSONALIZADOS */}
        {pansPersonalizados.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">🌾 {t('order_summary.panes_personalizados')}</h3>
            {pansPersonalizados.map((pan, index) => (
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 dark:bg-slate-700 dark:text-white rounded-lg relative transition-colors duration-200">
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <span className="font-bold">🌾 {t('order_summary.pan')} {index + 1}:</span>
                {pan.harinas.map(h => {
                  const hasCortado = h.name.toUpperCase().includes("PAN CORTADO");
                  return (
                    <span key={h.id}>
                      • {h.icon ? h.icon + ' ' : ''}{t(`products.harinas.${h.id}.name`)}{hasCortado ? ' 🔪' : ''}
                    </span>
                  );
                })}
                {pan.extras?.length > 0 && (
                  <div className="mt-1 ml-2">
                    <span className="font-semibold">{t('order_summary.extras')}</span>
                    {pan.extras.map(extra => (
                      <div key={extra.id}>• {extra.icon ? extra.icon + ' ' : ''}{t(`products.extras.${extra.id}`)} ({formatPrice(extra.price)})</div>
                    ))}
                  </div>
                )}
                <span className="mt-1 font-bold">
                  {t('order_summary.price')} {formatPrice(pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0))}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* BOLLITOS */}
        {bollitosInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">{t('order_summary.bollitos')}</h3>
            {bollitosInCart.map(item => {
              const b = bollitos.find(b => b.id === item.id);
              return b && (
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 dark:bg-slate-700 dark:text-white rounded-lg relative transition-colors duration-200">
                  <span>{t(`products.bollitos.${b.id.toString().replace('.', '_')}.name`)} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                  <button className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'bollito')}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* PULGUITAS */}
        {pulguitasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">{t('order_summary.pulguitas')}</h3>
            {pulguitasInCart.map(item => {
              const p = pulguitas.find(p => p.id === item.id);
              return p && (
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 dark:bg-slate-700 dark:text-white rounded-lg relative transition-colors duration-200">
                  <span>{t(`products.pulguitas.${p.id.toString().replace('.', '_')}.name`)} x{item.quantity}</span>
                  <span>{formatPrice(p.price * item.quantity)}</span>
                  <button className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id, 'pulguita')}>
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* EXTRAS OPCIONALES */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200">{t('order_summary.extras_opcionales')}</h3>
          <div className="flex gap-3 flex-wrap">
            {optionalExtras.map(extra => (
              <button
                key={extra.id}
                onClick={() => toggleOptionalExtra(extra)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition ${selectedOptionalExtras.includes(extra.id)
                  ? 'bg-yellow-100 border-yellow-400 dark:bg-yellow-900 dark:border-yellow-600 dark:text-white'
                  : 'bg-gray-50 border-gray-300 hover:bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-600'
                  }`}
              >
                <span>{extra.icon}</span>
                <span>{extra.name} ({formatPrice(extra.price)})</span>
              </button>
            ))}
          </div>
        </div>

        {/* CÓDIGO DE DESCUENTO */}
        <div className="mt-4 text-gray-800 dark:text-white">
          <p className="font-bold mb-2">{t('order_summary.discount_code')}</p>
          <input type="text" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)}
            placeholder={t('order_summary.discount_placeholder')}
            className="border rounded-lg p-2 mr-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
          <button onClick={applyDiscount} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">{t('order_summary.apply')}</button>
          {appliedDiscount && <p className="text-green-600 mt-2">
            {t('order_summary.code_applied', { value: appliedDiscount.value })}
          </p>}
        </div>

        {/* TOTAL */}
        <div className="border-t pt-3 mt-3 flex justify-between items-center text-xl font-bold text-gray-800 dark:text-white">
          <span>{t('order_summary.total')}</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {/* ENTREGA GRATUITA */}
      <div className="mt-2 text-center text-green-700 font-semibold">
        🚴‍♂️ {t('order_summary.delivery_free')} <span className="font-bold">Chiclana</span>🚴‍♂️
      </div>
      {/* BOTÓN WHATSAPP */}
      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
        whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
        whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
      >
        <MessageCircle className="w-6 h-6" /> {t('order_summary.whatsapp_button')}
      </motion.button>


      {/* ----------------------- TOTALES DETALLADOS CON DESCUENTO ----------------------- */}
      {appliedDiscount && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-slate-700 border dark:border-slate-600 rounded-lg text-gray-800 dark:text-white">
          {(() => {
            // Recalcular subtotal y descuento
            let subtotal = 0;
            let discountBase = 0;

            // Panes
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

            // Extras opcionales
            selectedOptionalExtras.forEach(id => {
              const e = optionalExtras.find(opt => opt.id === id);
              if (e) subtotal += e.price;
            });

            const discountAmount = (appliedDiscount?.type === "percentage" && discountBase >= appliedDiscount.minPurchase)
              ? discountBase * (appliedDiscount.value / 100)
              : 0;

            const finalTotal = subtotal.toFixed(2);

            return (
              <>
                <div className="flex justify-between">
                  <span>{t('order_summary.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t('order_summary.discount', { value: appliedDiscount.value })}</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-700">
                  <span>{t('order_summary.final_total')}</span>
                  <span>{formatPrice(finalTotal - discountAmount)}</span>
                </div>
              </>
            );
          })()}
        </div>
      )}


    </motion.div>
  );
};

export default OrderSummary;
// Exporta el componente para poder usarlo en otros archivos
