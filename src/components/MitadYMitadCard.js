import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Trash2, Sparkles, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatPrice';
import AllergenBadges from './AllergenBadges';
import { MITAD_Y_MITAD_FLAVORS, calculateMitadYMitadPrice, resolveMitadPackDetails } from '../utils/calculateMitadYMitadPrice';

/**
 * Tarjeta interactiva para configurar y añadir packs de "Mitad de un sabor y mitad de otro"
 * tanto en la página de Bollitos (pack de 6: 3+3) como en Pulguitas (pack de 12: 6+6).
 */
const MitadYMitadCard = ({
  productType = 'bollito', // 'bollito' o 'pulguita'
  cartItems = [],
  onUpdateQuantity
}) => {
  const { t } = useTranslation();

  const isBollito = productType === 'bollito';
  const totalUnits = isBollito ? 6 : 12;
  const halfUnits = isBollito ? 3 : 6;
  const label = isBollito ? 'Bollitos' : 'Pulguitas';

  // Por defecto sugerimos Cúrcuma y Cacao (combinación de 7€)
  const [flavor1Id, setFlavor1Id] = useState('curcuma');
  const [flavor2Id, setFlavor2Id] = useState('cacao');

  const flavor1 = MITAD_Y_MITAD_FLAVORS.find(f => f.id === flavor1Id) || MITAD_Y_MITAD_FLAVORS[0];
  const flavor2 = MITAD_Y_MITAD_FLAVORS.find(f => f.id === flavor2Id) || MITAD_Y_MITAD_FLAVORS[1];

  // Cálculo del precio según las reglas del usuario:
  // - Tomate y orégano en alguna mitad -> 8€
  // - Cúrcuma + Cacao -> 7€
  // - Resto -> 7,50€
  const currentPrice = calculateMitadYMitadPrice(flavor1Id, flavor2Id);

  // Alérgenos combinados de ambos sabores sin duplicados
  const combinedAllergens = Array.from(new Set([...(flavor1.allergens || []), ...(flavor2.allergens || [])]));

  // Identificador canónico del pack (para que el orden en que se elijan no cree duplicados)
  const sortedIds = [flavor1.id, flavor2.id].sort();
  const currentPackId = `mitad_${productType}_${sortedIds[0]}_${sortedIds[1]}`;

  // Buscar cuántos packs de esta combinación exacta hay ya en la cesta
  const currentPackInCart = cartItems.find(
    item => item.id === currentPackId && item.type === productType
  );
  const currentPackQty = currentPackInCart?.quantity || 0;

  // Filtrar todos los packs "mitad y mitad" de este tipo que estén en la cesta
  const mitadPacksInCart = cartItems.filter(
    item => item.type === productType && (item.id.toString().startsWith('mitad_') || item.isCustomPack)
  );

  const themeBorder = isBollito ? 'border-blue-400 dark:border-blue-500' : 'border-purple-400 dark:border-purple-500';
  const themeBgGradient = isBollito
    ? 'from-blue-50/70 via-white to-amber-50/40 dark:from-slate-700/80 dark:via-slate-800 dark:to-slate-700/50'
    : 'from-purple-50/70 via-white to-amber-50/40 dark:from-slate-700/80 dark:via-slate-800 dark:to-slate-700/50';
  const themeButton = isBollito
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/30';
  const themePillActive = isBollito
    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
    : 'bg-purple-600 text-white border-purple-600 shadow-sm';
  const themeTextColor = isBollito ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400';

  const handleAddCurrentPack = () => {
    const newQty = currentPackQty + 1;
    const customItemData = {
      id: currentPackId,
      type: productType,
      name: `PACK ${totalUnits} ${label} Mitad y Mitad (${halfUnits}x ${flavor1.name} + ${halfUnits}x ${flavor2.name})`,
      price: currentPrice,
      quantity: newQty,
      image: '🧺',
      icon: '🧺',
      isCustomPack: true,
      flavor1: flavor1.id,
      flavor2: flavor2.id
    };

    onUpdateQuantity(currentPackId, newQty, customItemData);

    toast.success(t('mitad_y_mitad.toast_added', { defaultValue: '¡Pack Mitad y Mitad añadido a tu pedido!' }), {
      duration: 3000,
      position: 'top-center'
    });
  };

  // Etiqueta explicativa de la tarifa aplicada
  const getPriceExplanation = () => {
    if (flavor1Id === 'tomate' || flavor2Id === 'tomate') {
      return {
        text: t('mitad_y_mitad.rule_tomate', { defaultValue: 'Con Tomate y Orégano · 8,00 €' }),
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
      };
    }
    if ((flavor1Id === 'cacao' || flavor1Id === 'curcuma') && (flavor2Id === 'cacao' || flavor2Id === 'curcuma')) {
      return {
        text: t('mitad_y_mitad.rule_curcuma_cacao', { defaultValue: 'Cúrcuma + Cacao · 7,00 €' }),
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
      };
    }
    return {
      text: t('mitad_y_mitad.rule_standard', { defaultValue: 'Combinación estándar · 7,50 €' }),
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-slate-700 dark:text-blue-200'
    };
  };

  const explanation = getPriceExplanation();

  return (
    <motion.div
      className={`w-full p-5 sm:p-6 rounded-2xl border-2 ${themeBorder} bg-gradient-to-br ${themeBgGradient} shadow-xl transition-all duration-300 mb-8`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Cabecera de la tarjeta */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
          <Sparkles className="w-3.5 h-3.5" />
          {t('mitad_y_mitad.badge', { defaultValue: 'Personalizable · 2 Sabores' })}
        </span>

        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${explanation.badgeClass}`}>
          {explanation.text}
        </span>
      </div>

      <div className="text-center sm:text-left mb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center justify-center sm:justify-start gap-2">
          <span>🧺</span>
          <span>
            {isBollito
              ? t('mitad_y_mitad.title_bollitos', { defaultValue: 'PACK 6 Bollitos Mitad y Mitad (3 + 3)' })
              : t('mitad_y_mitad.title_pulguitas', { defaultValue: 'PACK 12 Pulguitas Mitad y Mitad (6 + 6)' })}
          </span>
        </h3>
        <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
          {isBollito
            ? t('mitad_y_mitad.subtitle_bollitos', {
                defaultValue: 'Elige 2 sabores a tu gusto: recibirás 3 bollitos de un sabor y 3 del otro.'
              })
            : t('mitad_y_mitad.subtitle_pulguitas', {
                defaultValue: 'Elige 2 sabores a tu gusto: recibirás 6 pulguitas de un sabor y 6 de la otra.'
              })}
        </p>
      </div>

      {/* Selectores de los 2 sabores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sabor 1 */}
        <div className="p-3.5 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              {t('mitad_y_mitad.flavor1_label', { count: halfUnits, defaultValue: `1ª Mitad (${halfUnits} uds)` })}
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1">
              <span>{flavor1.icon}</span> {flavor1.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {MITAD_Y_MITAD_FLAVORS.map(f => {
              const active = f.id === flavor1Id;
              return (
                <button
                  key={`f1_${f.id}`}
                  type="button"
                  onClick={() => setFlavor1Id(f.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left truncate ${
                    active
                      ? themePillActive
                      : 'bg-gray-50 dark:bg-slate-700/60 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-600 hover:border-gray-400'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span className="truncate">{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sabor 2 */}
        <div className="p-3.5 bg-white/80 dark:bg-slate-800/80 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              {t('mitad_y_mitad.flavor2_label', { count: halfUnits, defaultValue: `2ª Mitad (${halfUnits} uds)` })}
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-1">
              <span>{flavor2.icon}</span> {flavor2.name}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {MITAD_Y_MITAD_FLAVORS.map(f => {
              const active = f.id === flavor2Id;
              return (
                <button
                  key={`f2_${f.id}`}
                  type="button"
                  onClick={() => setFlavor2Id(f.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left truncate ${
                    active
                      ? themePillActive
                      : 'bg-gray-50 dark:bg-slate-700/60 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-600 hover:border-gray-400'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span className="truncate">{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen de alérgenos y selección */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200/80 dark:border-slate-600 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">
            {t('mitad_y_mitad.allergens_label', { defaultValue: 'Alérgenos:' })}
          </span>
          <AllergenBadges allergens={combinedAllergens} />
        </div>

        <div className="text-xs font-medium text-gray-600 dark:text-slate-300">
          <span className="font-bold">{halfUnits}x</span> {flavor1.name} + <span className="font-bold">{halfUnits}x</span> {flavor2.name}
        </div>
      </div>

      {/* Precio y botón de añadir */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div>
          <span className="block text-xs text-gray-500 dark:text-slate-400">
            {t('mitad_y_mitad.price_label', { defaultValue: 'Precio del pack:' })}
          </span>
          <span className={`text-2xl font-black ${themeTextColor}`}>
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentPackQty > 0 ? (
            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
              <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                {t('mitad_y_mitad.in_cart', { defaultValue: 'En tu cesta:' })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="-1"
                  onClick={() => onUpdateQuantity(currentPackId, currentPackQty - 1, currentPackInCart || { id: currentPackId, type: productType, name: `PACK ${totalUnits} ${label} Mitad y Mitad (${halfUnits}x ${flavor1.name} + ${halfUnits}x ${flavor2.name})`, price: currentPrice, isCustomPack: true })}
                  className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="min-w-[2rem] text-center text-lg font-bold text-gray-800 dark:text-white">
                  {currentPackQty}
                </span>
                <button
                  type="button"
                  aria-label="+1"
                  onClick={handleAddCurrentPack}
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${themeButton} transition`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={handleAddCurrentPack}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 ${themeButton} transition-all`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-5 h-5" />
              <span>{t('mitad_y_mitad.add_button', { defaultValue: 'Añadir este Pack' })} · {formatPrice(currentPrice)}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Si hay otros packs mitad y mitad en la cesta, mostrarlos para fácil gestión */}
      {mitadPacksInCart.length > 0 && (
        <div className="mt-4 pt-4 border-t border-dashed border-gray-200 dark:border-slate-600">
          <span className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-2">
            {t('mitad_y_mitad.configured_packs', { defaultValue: 'Tus Packs Mitad y Mitad añadidos:' })}
          </span>
          <div className="space-y-2">
            {mitadPacksInCart.map(rawPack => {
              const packResolved = resolveMitadPackDetails(rawPack);
              const pack = packResolved ? { ...packResolved, ...rawPack, price: rawPack.price || packResolved.price, name: rawPack.name || packResolved.name } : rawPack;
              return (
                <div
                  key={pack.id}
                  className="flex items-center justify-between p-2.5 bg-white/90 dark:bg-slate-800/90 rounded-lg border border-gray-200 dark:border-slate-600 text-sm"
                >
                  <div className="pr-2">
                    <span className="font-bold text-gray-800 dark:text-white block">
                      {pack.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-slate-400">
                      {formatPrice(pack.price)} / pack
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      aria-label="-1"
                      onClick={() => onUpdateQuantity(pack.id, pack.quantity - 1, pack)}
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 dark:border-slate-500 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="min-w-[1.5rem] text-center font-bold text-gray-800 dark:text-white">
                      {pack.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="+1"
                      onClick={() => onUpdateQuantity(pack.id, pack.quantity + 1, pack)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${themeButton} transition`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Eliminar"
                      onClick={() => onUpdateQuantity(pack.id, 0, pack)}
                      className="ml-1 text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MitadYMitadCard;
