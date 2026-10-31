import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HarinaSelector from './components/HarinaSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import SuccessModal from './components/SuccessModal';
import VideoHelpButton from './components/VideoHelpButton';
import MobileCartBar from './components/MobileCartBar';
import TrustBar from './components/TrustBar';
import BreadVisualizer from './components/BreadVisualizer';
import { extras, bollitos, pulguitas, otrosPanes, optionalExtras } from './data/products';
import { calculatePanBasePrice } from './utils/calculatePanPrice';
import { getLastOrder } from './utils/orderStorage';
import { toast } from 'react-hot-toast';

// Lazy loading de páginas
const BollitosPage = React.lazy(() => import('./pages/BollitosPage'));
const PulguitasPage = React.lazy(() => import('./pages/PulguitasPage'));
const InformacionPage = React.lazy(() => import('./pages/InformacionPage'));

// Decoración navideña: carga diferida (sus imágenes solo se descargan en temporada)
const ChristmasDecorations = React.lazy(() => import('./components/ChristmasDecorations'));

// Temporada navideña: del 1 de diciembre al 6 de enero (Reyes)
const isChristmasSeason = () => {
  const now = new Date();
  const month = now.getMonth(); // 0 = enero, 11 = diciembre
  const day = now.getDate();
  return month === 11 || (month === 0 && day <= 6);
};

// Subir la página y actualizar el título de la pestaña al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    const titles = {
      '/': t('nav.pan_personalizado'),
      '/bollitos': t('nav.bollitos'),
      '/pulguitas': t('nav.pulguitas'),
      '/informacion': t('nav.info'),
    };
    document.title = titles[pathname] ? `${titles[pathname]} — PanZen` : 'PanZen';
  }, [pathname, t]);
  return null;
};

