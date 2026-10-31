import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ChevronDown,
  Plus,
  Trash2,
  Wheat,
  Cookie,
  CircleDot,
  Check
} from 'lucide-react';
import {
  getFavoriteBreads,
  toggleFavoriteBread,
  getFavoriteProducts,
  toggleFavoriteProduct
} from '../utils/orderStorage';
import { formatPrice } from '../utils/formatPrice';
import { calculatePanBasePrice } from '../utils/calculatePanPrice';
import { bollitos, pulguitas } from '../data/products';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

/**
 * Sección desplegable no invasiva de "Tus Favoritos".
 * Aglutina Panes Personalizados, Bollitos y Pulguitas en un acordeón limpio y accesible.
 */
const UnifiedFavoritesSection = ({
  cartItems = [],
  onAddPan,
  onUpdateCartItem
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [favBreads, setFavBreads] = useState([]);
  const [favProducts, setFavProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'pan', 'bollito', 'pulguita'

  const refreshFavorites = () => {
    setFavBreads(getFavoriteBreads());
    setFavProducts(getFavoriteProducts());
  };

  useEffect(() => {
    refreshFavorites();
    const handleStorageChange = () => refreshFavorites();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const bollitoFavorites = favProducts.filter(p => p.type === 'bollito');
  const pulguitaFavorites = favProducts.filter(p => p.type === 'pulguita');
  const totalFavoritesCount = favBreads.length + bollitoFavorites.length + pulguitaFavorites.length;

  // No ocupa espacio si el usuario aún no tiene ningún favorito guardado
  if (totalFavoritesCount === 0) {
    return null;
  }

  const availableCategoriesCount = [
    favBreads.length > 0,
    bollitoFavorites.length > 0,
    pulguitaFavorites.length > 0
  ].filter(Boolean).length;

  // Añadir Pan personalizado a la cesta
  const handleAddBreadToCart = (fav) => {
    if (!onAddPan) return;
    let harinas = fav.harinas;
    let extras = fav.extras;
    if (harinas && !Array.isArray(harinas) && Array.isArray(harinas.harinas)) {
      extras = harinas.extras || extras;
      harinas = harinas.harinas;
    }
    const safeHarinas = Array.isArray(harinas) ? [...harinas] : [];
    const safeExtras = Array.isArray(extras) ? [...extras] : [];

    onAddPan({
      id: Date.now(),
      type: 'panPersonalizado',
      harinas: safeHarinas,
      extras: safeExtras,
      price: fav.price || calculatePanBasePrice(safeHarinas),
      quantity: 1
    });

    toast.success(t('unified_favorites.toast_bread_added', { defaultValue: '¡Barra favorita añadida a la cesta! ❤️' }), {
      duration: 3500,
      position: 'top-center',
      style: {
        background: '#B8860B',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '16px'
      }
    });
  };

  // Añadir Bollito o Pulguita a la cesta
  const handleAddProductToCart = (fav) => {
    if (!onUpdateCartItem) return;
    const existing = cartItems.find(item => String(item.id) === String(fav.id) && item.type === fav.type);
    const newQty = (existing?.quantity || 0) + 1;

    onUpdateCartItem(fav.id, newQty, fav.type, fav);

    const isBollito = fav.type === 'bollito';
    toast.success(
      isBollito
        ? t('unified_favorites.toast_bollito_added', { defaultValue: '¡Bollito favorito añadido a la cesta! 🥖' })
        : t('unified_favorites.toast_pulguita_added', { defaultValue: '¡Pulguita favorita añadida a la cesta! 🥯' }),
      {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#B8860B',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '16px'
        }
      }
    );
  };

  // Eliminar pan de favoritos
  const handleRemoveBread = (e, fav) => {
    e.stopPropagation();
    toggleFavoriteBread(fav);
    refreshFavorites();
    toast(t('unified_favorites.toast_removed', { defaultValue: 'Eliminado de favoritos 🤍' }), {
      icon: '🤍',
      duration: 2500,
      position: 'top-center'
    });
  };

  // Eliminar producto de favoritos
  const handleRemoveProduct = (e, fav) => {
    e.stopPropagation();
    toggleFavoriteProduct(fav, fav.type);
    refreshFavorites();
    toast(t('unified_favorites.toast_removed', { defaultValue: 'Eliminado de favoritos 🤍' }), {
      icon: '🤍',
      duration: 2500,
      position: 'top-center'
    });
  };

  // Obtener nombre traducido
  const getProductTitle = (item) => {
    if (item.name && item.name.startsWith('PACK')) return item.name;
    const catalog = item.type === 'bollito' ? bollitos : pulguitas;
    const found = catalog.find(p => String(p.id) === String(item.id));
    if (found) {
      const translationKey = `products.${item.type === 'bollito' ? 'bollitos' : 'pulguitas'}.${found.id.toString().replace('.', '_')}.name`;
      return t(translationKey, { defaultValue: found.name });
    }
    return item.name || 'Favorito';
  };

  // Obtener foto o icono
  const getProductVisual = (item) => {
    const catalog = item.type === 'bollito' ? bollitos : pulguitas;
    const found = catalog.find(p => String(p.id) === String(item.id));
    const photo = item.photo || found?.photo;
    const icon = item.image || found?.image || (item.type === 'bollito' ? '🥖' : '🥯');
    return { photo, icon };
  };

  const showBreads = selectedFilter === 'all' || selectedFilter === 'pan';
  const showBollitos = selectedFilter === 'all' || selectedFilter === 'bollito';
  const showPulguitas = selectedFilter === 'all' || selectedFilter === 'pulguita';

  return (
    <div className="mb-6 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-amber-300/80 dark:border-stone-700 shadow-sm overflow-hidden transition-all duration-300">
      {/* Barra de cabecera desplegable (no invasiva) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-100/60 via-amber-50/40 to-white dark:from-stone-850 dark:via-stone-900 dark:to-stone-900 hover:bg-amber-100/80 transition-all text-left cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-white leading-tight">
                {t('unified_favorites.title', { defaultValue: 'Tus Favoritos' })}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-stone-950 shadow-2xs">
                {totalFavoritesCount}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {isOpen
                ? t('unified_favorites.subtitle', { defaultValue: 'Pide tus productos habituales con 1 solo toque' })
                : t('unified_favorites.open_prompt', { defaultValue: 'Toca aquí para ver y pedir tus favoritos guardados' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline-block text-xs font-semibold text-amber-900 dark:text-amber-200 group-hover:underline">
            {isOpen ? 'Ocultar' : 'Ver favoritos'}
          </span>
          <div className={`p-1.5 rounded-full bg-white dark:bg-stone-800 border border-amber-200 dark:border-stone-700 shadow-2xs transition-transform duration-300 ${isOpen ? 'rotate-180 bg-amber-500 text-stone-950' : 'text-stone-600 dark:text-stone-300'}`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Contenido desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-amber-200/80 dark:border-stone-800 overflow-hidden"
          >
            <div className="p-4 sm:p-5 bg-amber-50/40 dark:bg-stone-900/40 space-y-3.5">
              {/* Filtros rápidos por tipo (solo si hay más de 1 categoría guardada) */}
              {availableCategoriesCount > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                      selectedFilter === 'all'
                        ? 'bg-amber-500 text-stone-950 shadow-sm'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {t('unified_favorites.filter_all', { defaultValue: 'Todos' })} ({totalFavoritesCount})
                  </button>

                  {favBreads.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFilter('pan')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        selectedFilter === 'pan'
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span>🌾</span>
                      <span>{t('unified_favorites.filter_panes', { defaultValue: 'Barras' })}</span>
                      <span className="opacity-75">({favBreads.length})</span>
                    </button>
                  )}

                  {bollitoFavorites.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFilter('bollito')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        selectedFilter === 'bollito'
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span>🥖</span>
                      <span>{t('unified_favorites.filter_bollitos', { defaultValue: 'Bollitos' })}</span>
                      <span className="opacity-75">({bollitoFavorites.length})</span>
                    </button>
                  )}

                  {pulguitaFavorites.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedFilter('pulguita')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                        selectedFilter === 'pulguita'
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <span>🥯</span>
                      <span>{t('unified_favorites.filter_pulguitas', { defaultValue: 'Pulguitas' })}</span>
                      <span className="opacity-75">({pulguitaFavorites.length})</span>
                    </button>
                  )}
                </div>
              )}

              {/* Grid de tarjetas de favoritos con diseño claro y directo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. BARRAS */}
                {showBreads && favBreads.map((fav) => {
                  const flours = (fav.harinas || []).filter(h => h.price > 0);
                  const corte = (fav.harinas || []).find(h => h.price === 0);
                  const extrasTotal = (fav.extras || []).reduce((sum, e) => sum + (e.price || 0), 0);
                  const totalPrice = calculatePanBasePrice(fav.harinas) + extrasTotal;

                  return (
                    <div
                      key={fav.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200/90 dark:border-stone-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-2.5 relative group"
                    >
                      <div>
                        {/* Cabecera de tarjeta: Tipo + Botón quitar */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            <Wheat className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            {t('unified_favorites.badge_bread', { defaultValue: 'Barra' })}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveBread(e, fav)}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-700 transition"
                            title={t('favorite_products.remove_favorite', { defaultValue: 'Eliminar de favoritos' })}
                            aria-label="Eliminar de favoritos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Nombre de harinas */}
                        <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white leading-snug">
                          {flours.map(f => (f.name || '').replace(' Integral Ecológico', '')).join(' + ') || 'Barra a Medida'}
                        </h4>

                        {/* Corte y Extras */}
                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex flex-wrap gap-1">
                          <span className="bg-stone-100 dark:bg-stone-700/60 px-1.5 py-0.2 rounded text-[11px]">
                            {corte ? corte.name.replace(' (gratuito)', '') : 'Entero'}
                          </span>
                          {fav.extras?.length > 0 && (
                            <span className="bg-amber-100/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 px-1.5 py-0.2 rounded text-[11px] font-medium">
                              +{fav.extras.length} extras
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pie: Precio y Botón de Añadir */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                          {formatPrice(totalPrice)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddBreadToCart(fav)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition transform hover:scale-[1.02] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('unified_favorites.add_to_cart', { defaultValue: 'Añadir' })}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* 2. BOLLITOS */}
                {showBollitos && bollitoFavorites.map((fav) => {
                  const title = getProductTitle(fav);
                  const { photo, icon } = getProductVisual(fav);
                  const inCart = cartItems.find(item => String(item.id) === String(fav.id) && item.type === 'bollito');
                  const qtyInCart = inCart?.quantity || 0;

                  return (
                    <div
                      key={`fav_b_${fav.id}`}
                      className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200/90 dark:border-stone-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-2.5 relative group"
                    >
                      <div>
                        {/* Cabecera */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            <Cookie className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            {t('unified_favorites.badge_bollito', { defaultValue: 'Bollito' })}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveProduct(e, fav)}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-700 transition"
                            title={t('favorite_products.remove_favorite', { defaultValue: 'Eliminar de favoritos' })}
                            aria-label="Eliminar de favoritos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Foto e información */}
                        <div className="flex items-center gap-2.5">
                          {photo ? (
                            <img
                              src={photo}
                              alt={title}
                              className="w-12 h-12 rounded-xl object-cover border border-amber-200/60 dark:border-stone-600 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-100/70 dark:bg-stone-700 flex items-center justify-center text-2xl shrink-0">
                              {icon}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white leading-tight line-clamp-2">
                              {title}
                            </h4>
                            {qtyInCart > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                                <Check className="w-3 h-3" />
                                {qtyInCart} en cesta
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pie */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                          {formatPrice(fav.price || 0)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddProductToCart(fav)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition transform hover:scale-[1.02] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{qtyInCart > 0 ? '+1 Más' : t('unified_favorites.add_to_cart', { defaultValue: 'Añadir' })}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* 3. PULGUITAS */}
                {showPulguitas && pulguitaFavorites.map((fav) => {
                  const title = getProductTitle(fav);
                  const { photo, icon } = getProductVisual(fav);
                  const inCart = cartItems.find(item => String(item.id) === String(fav.id) && item.type === 'pulguita');
                  const qtyInCart = inCart?.quantity || 0;

                  return (
                    <div
                      key={`fav_p_${fav.id}`}
                      className="p-3.5 rounded-xl bg-white dark:bg-stone-800 border border-amber-200/90 dark:border-stone-700 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-2.5 relative group"
                    >
                      <div>
                        {/* Cabecera */}
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-stone-700 text-amber-900 dark:text-amber-200 text-[10px] font-bold uppercase tracking-wider">
                            <CircleDot className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            {t('unified_favorites.badge_pulguita', { defaultValue: 'Pulguita' })}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => handleRemoveProduct(e, fav)}
                            className="p-1 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-stone-700 transition"
                            title={t('favorite_products.remove_favorite', { defaultValue: 'Eliminar de favoritos' })}
                            aria-label="Eliminar de favoritos"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Foto e información */}
                        <div className="flex items-center gap-2.5">
                          {photo ? (
                            <img
                              src={photo}
                              alt={title}
                              className="w-12 h-12 rounded-xl object-cover border border-amber-200/60 dark:border-stone-600 shadow-2xs shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-100/70 dark:bg-stone-700 flex items-center justify-center text-2xl shrink-0">
                              {icon}
                            </div>
                          )}

                          <div className="min-w-0">
                            <h4 className="font-serif font-bold text-sm text-stone-900 dark:text-white leading-tight line-clamp-2">
                              {title}
                            </h4>
                            {qtyInCart > 0 && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                                <Check className="w-3 h-3" />
                                {qtyInCart} en cesta
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pie */}
                      <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-base text-amber-700 dark:text-amber-400">
                          {formatPrice(fav.price || 0)}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleAddProductToCart(fav)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition transform hover:scale-[1.02] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{qtyInCart > 0 ? '+1 Más' : t('unified_favorites.add_to_cart', { defaultValue: 'Añadir' })}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedFavoritesSection;
