import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Trash2,
  Copy,
  Pencil,
  Tag,
  Bike,
  Sparkles,
  Check,
  ShoppingBag,
  AlertCircle,
  X,
  Heart,
  Share2,
  Plus,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import {
  bollitos,
  pulguitas,
  optionalExtras as optionalExtrasData,
  getProductPhoto,
  calculatePanWeight
} from '../data/products';
import { formatPrice } from '../utils/formatPrice';
import { useTranslation } from 'react-i18next';
import { showThankYouToast } from './ThankYouToast';
import EditPanModal from './EditPanModal';
import { toggleFavoriteBread, isFavoriteBread, saveLastOrder, isFavoriteProduct, toggleFavoriteProduct } from '../utils/orderStorage';
import { shareCustomBread } from '../utils/shareOrder';

const MIN_ORDER_AMOUNT = 6.00;

const OrderSummary = ({
  cartItems,
  onSendWhatsApp,
  onRemoveItem,
  onDuplicateItem,
  onEditPanHarinas,
  onUpdateCartItem,
  lastOrder,
  onRepeatLastOrder,
  selectedOptionalExtras = [],
  setSelectedOptionalExtras
}) => {
  const { t, i18n } = useTranslation();

  const optionalExtras = optionalExtrasData.map(e => ({
    ...e,
    name: t(`optional_extras.${e.id}`)
  }));

  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [editingPan, setEditingPan] = useState(null);
  const [showMinOrderModal, setShowMinOrderModal] = useState(false);
  const [, setFavVersion] = useState(0);

  React.useEffect(() => {
    const onStorage = () => setFavVersion(v => v + 1);
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => {
      const isSelected = prev.includes(extra.id);
      if (!isSelected) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
        });
        showThankYouToast(t);
        return [...prev, extra.id];
      } else {
        return prev.filter(id => id !== extra.id);
      }
    });
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
    const code = discountCode.trim().toUpperCase();
    if (discountCodes[code]) {
      setAppliedDiscount(discountCodes[code]);
      toast.success(t('order_summary.code_applied', { value: discountCodes[code].value, defaultValue: '¡Descuento aplicado!' }));
    } else {
      toast.error(t('order_summary.invalid_code'));
    }
  };

  const calculateTotals = () => {
    let sub = 0;

    cartItems.forEach(item => {
      if (item.type === 'panPersonalizado') {
        const extrasTotal = item.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
        sub += item.price + extrasTotal;
      } else {
        sub += (item.price || 0) * (item.quantity || 1);
      }
    });

    selectedOptionalExtras.forEach(id => {
      const extra = optionalExtras.find(e => e.id === id);
      if (extra) sub += extra.price;
    });

    let discount = 0;
    if (appliedDiscount) {
      if (!appliedDiscount.minPurchase || sub >= appliedDiscount.minPurchase) {
        if (appliedDiscount.type === "percentage") {
          discount = (sub * appliedDiscount.value) / 100;
        } else if (appliedDiscount.type === "fixed") {
          discount = Math.min(appliedDiscount.value, sub);
        }
      }
    }

    return {
      subtotal: sub,
      discountAmount: discount,
      total: Math.max(0, sub - discount)
    };
  };

  const { subtotal, discountAmount, total } = calculateTotals();

  const discountLabel = appliedDiscount
    ? (appliedDiscount.type === "percentage"
      ? t('order_summary.discount', { value: appliedDiscount.value })
      : t('order_summary.discount_fixed', { defaultValue: 'Descuento:' }))
    : '';

  const generateWhatsAppMessage = () => {
    // Genera mensaje de WhatsApp con precios separados por tipo
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n\n`;

    // PANES PERSONALIZADOS
    if (pansPersonalizados.length > 0) {
      message += `*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        const panHarinas = Array.isArray(pan.harinas)
          ? pan.harinas
          : (Array.isArray(pan.harinas?.harinas) ? pan.harinas.harinas : []);
        const panExtras = Array.isArray(pan.extras)
          ? pan.extras
          : (Array.isArray(pan.harinas?.extras) ? pan.harinas.extras : []);

        const panExtrasTotal = panExtras.reduce((acc, e) => acc + (e.price || 0), 0);
        const panTotal = (pan.price || 0) + panExtrasTotal;

        // Cabecera pan
        message += `🌾 Pan ${index + 1}:\n`;

        // Harinas
        panHarinas.forEach(h => {
          const hasCortado = (h.name || '').toUpperCase().includes("PAN CORTADO");
          message += `   • ${h.icon ? h.icon + ' ' : ''}${h.name || ''}${hasCortado ? ' 🔪' : ''}\n`;
        });

        // Extras (si tiene)
        if (panExtras.length > 0) {
          message += `   Extras:\n`;
          panExtras.forEach(e => {
            message += `   • ${e.icon ? e.icon + ' ' : ''}${e.name || ''} (${formatPrice(e.price || 0)})\n`;
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
        const name = item.name || b?.name || '';
        const price = item.price ?? b?.price ?? 0;
        const icon = item.image || item.icon || b?.image || '🍞';
        message += `• ${icon ? icon + " " : ""}${name} x${item.quantity} - ${formatPrice(price * item.quantity)}\n`;
      });
    }

    // PULGUITAS
    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        const name = item.name || p?.name || '';
        const price = item.price ?? p?.price ?? 0;
        const icon = item.image || item.icon || p?.image || '🍞';
        message += `• ${icon ? icon + " " : ""}${name} x${item.quantity} - ${formatPrice(price * item.quantity)}\n`;
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

    // Descuento (solo si realmente se aplica)
    if (appliedDiscount && discountAmount > 0) {
      const discountText = appliedDiscount.type === "percentage"
        ? `${appliedDiscount.value}%`
        : formatPrice(appliedDiscount.value);
      message += `\n*DESCUENTO APLICADO: ${discountText}*\n`;
    }

    message += `\n*TOTAL: ${formatPrice(total)}*\n\n`;

    message += `🚴‍♂️ Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;

    message += `🙏 PUEDES HACERME CUALQUIER CONSULTA o ESPECIFICACIÓN SOBRE EL PEDIDO POR WHATSAPP.\n\n`;

    message += `📱 PARA MÁS PEDIDOS USA LA AppWeb ---> https://panespersonalizados.netlify.app/\n\n`;

    message += `🙏 *MUCHAS GRACIAS!* 🙏 🌿\n\n`;

    // ----------------------- TOTALES DETALLADOS CON DESCUENTO -----------------------
    // Usa los mismos totales calculados arriba (sin recalcular)
    if (appliedDiscount && discountAmount > 0) {
      const discountText = appliedDiscount.type === "percentage"
        ? `Descuento ${appliedDiscount.value}%`
        : `Descuento ${formatPrice(appliedDiscount.value)}`;
      message += `\n*DETALLE DEL TOTAL:*\n`;
      message += `Subtotal: ${formatPrice(subtotal)}\n`;
      message += `${discountText}: -${formatPrice(discountAmount)}\n`;
      message += `*Total Final: ${formatPrice(total)}*\n`;
    }

    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    if (isOrderEmpty) return;

    if (total < MIN_ORDER_AMOUNT) {
      setShowMinOrderModal(true);
      toast.error(
        "El pedido mínimo son 6€, gracias. El equivalente a un pan o a un pack de pulguitas o bollitos.",
        {
          duration: 6000,
          position: 'top-center',
          style: {
            background: '#78350F',
            color: '#fff',
            fontWeight: '600',
            borderRadius: '16px',
            padding: '14px 20px',
            maxWidth: '440px',
            textAlign: 'center',
            lineHeight: '1.4',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
          }
        }
      );
      return;
    }

    // Guardar como último pedido para poder repetirlo
    saveLastOrder(cartItems, selectedOptionalExtras);

    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  return (
    <>
      <motion.div
        className="bg-white/95 dark:bg-stone-900/95 rounded-3xl p-6 sm:p-7 shadow-ticket border border-amber-900/15 dark:border-stone-800 relative transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Cabecera estilo Ticket de Obrador */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-900/10 dark:border-stone-700/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white leading-tight">
                {t('order_summary.title')}
              </h2>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Comanda directa a obrador
              </span>
            </div>
          </div>

          {!isOrderEmpty && (
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-xs">
              {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} items
            </span>
          )}
        </div>

        <div className="space-y-4 mb-6">
          {/* Estado Vacío */}
          {isOrderEmpty && (
            <div className="flex flex-col items-center text-center py-8 px-4 text-stone-400 dark:text-stone-500">
              <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-3xl mb-3 shadow-inner">
                🧺
              </div>
              <p className="font-serif font-bold text-stone-700 dark:text-stone-300 text-base mb-1">
                Tu cesta está vacía
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mb-3">
                {t('order_summary.empty')}
              </p>

              {lastOrder && onRepeatLastOrder && (
                <button
                  type="button"
                  onClick={onRepeatLastOrder}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs shadow-md transition transform hover:scale-105 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('order_summary.repeat_last', { defaultValue: 'Repetir último pedido' })}</span>
                </button>
              )}
            </div>
          )}

          {/* PANES PERSONALIZADOS */}
          {pansPersonalizados.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>🌾</span> {t('order_summary.panes_personalizados')}
              </h3>
              <AnimatePresence initial={false}>
                {pansPersonalizados.map((pan, index) => {
                  const panHarinas = Array.isArray(pan.harinas)
                    ? pan.harinas
                    : (Array.isArray(pan.harinas?.harinas) ? pan.harinas.harinas : []);
                  const panExtras = Array.isArray(pan.extras)
                    ? pan.extras
                    : (Array.isArray(pan.harinas?.extras) ? pan.harinas.extras : []);
                  const isFav = isFavoriteBread({ ...pan, harinas: panHarinas, extras: panExtras });

                  return (
                    <motion.div
                      key={pan.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3.5 bg-amber-50/70 dark:bg-stone-800/80 rounded-2xl border border-amber-200/60 dark:border-stone-700 relative transition-all"
                    >
                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {/* Botón Favorito */}
                        <button
                          type="button"
                          className={`p-1 rounded-lg transition ${
                            isFav
                              ? 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                              : 'text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:text-stone-400 dark:hover:bg-stone-700'
                          }`}
                          onClick={() => {
                            const res = toggleFavoriteBread({ ...pan, harinas: panHarinas, extras: panExtras });
                            toast(res ? t('order_summary.favorite_pan_saved') : t('order_summary.favorite_pan_removed'), {
                              icon: res ? '❤️' : '🤍',
                              duration: 2500,
                              position: 'top-center'
                            });
                          }}
                          title={t('favorite_breads.save_button', { defaultValue: 'Guardar como favorito' })}
                          aria-label={t('favorite_breads.save_button', { defaultValue: 'Guardar como favorito' })}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>

                        {/* Botón Compartir */}
                        <button
                          type="button"
                          className="p-1 rounded-lg text-stone-400 hover:text-amber-700 hover:bg-amber-100 dark:text-stone-400 dark:hover:text-amber-300 dark:hover:bg-stone-700 transition"
                          onClick={() => {
                            const corte = panHarinas.find(h => h.price === 0);
                            shareCustomBread({ flours: panHarinas, corte, extras: panExtras });
                          }}
                          title={t('order_summary.share_pan', { defaultValue: 'Compartir este pan' })}
                          aria-label={t('order_summary.share_pan', { defaultValue: 'Compartir este pan' })}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {onEditPanHarinas && (
                          <button
                            type="button"
                            className="p-1 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-100 dark:text-stone-400 dark:hover:text-amber-300 dark:hover:bg-stone-700 transition"
                            onClick={() => setEditingPan({ ...pan, harinas: panHarinas, extras: panExtras })}
                            title={t('order_summary.edit_pan')}
                            aria-label={t('order_summary.edit_pan')}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDuplicateItem && (
                          <button
                            type="button"
                            className="p-1 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-100 dark:text-stone-400 dark:hover:text-amber-300 dark:hover:bg-stone-700 transition"
                            onClick={() => onDuplicateItem({ ...pan, harinas: panHarinas, extras: panExtras })}
                            title={t('order_summary.duplicate', { defaultValue: 'Duplicar este pan' })}
                            aria-label={t('order_summary.duplicate', { defaultValue: 'Duplicar este pan' })}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-stone-700 transition"
                          onClick={() => onRemoveItem(pan.id, 'panPersonalizado')}
                          aria-label="Eliminar pan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-1 pr-24 mb-1">
                        <span className="font-serif font-bold text-sm text-stone-900 dark:text-white">
                          🌾 {t('order_summary.pan')} {index + 1}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                          {calculatePanWeight(panExtras).label}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600 dark:text-stone-300 space-y-0.5">
                        {panHarinas.map(h => {
                          const hasCortado = (h.name || '').toUpperCase().includes("PAN CORTADO");
                          return (
                            <div key={h.id} className="flex items-center gap-1">
                              <span className="text-amber-600 dark:text-amber-400">•</span>
                              <span>{t(`products.harinas.${h.id}.name`).replace(' Integral Ecológico', '')}</span>
                              {hasCortado && <span className="text-[10px] bg-amber-200/60 dark:bg-stone-700 px-1.5 py-0.2 rounded font-medium">🔪 Cortado</span>}
                            </div>
                          );
                        })}
                      </div>

                      {panExtras.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-amber-200/50 dark:border-stone-700/60 text-xs">
                          <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400 block mb-0.5">
                            Extras añadidos:
                          </span>
                          {panExtras.map(extra => (
                            <div key={extra.id} className="text-stone-600 dark:text-stone-300 flex justify-between">
                              <span>{extra.icon} {t(`products.extras.${extra.id}`)}</span>
                              <span className="font-medium text-amber-700 dark:text-amber-400">+{formatPrice(extra.price)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-2.5 pt-2 border-t border-amber-200/60 dark:border-stone-700 flex justify-between items-center text-xs">
                        <span className="font-medium text-stone-500 dark:text-stone-400">Total pan:</span>
                        <span className="font-serif font-bold text-sm text-amber-800 dark:text-amber-300">
                          {formatPrice(pan.price + (pan.extras?.reduce((acc, e) => acc + e.price, 0) || 0))}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* BOLLITOS */}
          {bollitosInCart.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>🥖</span> {t('order_summary.bollitos')}
              </h3>
              <AnimatePresence initial={false}>
                {bollitosInCart.map(item => {
                  const b = bollitos.find(b => b.id === item.id);
                  const displayName = item.name || (b ? t(`products.bollitos.${b.id.toString().replace('.', '_')}.name`, { defaultValue: b.name }) : item.id);
                  const price = item.price ?? b?.price ?? 0;
                  const photo = getProductPhoto(item);
                  const isFav = isFavoriteProduct(item.id, 'bollito');

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-between items-center p-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {photo ? (
                          <img
                            src={photo}
                            alt={displayName}
                            className="w-10 h-10 rounded-lg object-cover border border-amber-200/60 dark:border-stone-600 shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-lg shrink-0">
                            {item.image || '🥖'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 dark:text-white block truncate">{displayName}</span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">Cant: x{item.quantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-serif font-bold text-amber-800 dark:text-amber-300 text-sm mr-1">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          className={`p-1 rounded-lg transition cursor-pointer ${
                            isFav
                              ? 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                              : 'text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:text-stone-400 dark:hover:bg-stone-700'
                          }`}
                          onClick={() => {
                            const res = toggleFavoriteProduct(item, 'bollito');
                            setFavVersion(v => v + 1);
                            toast(res ? t('favorite_products.bollito_saved', { defaultValue: '¡Bollito guardado en tus favoritos! ❤️' }) : t('favorite_products.bollito_removed', { defaultValue: 'Bollito eliminado de favoritos 🤍' }), {
                              icon: res ? '❤️' : '🤍',
                              duration: 2500,
                              position: 'top-center'
                            });
                          }}
                          title={isFav ? t('favorite_products.remove_favorite', { defaultValue: 'Eliminar de favoritos' }) : t('favorite_products.add_favorite', { defaultValue: 'Guardar como favorito' })}
                          aria-label="Favorito"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          className="text-stone-400 hover:text-red-500 p-1"
                          onClick={() => onRemoveItem(item.id, 'bollito')}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* PULGUITAS */}
          {pulguitasInCart.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                <span>🥯</span> {t('order_summary.pulguitas')}
              </h3>
              <AnimatePresence initial={false}>
                {pulguitasInCart.map(item => {
                  const p = pulguitas.find(p => p.id === item.id);
                  const displayName = item.name || (p ? t(`products.pulguitas.${p.id.toString().replace('.', '_')}.name`, { defaultValue: p.name }) : item.id);
                  const price = item.price ?? p?.price ?? 0;
                  const photo = getProductPhoto(item);
                  const isFav = isFavoriteProduct(item.id, 'pulguita');

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex justify-between items-center p-2 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        {photo ? (
                          <img
                            src={photo}
                            alt={displayName}
                            className="w-10 h-10 rounded-lg object-cover border border-amber-200/60 dark:border-stone-600 shadow-xs shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-lg shrink-0">
                            {item.image || '🥯'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-stone-900 dark:text-white block truncate">{displayName}</span>
                          <span className="text-[11px] text-stone-500 dark:text-stone-400">Cant: x{item.quantity}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-serif font-bold text-amber-800 dark:text-amber-300 text-sm mr-1">
                          {formatPrice(price * item.quantity)}
                        </span>
                        <button
                          type="button"
                          className={`p-1 rounded-lg transition cursor-pointer ${
                            isFav
                              ? 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                              : 'text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:text-stone-400 dark:hover:bg-stone-700'
                          }`}
                          onClick={() => {
                            const res = toggleFavoriteProduct(item, 'pulguita');
                            setFavVersion(v => v + 1);
                            toast(res ? t('favorite_products.pulguita_saved', { defaultValue: '¡Pulguita guardada en tus favoritas! ❤️' }) : t('favorite_products.pulguita_removed', { defaultValue: 'Pulguita eliminada de favoritas 🤍' }), {
                              icon: res ? '❤️' : '🤍',
                              duration: 2500,
                              position: 'top-center'
                            });
                          }}
                          title={isFav ? t('favorite_products.remove_favorite', { defaultValue: 'Eliminar de favoritos' }) : t('favorite_products.add_favorite', { defaultValue: 'Guardar en favoritos' })}
                          aria-label="Favorito"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          className="text-stone-400 hover:text-red-500 p-1"
                          onClick={() => onRemoveItem(item.id, 'pulguita')}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* EXTRAS OPCIONALES / PROPINA */}
          <div className="pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
              ☕ {t('order_summary.extras_opcionales')}
            </span>
            <div className="flex gap-2 flex-wrap">
              {optionalExtras.map(extra => {
                const isSelected = selectedOptionalExtras.includes(extra.id);
                return (
                  <button
                    key={extra.id}
                    onClick={() => toggleOptionalExtra(extra)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs'
                        : 'bg-stone-100 hover:bg-amber-100/60 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <span>{extra.icon}</span>
                    <span>{extra.name}</span>
                    <span className="opacity-80">({formatPrice(extra.price)})</span>
                    {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUPÓN DE DESCUENTO */}
          <div className="pt-3 border-t border-dashed border-stone-200 dark:border-stone-700">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t('order_summary.discount_code')}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder={t('order_summary.discount_placeholder')}
                className="flex-1 min-w-0 uppercase text-xs px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:border-amber-500 transition"
              />
              <button
                onClick={applyDiscount}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition shadow-xs"
              >
                {t('order_summary.apply')}
              </button>
            </div>

            {appliedDiscount && (
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {appliedDiscount.type === "percentage"
                  ? t('order_summary.code_applied', { value: appliedDiscount.value })
                  : t('order_summary.code_applied_fixed', { value: formatPrice(appliedDiscount.value), defaultValue: 'Código aplicado: {{value}} de descuento' })}
              </p>
            )}

            {appliedDiscount && discountAmount === 0 && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                {t('order_summary.min_purchase_note', {
                  min: formatPrice(appliedDiscount.minPurchase),
                  defaultValue: 'Compra mínima de {{min}} para este código'
                })}
              </p>
            )}
          </div>

          {/* DETALLE Y TOTAL */}
          <div className="pt-3 border-t-2 border-stone-200 dark:border-stone-700 space-y-1.5">
            {appliedDiscount && discountAmount > 0 && (
              <>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{t('order_summary.subtotal')}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-red-600 dark:text-red-400">
                  <span>{discountLabel}</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-serif font-bold text-base text-stone-900 dark:text-white">
                {t('order_summary.total')}
              </span>
              <span className="font-serif font-extrabold text-2xl text-amber-700 dark:text-amber-400">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* ENTREGA GRATIS EN CHICLANA */}
          <div className="py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <Bike className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t('order_summary.delivery_free')} <strong className="font-black">Chiclana</strong></span>
          </div>

          {/* BARRA DE PROGRESO DE PEDIDO MÍNIMO 6€ (SOLO CUANDO NO SE ALCANZA EL MÍNIMO) */}
          {!isOrderEmpty && total < MIN_ORDER_AMOUNT && (
            <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-stone-850/80 border border-amber-200/80 dark:border-stone-700/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                  <Bike className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    {t('order_summary.min_order_progress_missing', {
                      amount: formatPrice(MIN_ORDER_AMOUNT - total),
                      defaultValue: `Te faltan solo ${formatPrice(MIN_ORDER_AMOUNT - total)} para el mínimo de 6,00 €`
                    })}
                  </span>
                </span>
                <span className="font-bold text-[11px] text-amber-800 dark:text-amber-300">
                  {Math.min(100, Math.round((total / MIN_ORDER_AMOUNT) * 100))}%
                </span>
              </div>

              {/* Barra visual */}
              <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-500 to-amber-600"
                  style={{ width: `${Math.min(100, (total / MIN_ORDER_AMOUNT) * 100)}%` }}
                />
              </div>

              {/* Sugerencias rápidas para completar si falta dinero */}
              <div className="pt-1.5 border-t border-amber-200/60 dark:border-stone-700/60 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 block">
                    {t('order_summary.quick_add_title', { defaultValue: 'Sugerencias para completar tu pedido:' })}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {onUpdateCartItem && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const currentQty = cartItems.find(i => i.id === 1 && i.type === 'pulguita')?.quantity || 0;
                            onUpdateCartItem(1, currentQty + 1, 'pulguita');
                            toast.success('¡Pulguita añadida a la cesta! 🥯');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-600 hover:border-amber-500 text-stone-800 dark:text-stone-200 text-[11px] font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-amber-600" />
                          <span>{t('order_summary.add_pulguita_quick', { defaultValue: '+ 1 Pulguita (0,60 €)' })}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const currentQty = cartItems.find(i => i.id === 1 && i.type === 'bollito')?.quantity || 0;
                            onUpdateCartItem(1, currentQty + 1, 'bollito');
                            toast.success('¡Bollito añadido a la cesta! 🥖');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-600 hover:border-amber-500 text-stone-800 dark:text-stone-200 text-[11px] font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-amber-600" />
                          <span>{t('order_summary.add_bollito_quick', { defaultValue: '+ 1 Bollito (1,10 €)' })}</span>
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleOptionalExtra({ id: 'cafe', price: 1.00, name: 'Café', icon: '☕' })}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-600 hover:border-amber-500 text-stone-800 dark:text-stone-200 text-[11px] font-semibold transition shadow-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      <span>{t('order_summary.add_cafe_quick', { defaultValue: '+ 1 Café para Manuel (1,00 €)' })}</span>
                    </button>
                  </div>
                </div>
            </div>
          )}

          {/* BOTÓN WHATSAPP DESTACADO */}
          <motion.button
            onClick={handleSendWhatsApp}
            disabled={isOrderEmpty}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-2.5 transition-all relative overflow-hidden ${
              isOrderEmpty
                ? 'bg-stone-300 dark:bg-stone-700 text-stone-500 cursor-not-allowed opacity-60'
                : 'bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-500 hover:to-green-500 shadow-emerald-600/30 hover:shadow-2xl animate-shimmer cursor-pointer'
            }`}
            whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
            whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span className="text-sm sm:text-base tracking-wide">
              {t('order_summary.whatsapp_button')}
            </span>
          </motion.button>
        </div>

        {/* Editor Modal */}
        {onEditPanHarinas && (
          <EditPanModal
            pan={editingPan}
            onSave={onEditPanHarinas}
            onClose={() => setEditingPan(null)}
          />
        )}

        {/* Modal interactivo de Pedido Mínimo 6€ */}
        <AnimatePresence>
          {showMinOrderModal && (
            <motion.div
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMinOrderModal(false)}
            >
              <motion.div
                className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center relative border border-amber-900/15 dark:border-stone-700 shadow-2xl"
                initial={{ scale: 0.85, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.85, y: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowMinOrderModal(false)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                  aria-label="Cerrar aviso"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50 dark:ring-amber-900/20 text-3xl">
                  🧺
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-stone-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Pedido Mínimo: 6,00 €
                </div>

                <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 dark:text-white mb-3">
                  Cesta inferior a 6€
                </h3>

                <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-stone-800/80 border border-amber-200/80 dark:border-stone-700 mb-5 text-left space-y-2">
                  <p className="text-sm font-semibold text-stone-900 dark:text-amber-100 leading-snug">
                    El pedido mínimo son 6€, gracias. El equivalente a un pan o a un pack de pulguitas o bollitos.
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/60 dark:border-stone-700 text-stone-600 dark:text-stone-300">
                    <span>Tu pedido actual: <strong>{formatPrice(total)}</strong></span>
                    <span className="text-amber-800 dark:text-amber-300 font-bold">
                      Te faltan: {formatPrice(Math.max(0, MIN_ORDER_AMOUNT - total))}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMinOrderModal(false)}
                  className="w-full py-3.5 px-6 rounded-2xl font-bold text-stone-950 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-400 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] cursor-pointer"
                >
                  Entendido, añadir más productos
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default OrderSummary;
