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
import Success from './components/Success';
import { harinas, extras, bollitos, pulguitas, otrosPanes } from './data/products';

// Scroll automático al cambiar de ruta
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

  // Obtener info de productos
  const getProductDetails = (id, type) => {
    switch (type) {
      case 'harina': return harinas.find(p => p.id === id);
      case 'extra': return extras.find(p => p.id === id);
      case 'bollito': return bollitos.find(p => p.id === id);
      case 'pulguita': return pulguitas.find(p => p.id === id);
      case 'panPersonalizado': return null; // Precio fijo
      default: return null;
    }
  };

  // Actualizar carrito
  const handleUpdateCartItem = (id, quantity, type, extraData = null) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === id && item.type === type);
      const newQty = Math.max(0, quantity);

      if (newQty === 0) return prev.filter(item => !(item.id === id && item.type === type));

      if (existingIndex > -1) {
        return prev.map((item, i) => i === existingIndex ? { ...item, quantity: newQty } : item);
      }

      return [
        ...prev,
        {
          id,
          type,
          quantity: newQty,
          name: extraData ? extraData.name : '',
          price: extraData ? extraData.price : 0,
          image: extraData ? extraData.image : null,
          icon: extraData ? extraData.icon : null,
          harinas: extraData?.harinas || null,
        }
      ];
    });
  };

  const handleRemoveCartItem = (id, type) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
  };

  const handleToggleHarina = (harina) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === harina.id && item.type === 'harina');
      if (existing) return prev.filter(item => !(item.id === harina.id && item.type === 'harina'));
      return [...prev, { id: harina.id, type: 'harina', quantity: 1, name: harina.name, price: harina.price, image: harina.image, icon: harina.icon }];
    });
  };

  const handleToggleExtra = (extra) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === extra.id && item.type === 'extra');
      if (existing) return prev.filter(item => !(item.id === extra.id && item.type === 'extra'));
      return [...prev, { id: extra.id, type: 'extra', quantity: 1, name: extra.name, price: extra.price, icon: extra.icon }];
    });
  };

  const handleAddPanPersonalizado = (pan) => {
    handleUpdateCartItem(pan.id, pan.quantity, 'panPersonalizado', pan);
  };

  const handleSendWhatsApp = () => {
    setShowSuccessModal(true);
    setShowCart(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCartItems([]);
  };

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
                        onToggleHarina={handleToggleHarina}
                        onAddPan={handleAddPanPersonalizado}
                      />
                      <ExtrasSelector
                        selectedExtras={cartItems.filter(item => item.type === 'extra')}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  } />
                  <Route path="/bollitos" element={
                    <BollitosPage
                      selectedBollitos={cartItems.filter(item => item.type === 'bollito').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                      onUpdateBollitoQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'bollito', bollitos.find(b => b.id === id))}
                    />
                  } />
                  <Route path="/pulguitas" element={
                    <PulguitasPage
                      selectedPulguitas={cartItems.filter(item => item.type === 'pulguita').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                      onUpdatePulguitaQuantity={(id, qty) => handleUpdateCartItem(id, qty, 'pulguita', pulguitas.find(p => p.id === id))}
                    />
                  } />
                  <Route path="/informacion" element={<InformacionPage />} />
                  <Route path="/success" element={<Success />} />
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
