import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HarinaSelector from './components/HarinaSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import SuccessModal from './components/SuccessModal';
import BollitosPage from './pages/BollitosPage';
import PulguitasPage from './pages/PulguitasPage';
import InformacionPage from './pages/InformacionPage';
import ShoppingCart from './components/ShoppingCart';
import WhatsAppButton from './components/WhatsAppButton'; // <-- Importar botón WhatsApp
import { harinas, extras, bollitos, pulguitas, otrosPanes } from './data/products';

// Subir la página al cambiar de ruta
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

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
    setShowCart(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:bg-slate-900 relative transition-colors duration-300">
        <Header cartItemCount={cartItemCount} onOpenCart={() => setShowCart(true)} />
        <Navigation />

        <div className="max-w-6xl mx-auto p-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Routes>
                  <Route path="/" element={
                    <>
                      <HarinaSelector onAddPan={handleAddPanPersonalizado} />
                      <ExtrasSelector
                        cartItems={cartItems}
                        onUpdatePanExtras={handleUpdatePanExtras}
                      />
                    </>
                  } />
                  <Route path="/bollitos" element={
                    <BollitosPage
                      selectedBollitos={cartItems.filter(item => item.type === 'bollito')
                        .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                      onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito')}
                    />
                  } />
                  <Route path="/pulguitas" element={
                    <PulguitasPage
                      selectedPulguitas={cartItems.filter(item => item.type === 'pulguita')
                        .reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                      onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita')}
                    />
                  } />
                  <Route path="/informacion" element={<InformacionPage />} />
                </Routes>
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
        <ShoppingCart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateCartItem}
          onRemoveItem={handleRemoveCartItem}
        />

        {/* Botón flotante de WhatsApp */}
        <WhatsAppButton />
      </div>
    </Router>
  );
};

export default App;
