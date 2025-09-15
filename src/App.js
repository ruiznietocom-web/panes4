import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header.js';
import Navigation from './components/Navigation.js';
import HarinaSelector from './components/HarinaSelector.js';
import ExtrasSelector from './components/ExtrasSelector.js';
import OrderSummary from './components/OrderSummary.js';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedHarinas, setSelectedHarinas] = useState([]);

  const handleToggleHarina = (harina) => {
    setSelectedHarinas((prev) => {
      if (prev.some((h) => h.id === harina.id)) {
        return prev.filter((h) => h.id !== harina.id);
      }
      return [...prev, harina];
    });
  };

  const handleAddPan = (nuevoPan) => {
    setCartItems((prev) => [...prev, nuevoPan]);
    setSelectedHarinas([]); // Reset selección al añadir
  };

  const handleToggleExtra = (extra) => {
    setCartItems((prev) => {
      if (prev.some((item) => item.id === extra.id && item.type === "extra")) {
        return prev.filter((item) => !(item.id === extra.id && item.type === "extra"));
      }
      return [...prev, { ...extra, type: "extra", quantity: 1 }];
    });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Navigation />
        <motion.main 
          className="max-w-5xl mx-auto p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HarinaSelector 
                    selectedHarinas={selectedHarinas}
                    onToggleHarina={handleToggleHarina}
                    onAddPan={handleAddPan}
                  />
                  <ExtrasSelector 
                    selectedExtras={cartItems.filter(item => item.type === 'extra')}
                    onToggleExtra={handleToggleExtra}
                  />
                  <OrderSummary cartItems={cartItems} setCartItems={setCartItems} />
                </>
              }
            />
            <Route path="/success" element={<Success />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
