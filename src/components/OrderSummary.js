import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';

const OrderSummary = ({ selectedHarinas, selectedExtras, selectedBollitos, selectedPulguitas, onSendWhatsApp }) => {
  const calculateTotal = () => {
    let total = 0;

    // 🔹 Precio fijo de las harinas: 5.50 €
    if (selectedHarinas.length > 0) {
      total += 5.5;
    }

    // Extras
    selectedExtras.forEach(extra => {
      total += extra.price;
    });

    // Bollitos
    Object.entries(selectedBollitos).forEach(([id, quantity]) => {
      const bollito = bollitos.find(b => b.id === parseInt(id));
      if (bollito) total += bollito.price * quantity;
    });

    // Pulguitas
    Object.entries(selectedPulguitas).forEach(([id, quantity]) => {
      const pulguita = pulguitas.find(p => p.id === parseInt(id));
      if (pulguita) total += pulguita.price * quantity;
    });

    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `🍞 *HOLA MANUEL!!, TIENES UN NUEVO PEDIDO* 🍞\n\n`;
    message += `📋 *Resumen del Pedido:*\n`;

    if (selectedHarinas.length > 0) {
      message += `\n🍞 *PAN ECO:*\n`;
      selectedHarinas.forEach(harina => {
        message += `• Harina: ${harina.name}\n`;
      });
      message += `Precio total harinas: $5.50\n`;
    }
    
    if (selectedExtras.length > 0) {
      message += `\n🌟 *Extras añadidos:*\n`;
      selectedExtras.forEach(extra => {
        message += `• ${extra.name} - $${extra.price}\n`;
      });
    }

    const hasBollitos = Object.values(selectedBollitos).some(q => q > 0);
    if (hasBollitos) {
      message += `\n🥐 *BOLLITOS:*\n`;
      Object.entries(selectedBollitos).forEach(([id, quantity]) => {
        if (quantity > 0) {
          const bollito = bollitos.find(b => b.id === parseInt(id));
          if (bollito) message += `• ${bollito.name} x${quantity} - $${(bollito.price * quantity).toFixed(2)}\n`;
        }
      });
    }

    const hasPulguitas = Object.values(selectedPulguitas).some(q => q > 0);
    if (hasPulguitas) {
      message += `\n🥪 *PULGUITAS:*\n`;
      Object.entries(selectedPulguitas).forEach(([id, quantity]) => {
        if (quantity > 0) {
          const pulguita = pulguitas.find(p => p.id === parseInt(id));
          if (pulguita) message += `• ${pulguita.name} x${quantity} - $${(pulguita.price * quantity).toFixed(2)}\n`;
        }
      });
    }
    
    message += `\n💰 *Total: $${calculateTotal()}*\n\n`;
    message += `🚗 CONFIRMAME LO ANTES QUE PUEDAS LA HORA DE ENTREGA.\n🚗`;
    message += `¡GRACIAS! 🙏`;
    
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380"; // Cambia por tu número de WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = selectedHarinas.length === 0 && selectedExtras.length === 0 && 
                       Object.values(selectedBollitos).every(q => q === 0) && 
                       Object.values(selectedPulguitas).every(q => q === 0);

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
        <ShoppingCart className="w-6 h-6" />
        Resumen del Pedido
      </h2>
      
      <div className="space-y-3 mb-6">
        {selectedHarinas.length > 0 && (
          <>
            <h3 className="font-semibold text-gray-700">Pan Personalizado:</h3>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <div>
                <span className="font-semibold text-gray-800">
                  {selectedHarinas.map(h => h.name).join(", ")}
                </span>
              </div>
              <span className="font-bold text-amber-600">$5.50</span>
            </div>
          </>
        )}
        
        {selectedExtras.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {selectedExtras.map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="text-gray-800 flex items-center gap-2">
                  <span>{extra.icon}</span>
                  {extra.name}
                </span>
                <span className="font-semibold text-green-600">+${extra.price}</span>
              </div>
            ))}
          </div>
        )}

        {Object.values(selectedBollitos).some(q => q > 0) && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {Object.entries(selectedBollitos).map(([id, quantity]) => {
              if (quantity > 0) {
                const bollito = bollitos.find(b => b.id === parseInt(id));
                return bollito && (
                  <div key={bollito.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-gray-800 flex items-center gap-2">
                      <span>{bollito.image}</span>
                      {bollito.name} x{quantity}
                    </span>
                    <span className="font-semibold text-blue-600">${(bollito.price * quantity).toFixed(2)}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {Object.values(selectedPulguitas).some(q => q > 0) && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {Object.entries(selectedPulguitas).map(([id, quantity]) => {
              if (quantity > 0) {
                const pulguita = pulguitas.find(p => p.id === parseInt(id));
                return pulguita && (
                  <div key={pulguita.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                    <span className="text-gray-800 flex items-center gap-2">
                      <span>{pulguita.image}</span>
                      {pulguita.name} x{quantity}
                    </span>
                    <span className="font-semibold text-purple-600">${(pulguita.price * quantity).toFixed(2)}</span>
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
        
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            <p>Tu pedido está vacío. ¡Añade algo delicioso!</p>
          </div>
        )}

        <div className="border-t pt-3">
          <div className="flex justify-between items-center text-xl font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-amber-600">${calculateTotal()}</span>
          </div>
        </div>
      </div>
      
      <motion.button
        onClick={handleSendWhatsApp}
        disabled={isOrderEmpty}
        className={`w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 ${isOrderEmpty ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.01]'}`}
        whileHover={isOrderEmpty ? {} : { scale: 1.02 }}
        whileTap={isOrderEmpty ? {} : { scale: 0.98 }}
      >
        <MessageCircle className="w-6 h-6" />
        Enviar Pedido por WhatsApp
      </motion.button>
    </motion.div>
  );
};

export default OrderSummary;
