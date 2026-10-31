/**
 * Utilidades para la persistencia de pedidos anteriores,
 * panes favoritos y datos de entrega del cliente en PanZen.
 */

const LAST_ORDER_KEY = 'panzen_last_order';
const FAVORITE_BREADS_KEY = 'panzen_favorite_breads';
const DELIVERY_DATA_KEY = 'panzen_delivery_data';

// ==================== ÚLTIMO PEDIDO ====================

export const saveLastOrder = (cartItems, optionalExtras = []) => {
  try {
    if (!cartItems || cartItems.length === 0) return;
    const payload = {
      timestamp: Date.now(),
      items: cartItems,
      optionalExtras: optionalExtras || []
    };
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn('No se pudo guardar el último pedido:', e);
  }
};

export const getLastOrder = () => {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);

    const sanitizeItems = (items) => {
      if (!Array.isArray(items)) return [];
      return items.map(item => {
        if (item.type === 'panPersonalizado') {
          let harinas = item.harinas;
          let extras = item.extras;
          if (harinas && !Array.isArray(harinas) && Array.isArray(harinas.harinas)) {
            extras = harinas.extras || extras;
            harinas = harinas.harinas;
          }
          return {
            ...item,
            harinas: Array.isArray(harinas) ? harinas : [],
            extras: Array.isArray(extras) ? extras : []
          };
        }
        return item;
      });
    };

    if (parsed && Array.isArray(parsed.items) && parsed.items.length > 0) {
      return {
        ...parsed,
        items: sanitizeItems(parsed.items)
      };
    }
    // Formato antiguo compatible
    if (Array.isArray(parsed) && parsed.length > 0) {
      return { timestamp: Date.now(), items: sanitizeItems(parsed), optionalExtras: [] };
    }
    return null;
  } catch {
    return null;
  }
};

// ==================== PANES FAVORITOS ====================

const generateBreadFingerprint = (harinas = [], extras = []) => {
  const safeHarinas = Array.isArray(harinas) ? harinas : [];
  const safeExtras = Array.isArray(extras) ? extras : [];
  const flourIds = safeHarinas.map(h => h.id).sort((a, b) => a - b).join('-');
  const extraIds = safeExtras.map(e => e.id).sort((a, b) => a - b).join('-');
  return `${flourIds}__${extraIds}`;
};

export const getFavoriteBreads = () => {
  try {
    const raw = localStorage.getItem(FAVORITE_BREADS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .map(fav => {
        let harinas = fav.harinas;
        let extras = fav.extras;
        if (harinas && !Array.isArray(harinas) && Array.isArray(harinas.harinas)) {
          extras = harinas.extras || extras;
          harinas = harinas.harinas;
        }
        return {
          ...fav,
          harinas: Array.isArray(harinas) ? harinas : [],
          extras: Array.isArray(extras) ? extras : []
        };
      })
      .filter(fav => fav.harinas.length > 0);
  } catch {
    return [];
  }
};

export const isFavoriteBread = (pan) => {
  if (!pan) return false;
  const favorites = getFavoriteBreads();
  const harinas = Array.isArray(pan.harinas) ? pan.harinas : (Array.isArray(pan.harinas?.harinas) ? pan.harinas.harinas : []);
  const extras = Array.isArray(pan.extras) ? pan.extras : (Array.isArray(pan.harinas?.extras) ? pan.harinas.extras : []);
  const fp = generateBreadFingerprint(harinas, extras);
  return favorites.some(fav => generateBreadFingerprint(fav.harinas, fav.extras) === fp);
};

export const toggleFavoriteBread = (pan) => {
  try {
    if (!pan) return false;
    const rawHarinas = pan.harinas;
    const harinas = Array.isArray(rawHarinas)
      ? rawHarinas
      : (Array.isArray(rawHarinas?.harinas) ? rawHarinas.harinas : []);
    const extras = Array.isArray(pan.extras)
      ? pan.extras
      : (Array.isArray(rawHarinas?.extras) ? rawHarinas.extras : []);

    if (harinas.length === 0) return false;

    const favorites = getFavoriteBreads();
    const fp = generateBreadFingerprint(harinas, extras);
    const existingIndex = favorites.findIndex(fav => generateBreadFingerprint(fav.harinas, fav.extras) === fp);

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      localStorage.setItem(FAVORITE_BREADS_KEY, JSON.stringify(favorites));
      try { window.dispatchEvent(new Event('storage')); } catch {}
      return false; // Ahora no es favorito
    } else {
      const flourNames = harinas.filter(h => h.price > 0).map(h => (h.name || '').replace(' Integral Ecológico', '')).join(' + ');
      const newFav = {
        id: `fav_${Date.now()}`,
        name: flourNames || 'Mi Barra Favorita',
        harinas: [...harinas],
        extras: [...extras],
        price: pan.price || 6,
        createdAt: Date.now()
      };
      favorites.unshift(newFav);
      localStorage.setItem(FAVORITE_BREADS_KEY, JSON.stringify(favorites));
      try { window.dispatchEvent(new Event('storage')); } catch {}
      return true; // Ahora es favorito
    }
  } catch (e) {
    console.warn('Error al gestionar favoritos:', e);
    return false;
  }
};

