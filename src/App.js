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
import { harinas, extras, bollitos, pulguitas, otrosPanes } from './data/products';

// Scroll to top on route change
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

  // Get product details
  const getProductDetails = (id, type) => {
    switch (type) {
      case 'harina': return harinas.find(p => p.id === id);
      case 'extra': return extras.find(p => p.id === id);
      case 'bollito': return bollitos.find(p => p.id === id);
      case 'pulguita': return pulguitas.find(p => p.id === id);
      case 'otroPan': return otrosPanes.find(p => p.id === id);
      default: return null;
    }
  };

  // Update cart item quantity
  const handleUpdateCartItem = (id, quantity, type) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === id && item.type === type);
      const newQty = Math.max(0, quantity);

      if (newQty === 0) return prevItems.filter(item => !(item.id === id && item.type === type));
      if (existingIndex > -1) return prevItems.map((item, idx) => idx === existingIndex ? { ...item, quantity: newQty } : item);

      const product = getProductDetails(id, type);
      if (product) return [...prevItems, { id, quantity: newQty, type, name: product.name, price: product.price, image: product.image, icon: product.icon }];
      return prevItems;
    });
  };

  const handleRemoveCartItem = (id, type) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.type === type)));
  };

  // Toggle harina
  const handleToggleHarina = (harina) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === harina.id && i.type === 'harina');
      if (exists) return prev.filter(i => !(i.id === harina.id && i.type === 'harina'));
      return [...prev, { id: harina.id, quantity: 1, type: 'harina', name: harina.name, price: harina.price, image: harina.image, icon: harina.icon }];
    });
  };

  // Toggle extra
  const handleToggleExtra = (extra) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === extra.id && i.type === 'extra');
      if (exists) return prev.filter(i => !(i.id === extra.id && i.type === 'extra'));
      return [...prev, { id: extra.id, quantity: 1, type: 'extra', name: extra.name, price: extra.price, icon: extra.icon }];
    });
  };

  const handleSendWhatsApp = () => { setShowSuccessModal(true); setShowCart(false); };
  const handleCloseModal = () => { setShowSuccessModal(false); setCartItems([]); };

  const cartItemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header cartItemCount={cartItemCount} onOpenCart={() => setShowCart(true)} />
        <Navigation />

        <div className="max-w-6xl mx-auto p-4 py-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Routes>
                  <Route path="/" element={
                    <>
                      <HarinaSelector
                        selectedHarinas={cartItems.filter(i => i.type === 'harina')}
                        onToggleHarina={handleToggleHarina}
                        selectedOtrosPanes={cartItems.filter(i => i.type === 'otroPan').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                        onUpdateOtroPanQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'otroPan')}
                      />
                      <ExtrasSelector
                        selectedExtras={cartItems.filter(i => i.type === 'extra')}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  }/>
                  <Route path="/bollitos" element={<BollitosPage selectedBollitos={cartItems.filter(i => i.type === 'bollito').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})} onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito')} />} />
                  <Route path="/pulguitas" element={<PulguitasPage selectedPulguitas={cartItems.filter(i => i.type === 'pulguita').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})} onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita')} />} />
                  <Route path="/informacion" element={<InformacionPage />} />
                </Routes>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <OrderSummary cartItems={cartItems} onSendWhatsApp={handleSendWhatsApp} />
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
      </div>
    </Router>
  );
};

export default App;