// Componente para manejar las rutas con animaciones
const AnimatedRoutes = ({
  cartItems,
  handleAddPanPersonalizado,
  handleUpdatePanExtras,
  handleUpdateCartItem,
  setIsAddButtonVisible,
  selectedHarinas,
  setSelectedHarinas
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <HarinaSelector
              onAddPan={handleAddPanPersonalizado}
              existingPanesCount={cartItems.filter(item => item.type === 'panPersonalizado').length}
              setIsAddButtonVisible={setIsAddButtonVisible}
              selectedHarinas={selectedHarinas}
              setSelectedHarinas={setSelectedHarinas}
              cartItems={cartItems}
              onUpdateCartItem={handleUpdateCartItem}
            />
            <ExtrasSelector
              cartItems={cartItems}
              onUpdatePanExtras={handleUpdatePanExtras}
            />
          </motion.div>
        } />
        <Route path="/bollitos" element={
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <BollitosPage
              cartItems={cartItems}
              selectedBollitos={cartItems.filter(item => item.type === 'bollito')
                .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
              onUpdateBollitoQuantity={(id, qty, customData) => handleUpdateCartItem(id, qty, 'bollito', customData)}
              onAddPan={handleAddPanPersonalizado}
              onUpdateCartItem={handleUpdateCartItem}
            />
          </motion.div>
        } />
        <Route path="/pulguitas" element={
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <PulguitasPage
              cartItems={cartItems}
              selectedPulguitas={cartItems.filter(item => item.type === 'pulguita')
                .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
              onUpdatePulguitaQuantity={(id, qty, customData) => handleUpdateCartItem(id, qty, 'pulguita', customData)}
              onAddPan={handleAddPanPersonalizado}
              onUpdateCartItem={handleUpdateCartItem}
            />
          </motion.div>
        } />
        <Route path="/informacion" element={
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <InformacionPage />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
};

// Claves antiguas de almacenamiento para limpieza
const CART_STORAGE_KEY = 'panzen_cart';
const LAST_ORDER_KEY = 'panzen_last_order';

const App = () => {
  const { t } = useTranslation();
  // La cesta se inicia vacía al abrir la app
  const [cartItems, setCartItems] = useState([]);
  const [selectedHarinas, setSelectedHarinas] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const [selectedOptionalExtras, setSelectedOptionalExtras] = useState([]);
  const [lastOrder, setLastOrder] = useState(getLastOrder);

  // Limpiar cesta temporal previa pero conservar último pedido
  useEffect(() => {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // almacenamiento no disponible
    }
  }, []);

  const handleRepeatLastOrder = () => {
    const saved = getLastOrder();
    if (!saved || !saved.items || saved.items.length === 0) return;
    const now = Date.now();
    const items = saved.items.map((item, index) => {
      if (item.type === 'panPersonalizado') {
        let harinas = item.harinas;
        let extras = item.extras;
        if (harinas && !Array.isArray(harinas) && Array.isArray(harinas.harinas)) {
          extras = harinas.extras || extras;
          harinas = harinas.harinas;
        }
        return {
          ...item,
          id: now + index,
          harinas: Array.isArray(harinas) ? [...harinas] : [],
          extras: Array.isArray(extras) ? [...extras] : []
        };
      }
      return { ...item };
    });
    setCartItems(items);
    if (Array.isArray(saved.optionalExtras)) {
      setSelectedOptionalExtras(saved.optionalExtras);
    }
    toast.success(t('order_summary.repeat_toast', { defaultValue: '¡Tu pedido habitual se ha cargado en la cesta! 🧺' }), {
      duration: 3500,
      position: 'top-center',
      style: {
        background: '#B8860B',
        color: '#fff',
        fontWeight: 'bold',
        borderRadius: '16px'
      }
    });
    const el = document.getElementById('order-summary');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getProductDetails = (id, type) => {
    switch (type) {
      case 'extra': return extras.find(p => p.id === id);
      case 'bollito': return bollitos.find(p => p.id === id);
      case 'pulguita': return pulguitas.find(p => p.id === id);
      case 'otroPan': return otrosPanes.find(p => p.id === id);
      default: return null;
    }
  };

  const handleAddPanPersonalizado = (pan) => {
    let harinas = pan.harinas;
    let extras = pan.extras;
    if (harinas && !Array.isArray(harinas) && Array.isArray(harinas.harinas)) {
      extras = harinas.extras || extras;
      harinas = harinas.harinas;
    }
    const safePan = {
      ...pan,
      harinas: Array.isArray(harinas) ? harinas : [],
      extras: Array.isArray(extras) ? extras : []
    };
    setCartItems(prev => [...prev, safePan]);
  };

  const handleUpdateCartItem = (id, quantity, type, customItemData = null) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === id && item.type === type);
      const newQuantity = Math.max(0, quantity);

      if (newQuantity === 0) {
        return prevItems.filter(item => !(item.id === id && item.type === type));
      }

      if (existingIndex > -1) {
        return prevItems.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: newQuantity } : item
        );
      }

      if (customItemData) {
        return [
          ...prevItems,
          {
            ...customItemData,
            id,
            quantity: newQuantity,
            type
          }
        ];
      }

      const product = getProductDetails(id, type);
      if (product) {
        return [
          ...prevItems,
          {
            id,
            quantity: newQuantity,
            type,
            name: product.name,
            price: product.price,
            image: product.image,
            icon: product.icon,
            photo: product.photo
          }
        ];
      }

      return prevItems;
    });
  };

  const handleRemoveCartItem = (id, type) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.id === id && item.type === type))
    );
  };

  const handleUpdatePanExtras = (updatedCart) => {
    setCartItems(updatedCart);
  };

  // Duplicar un pan personalizado (mismas harinas y extras, nueva unidad)
  const handleDuplicatePan = (pan) => {
    setCartItems(prev => [...prev, {
      ...pan,
      id: Date.now(),
      harinas: [...pan.harinas],
      extras: [...(pan.extras || [])]
    }]);
  };

  const handleSendWhatsApp = () => {
    setLastOrder(getLastOrder());
    setShowSuccessModal(true);
    setCartItems([]);
    setSelectedOptionalExtras([]);
  };

  // Actualizar un pan personalizado ya añadido (desde el editor del resumen):
  // harinas, corte y también sus extras
  const handleUpdatePan = (panId, newHarinas, newExtras) => {
    setCartItems(prev => prev.map(item =>
      item.id === panId && item.type === 'panPersonalizado'
        ? { ...item, harinas: newHarinas, extras: newExtras ?? item.extras, price: calculatePanBasePrice(newHarinas) }
        : item
    ));
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCartItems([]);
    setSelectedOptionalExtras([]);
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  // Subtotal aproximado (sin descuentos) para la barra de carrito en móvil, incluyendo la propina, café y cerveza
  const cartSubtotal = cartItems.reduce((sum, item) => {
    if (item.type === 'panPersonalizado') {
      const extrasTotal = item.extras?.reduce((acc, e) => acc + e.price, 0) || 0;
      return sum + item.price + extrasTotal;
    }
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0) + selectedOptionalExtras.reduce((sum, id) => {
    const e = optionalExtras.find(opt => opt.id === id);
    return sum + (e ? e.price : 0);
  }, 0);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#151311] text-stone-800 dark:text-stone-100 relative transition-colors duration-300">
        {/* Decoración navideña automática (1 dic - 6 ene) */}
        {isChristmasSeason() && (
          <Suspense fallback={null}>
            <ChristmasDecorations />
          </Suspense>
        )}

        <Header lastOrder={lastOrder} onRepeatLastOrder={handleRepeatLastOrder} />
        <Navigation />
        <TrustBar />

        <div className="max-w-6xl mx-auto p-4 py-8 pb-28 lg:pb-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
                  <AnimatedRoutes
                    cartItems={cartItems}
                    handleAddPanPersonalizado={handleAddPanPersonalizado}
                    handleUpdatePanExtras={handleUpdatePanExtras}
                    handleUpdateCartItem={handleUpdateCartItem}
                    setIsAddButtonVisible={setIsAddButtonVisible}
                    selectedHarinas={selectedHarinas}
                    setSelectedHarinas={setSelectedHarinas}
                  />
                </Suspense>
              </div>

              <div className="lg:col-span-1" id="order-summary">
                <div className="sticky top-4 space-y-4">
                  {/* Cuadro de Tu Creación antes del resumen del pedido */}
                  <BreadVisualizer
                    selectedHarinas={selectedHarinas}
                    cartItems={cartItems}
                  />

                  <OrderSummary
                    cartItems={cartItems}
                    onSendWhatsApp={handleSendWhatsApp}
                    onRemoveItem={handleRemoveCartItem}
                    onDuplicateItem={handleDuplicatePan}
                    onEditPanHarinas={handleUpdatePan}
                    onUpdateCartItem={handleUpdateCartItem}
                    lastOrder={lastOrder}
                    onRepeatLastOrder={handleRepeatLastOrder}
                    selectedOptionalExtras={selectedOptionalExtras}
                    setSelectedOptionalExtras={setSelectedOptionalExtras}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />

        {/* Botón flotante de Video Ayuda */}
        <VideoHelpButton isRaised={isAddButtonVisible} />

        {/* Barra de carrito fija en móvil */}
        <MobileCartBar itemCount={cartItemCount} subtotal={cartSubtotal} />
      </div>
    </Router>
  );
};

export default App;