// ==================== PRODUCTOS FAVORITOS (BOLLITOS Y PULGUITAS) ====================

const FAVORITE_PRODUCTS_KEY = 'panzen_favorite_products';

export const getFavoriteProducts = () => {
  try {
    const raw = localStorage.getItem(FAVORITE_PRODUCTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
};

export const getFavoriteBollitos = () => {
  return getFavoriteProducts().filter(p => p.type === 'bollito');
};

export const getFavoritePulguitas = () => {
  return getFavoriteProducts().filter(p => p.type === 'pulguita');
};

export const isFavoriteProduct = (productId, productType) => {
  if (!productId || !productType) return false;
  const favorites = getFavoriteProducts();
  const idStr = String(productId);
  return favorites.some(fav => String(fav.id) === idStr && fav.type === productType);
};

export const toggleFavoriteProduct = (product, productType) => {
  try {
    if (!product || !productType) return false;
    const favorites = getFavoriteProducts();
    const idStr = String(product.id);
    const existingIndex = favorites.findIndex(
      fav => String(fav.id) === idStr && fav.type === productType
    );

    if (existingIndex >= 0) {
      favorites.splice(existingIndex, 1);
      localStorage.setItem(FAVORITE_PRODUCTS_KEY, JSON.stringify(favorites));
      try { window.dispatchEvent(new Event('storage')); } catch {}
      return false; // Ahora no es favorito
    } else {
      const newFav = {
        id: product.id,
        type: productType,
        name: product.name || '',
        price: product.price || 0,
        photo: product.photo || null,
        image: product.image || (productType === 'bollito' ? '🥖' : '🥯'),
        createdAt: Date.now()
      };
      favorites.unshift(newFav);
      localStorage.setItem(FAVORITE_PRODUCTS_KEY, JSON.stringify(favorites));
      try { window.dispatchEvent(new Event('storage')); } catch {}
      return true; // Ahora es favorito
    }
  } catch (e) {
    console.warn('Error al gestionar favoritos de producto:', e);
    return false;
  }
};

// ==================== DATOS DE ENTREGA DEL CLIENTE ====================

export const getDeliveryData = () => {
  try {
    const raw = localStorage.getItem(DELIVERY_DATA_KEY);
    if (!raw) return { name: '', address: '', phone: '', paymentMethod: 'bizum', notes: '', preferredTime: '' };
    return { ...{ name: '', address: '', phone: '', paymentMethod: 'bizum', notes: '', preferredTime: '' }, ...JSON.parse(raw) };
  } catch {
    return { name: '', address: '', phone: '', paymentMethod: 'bizum', notes: '', preferredTime: '' };
  }
};

export const saveDeliveryData = (data) => {
  try {
    localStorage.setItem(DELIVERY_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Error al guardar datos de entrega:', e);
  }
};
