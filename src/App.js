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
import { harinas, extras, bollitos, pulguitas } from './data/products';

// ScrollToTop
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

  // Obtener producto por id y tipo
  const getProductDetails = (id, type) => {
    switch (type) {
      case 'harina': return harinas.find(p => p.id === id);
      case 'extra': return extras.find(p => p.id === id);
      case 'bollito': return bollitos.find(p => p.id === id);
      case 'pulguita': return pulguitas.find(p => p.id === id);
      default: return null;
    }
  };

  // Actualizar cantidad
  const handleUpdateCartItem = (id, quantity, type) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.cartId === id && item.type === type);
      const newQuantity = Math.max(0, quantity);

      if (newQuantity === 0) return prevItems.filter(item => !(item.cartId === id && item.type === type));

      if (existingIndex > -1) return prevItems.map((item, index) =>
        index === existingIndex ? { ...item, quantity: newQuantity } : item
      );

      return prevItems;
    });
  };

  // Eliminar item
  const handleRemoveCartItem = (id, type) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.cartId === id && item.type === type)));
  };

  // Añadir harina / otro pan
  const handleAddHarina = (harina, corte) => {
    const cartId = Date.now() + Math.random(); // ID único por pan
    setCartItems(prevItems => [
      ...prevItems,
      {
        cartId,
        id: harina.id,
        type: 'harina',
        name: harina.name,
        corte,
        price: 5.50,
        icon: harina.icon || '🌾',
        quantity: 1
      }
    ]);
  };

  // Añadir extra
  const handleToggleExtra = (extra) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === extra.id && item.type === 'extra');
      if (existing) return prevItems.filter(item => !(item.id === extra.id && item.type === 'extra'));
      return [...prevItems, { id: extra.id, type: 'extra', name: extra.name, price: extra.price, icon: extra.icon, quantity: 1 }];
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
                        selectedHarinas={cartItems.filter(item => item.type === 'harina')}
                        onAddHarina={handleAddHarina}
                      />
                      <ExtrasSelector 
                        selectedExtras={cartItems.filter(item => item.type === 'extra')}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  } />
                  <Route path="/bollitos" element={<BollitosPage selectedBollitos={cartItems.filter(item => item.type === 'bollito')} onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito')} />} />
                  <Route path="/pulguitas" element={<PulguitasPage selectedPulguitas={cartItems.filter(item => item.type === 'pulguita')} onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita')} />} />
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
