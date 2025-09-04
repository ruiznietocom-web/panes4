import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HarinaSelector from './components/HarinaSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import SuccessModal from './components/SuccessModal';
import BollitosPage from './pages/BollitosPage';
import PulguitasPage from './pages/PulguitasPage';
import ShoppingCart from './components/ShoppingCart';
import { harinas, extras, bollitos, pulguitas, otrosPanes } from './data/products';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

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

  const handleUpdateCartItem = (id, quantity, type) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === id && item.type === type);
      const newQuantity = Math.max(0, quantity);

      if (newQuantity === 0) {
        return prevItems.filter(item => !(item.id === id && item.type === type));
      } else if (existingItemIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: newQuantity } : item
        );
      } else {
        const product = getProductDetails(id, type);
        if (product) {
          return [...prevItems, { id, quantity: newQuantity, type, name: product.name, price: product.price, image: product.image, icon: product.icon }];
        }
        return prevItems;
      }
    });
  };

  const handleToggleHarina = (harina) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === harina.id && item.type === 'harina');
      if (existingItem) {
        return prevItems.filter(item => !(item.id === harina.id && item.type === 'harina'));
      } else {
        return [...prevItems, { id: harina.id, quantity: 1, type: 'harina', name: harina.name, price: harina.price, image: harina.image }];
      }
    });
  };

  const handleToggleExtra = (extra) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === extra.id && item.type === 'extra');
      if (existingItem) {
        return prevItems.filter(item => !(item.id === extra.id && item.type === 'extra'));
      } else {
        return [...prevItems, { id: extra.id, quantity: 1, type: 'extra', name: extra.name, price: extra.price, icon: extra.icon }];
      }
    });
  };

  const handleUpdateBollitoQuantity = (id, quantity) => {
    handleUpdateCartItem(id, quantity, 'bollito');
  };

  const handleUpdatePulguitaQuantity = (id, quantity) => {
    handleUpdateCartItem(id, quantity, 'pulguita');
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header cartItemCount={cartItemCount} onOpenCart={() => setShowCart(true)} />
        <Navigation />
        
        <div className="max-w-6xl mx-auto p-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Routes>
                  <Route path="/" element={
                    <>
                      <HarinaSelector 
                        selectedHarinas={cartItems.filter(item => item.type === 'harina')}
                        onToggleHarina={handleToggleHarina}
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
                      onUpdateBollitoQuantity={handleUpdateBollitoQuantity}
                    />
                  } />
                  <Route path="/pulguitas" element={
                    <PulguitasPage 
                      selectedPulguitas={cartItems.filter(item => item.type === 'pulguita').reduce((acc, item) => ({ ...acc, [item.id]: item.quantity }), {})}
                      onUpdatePulguitaQuantity={handleUpdatePulguitaQuantity}
                    />
                  } />
                </Routes>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <OrderSummary 
                    cartItems={cartItems}
                    onSendWhatsApp={handleSendWhatsApp}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <SuccessModal 
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
        />

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
