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

const App = () => {
  const [selectedPanes, setSelectedPanes] = useState([
    { id: Date.now(), harinas: [] }
  ]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [selectedBollitos, setSelectedBollitos] = useState({});
  const [selectedPulguitas, setSelectedPulguitas] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 🔹 Manejar selección de harinas por pan
  const handleToggleHarina = (panId, harina) => {
    setSelectedPanes(prev =>
      prev.map(pan => {
        if (pan.id === panId) {
          const isSelected = pan.harinas.some(h => h.id === harina.id);
          return {
            ...pan,
            harinas: isSelected
              ? pan.harinas.filter(h => h.id !== harina.id)
              : [...pan.harinas, harina]
          };
        }
        return pan;
      })
    );
  };

  // 🔹 Agregar nuevo pan vacío
  const handleAgregarPan = () => {
    setSelectedPanes(prev => [...prev, { id: Date.now(), harinas: [] }]);
  };

  const handleToggleExtra = (extra) => {
    setSelectedExtras(prev => {
      const isSelected = prev.some(item => item.id === extra.id);
      if (isSelected) {
        return prev.filter(item => item.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleUpdateBollitoQuantity = (id, quantity) => {
    setSelectedBollitos(prev => {
      const newQuantity = Math.max(0, quantity);
      if (newQuantity === 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleUpdatePulguitaQuantity = (id, quantity) => {
    setSelectedPulguitas(prev => {
      const newQuantity = Math.max(0, quantity);
      if (newQuantity === 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleSendWhatsApp = () => {
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setSelectedPanes([{ id: Date.now(), harinas: [] }]);
    setSelectedExtras([]);
    setSelectedBollitos({});
    setSelectedPulguitas({});
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <Header />
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
                      {selectedPanes.map((pan) => (
                        <HarinaSelector 
                          key={pan.id}
                          panId={pan.id}
                          selectedHarinas={pan.harinas}
                          onToggleHarina={handleToggleHarina}
                          onAgregarPan={handleAgregarPan}
                        />
                      ))}
                      <ExtrasSelector 
                        selectedExtras={selectedExtras}
                        onToggleExtra={handleToggleExtra}
                      />
                    </>
                  } />
                  <Route path="/bollitos" element={
                    <BollitosPage 
                      selectedBollitos={selectedBollitos}
                      onUpdateBollitoQuantity={handleUpdateBollitoQuantity}
                    />
                  } />
                  <Route path="/pulguitas" element={
                    <PulguitasPage 
                      selectedPulguitas={selectedPulguitas}
                      onUpdatePulguitaQuantity={handleUpdatePulguitaQuantity}
                    />
                  } />
                </Routes>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <OrderSummary 
                    selectedPanes={selectedPanes}
                    selectedExtras={selectedExtras}
                    selectedBollitos={selectedBollitos}
                    selectedPulguitas={selectedPulguitas}
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
      </div>
    </Router>
  );
};

export default App;
