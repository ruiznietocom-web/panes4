import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HarinaSelector from './components/HarinaSelector';
import ExtrasSelector from './components/ExtrasSelector';
import OrderSummary from './components/OrderSummary';
import SuccessModal from './components/SuccessModal';
import InformacionPage from './pages/InformacionPage';
import ShoppingCart from './components/ShoppingCart';
import { harinas, extras, bollitos, pulguitas } from './data/products';

// ScrollToTop
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }), [pathname]);
  return null;
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Actualizar cantidad de un item
  const handleUpdateCartItem = (cartId, quantity) => {
    setCartItems(prev =>
      prev.map(item =>
        item.cartId === cartId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Añadir pan personalizado
  const handleAddCustomPan = (harinasSeleccionadas, corte) => {
    if (harinasSeleccionadas.length === 0 || !corte) return;

    const newPan = {
      cartId: Date.now(),
      type: 'panPersonalizado',
      harinas: harinasSeleccionadas,
      corte,
      price: 5.50,
      quantity: 1,
    };

    setCartItems(prev => [...prev, newPan]);
  };

  // Añadir extras, bollitos y pulguitas
  const handleAddItem = (item, type) => {
    const exists = cartItems.find(i => i.type === type && i.id === item.id);
    if (exists) {
      handleUpdateCartItem(exists.cartId, exists.quantity + 1);
    } else {
      setCartItems(prev => [...prev, { ...item, type, cartId: Date.now(), quantity: 1 }]);
    }
  };

  const handleSendWhatsApp = () => setShowSuccessModal(true);
  const handleCloseModal = () => { setShowSuccessModal(false); setCartItems([]); };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
                      <HarinaSelector onAddPan={handleAddCustomPan} />
                      <ExtrasSelector
                        selectedExtras={cartItems.filter(i => i.type === 'extra')}
                        onToggleExtra={extra => handleAddItem(extra, 'extra')}
                      />
                    </>
                  }/>
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
