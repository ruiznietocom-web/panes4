import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HarinaSelector from './components/HarinaSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import SuccessModal from './components/SuccessModal';
import WhatsAppButton from './components/WhatsAppButton';
import { extras, bollitos, pulguitas, otrosPanes } from './data/products';

// Lazy loading de páginas
const BollitosPage = React.lazy(() => import('./pages/BollitosPage'));
const PulguitasPage = React.lazy(() => import('./pages/PulguitasPage'));
const InformacionPage = React.lazy(() => import('./pages/InformacionPage'));

// Subir la página al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Componente para manejar las rutas con animaciones
const AnimatedRoutes = ({ cartItems, handleAddPanPersonalizado, handleUpdatePanExtras, handleUpdateCartItem }) => {
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
            <HarinaSelector onAddPan={handleAddPanPersonalizado} />
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
              selectedBollitos={cartItems.filter(item => item.type === 'bollito')
                .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
              onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito')}
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
              selectedPulguitas={cartItems.filter(item => item.type === 'pulguita')
                .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
              onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita')}
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

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    setCartItems(prev => [...prev, { ...pan, extras: [] }]);
  };

  const handleUpdateCartItem = (id, quantity, type) => {
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
            icon: product.icon
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

  const handleSendWhatsApp = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative transition-colors duration-300">

        <Header />
        <Navigation />

        <div className="max-w-6xl mx-auto p-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Suspense fallback={<div className="text-center p-10">Cargando...</div>}>
                  <AnimatedRoutes
                    cartItems={cartItems}
                    handleAddPanPersonalizado={handleAddPanPersonalizado}
                    handleUpdatePanExtras={handleUpdatePanExtras}
                    handleUpdateCartItem={handleUpdateCartItem}
                  />
                </Suspense>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <OrderSummary
                    cartItems={cartItems}
                    onSendWhatsApp={handleSendWhatsApp}
                    onRemoveItem={handleRemoveCartItem}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <SuccessModal isOpen={showSuccessModal} onClose={handleCloseModal} />

        {/* Botón flotante de WhatsApp */}
        <WhatsAppButton />
      </div>
    </Router>
  );
};

export default App;
