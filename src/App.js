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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const handleUpdateCartItem = (id, quantity, type) => {
    setCartItems(prev => {
      const idx = prev.findIndex(item => item.id === id && item.type === type);
      if (quantity <= 0) return prev.filter(item => !(item.id === id && item.type === type));
      if (idx > -1) return prev.map((item, i) => i === idx ? { ...item, quantity } : item);
      return prev;
    });
  };

  const handleRemoveCartItem = (id, type) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const handleToggleExtra = (extra) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === extra.id && item.type === 'extra');
      if (existing) return prev.filter(item => !(item.id === extra.id && item.type === 'extra'));
      return [...prev, { id: extra.id, quantity: 1, type: 'extra', name: extra.name, price: extra.price, icon: extra.icon }];
    });
  };

  const handleSendWhatsApp = () => { setShowSuccessModal(true); setShowCart(false); };
  const handleCloseModal = () => { setShowSuccessModal(false); setCartItems([]); };

  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

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
                        onAddPan={(pan) => setCartItems(prev => [...prev, pan])}
                      />
                      <ExtrasSelector 
                        selectedExtras={cartItems.filter(item => item.type === 'extra')}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  }/>
                  <Route path="/bollitos" element={<BollitosPage selectedBollitos={cartItems.filter(item => item.type === 'bollito').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})} onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito')} />} />
                  <Route path="/pulguitas" element={<PulguitasPage selectedPulguitas={cartItems.filter(item => item.type === 'pulguita').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})} onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita')} />} />
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
        <ShoppingCart isOpen={showCart} onClose={() => setShowCart(false)} cartItems={cartItems} onUpdateQuantity={handleUpdateCartItem} onRemoveItem={handleRemoveCartItem} />
      </div>
    </Router>
  );
};

export default App;
