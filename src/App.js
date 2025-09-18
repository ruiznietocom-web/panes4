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
import PanExtrasModal from './components/PanExtrasModal';
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

  // Modal state for adding extras per-pan
  const [pendingPan, setPendingPan] = useState(null); // pan object waiting for extras
  const [isPanExtrasOpen, setIsPanExtrasOpen] = useState(false);

  // per-pan extras options (you can move these to data/products if you want)
  const perPanExtrasOptions = [
    { id: 'mix-semillas', name: 'Mix Semillas Eco', price: 0.7, icon: '🌱' },
    { id: 'nueces', name: 'Nueces', price: 0.7, icon: '🥜' },
    { id: 'ciruelas', name: 'Ciruelas Pasas', price: 0.7, icon: '🍑' },
    { id: 'tomate-oregano', name: 'Tomate y orégano', price: 2.0, icon: '🍅' },
  ];

  // Helper to get product by id/type (used for bollitos/pulguitas/extras existing flows)
  const getProductDetails = (id, type) => {
    switch (type) {
      case 'extra': return extras.find(p => p.id === id);
      case 'bollito': return bollitos.find(p => p.id === id);
      case 'pulguita': return pulguitas.find(p => p.id === id);
      case 'otroPan': return otrosPanes.find(p => p.id === id);
      default: return null;
    }
  };

  // ---------- PAN PERSONALIZADO FLOW ----------
  // Called by HarinaSelector when user presses "Añadir Pan Personalizado"
  const handleAddPanPersonalizado = (pan) => {
    // pan has: id, type: 'panPersonalizado', harinas[], basePrice (here property is price), quantity
    // We'll store basePrice separately for safer calculation
    const panToAdd = {
      ...pan,
      basePrice: pan.price,
      price: pan.price, // current price (will be updated after extras selection)
      extras: [], // will be filled by modal
    };

    setCartItems(prev => [...prev, panToAdd]);
    setPendingPan(panToAdd);
    setIsPanExtrasOpen(true);
  };

  // Confirm extras selection for the pending pan
  const handleConfirmPanExtras = (panId, selectedExtras) => {
    setCartItems(prev => prev.map(item => {
      if (item.id !== panId || item.type !== 'panPersonalizado') return item;
      const extrasArr = selectedExtras || [];
      const extrasSum = extrasArr.reduce((s, e) => s + (e.price || 0), 0);
      const newPrice = (item.basePrice || 0) + extrasSum;
      return {
        ...item,
        extras: extrasArr,
        price: newPrice,
      };
    }));
    setPendingPan(null);
    setIsPanExtrasOpen(false);
  };

  // If user cancels extras selection, we simply leave extras empty (pan with base price remains)
  const handleCancelPanExtras = () => {
    setPendingPan(null);
    setIsPanExtrasOpen(false);
  };

  // ---------- GLOBAL ITEMS (bollitos / pulguitas / extras) ----------
  // Toggle global extras (the small extras like propina/cafe/cerveza you had as items)
  const handleToggleExtra = (extra) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === extra.id && item.type === 'extra');
      if (existing) return prevItems.filter(item => !(item.id === extra.id && item.type === 'extra'));
      return [...prevItems, { id: extra.id, quantity: 1, type: 'extra', name: extra.name, price: extra.price, icon: extra.icon }];
    });
  };

  // Update quantities for bollitos/pulguitas/otrosPanes (and remove if qty 0)
  const handleUpdateCartItem = (id, quantity, type) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === id && item.type === type);
      const newQuantity = Math.max(0, quantity);

      if (newQuantity === 0) {
        // remove
        return prevItems.filter(item => !(item.id === id && item.type === type));
      }
      if (existingIndex > -1) {
        return prevItems.map((it, idx) => idx === existingIndex ? { ...it, quantity: newQuantity } : it);
      }

      // if not found and we have product details, add it
      const product = getProductDetails(id, type);
      if (product) {
        return [...prevItems, { id, quantity: newQuantity, type, name: product.name, price: product.price, image: product.image, icon: product.icon }];
      }

      return prevItems;
    });
  };

  const handleRemoveCartItem = (id, type) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === id && item.type === type)));
  };

  // ---------- SEND WHATSAPP / MODAL ----------
  const handleSendWhatsApp = () => { setShowSuccessModal(true); setShowCart(false); };
  const handleCloseModal = () => { setShowSuccessModal(false); setCartItems([]); };

  const cartItemCount = cartItems.reduce((count, item) => count + (item.quantity || 0), 0);

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
                      <HarinaSelector onAddPan={handleAddPanPersonalizado} />
                      <ExtrasSelector
                        selectedExtras={cartItems.filter(item => item.type === 'extra')}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  } />
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

        {/* Pan extras modal */}
        {isPanExtrasOpen && pendingPan && (
          <PanExtrasModal
            isOpen={isPanExtrasOpen}
            pan={pendingPan}
            extrasOptions={perPanExtrasOptions}
            onCancel={handleCancelPanExtras}
            onConfirm={handleConfirmPanExtras}
          />
        )}
      </div>
    </Router>
  );
};

export default App;
