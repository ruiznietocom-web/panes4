import React from 'react'; 
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { harinas, bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const optionalExtras = [
    { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
    { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
    { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
  ];

  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev => 
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  // Filtrados por tipo
  const pansPersonalizados = cartItems.filter(item => item.type === 'panPersonalizado');
  const extrasInCart = cartItems.filter(item => item.type === 'extra');
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');

  const calculateTotal = () => {
    let total = 0;
    // each pan: basePrice + sum(extras)
    pansPersonalizados.forEach(p => {
      const extrasSum = (p.extras || []).reduce((s, e) => s + (e.price || 0), 0);
      total += (p.basePrice || p.price || 0) + extrasSum;
    });
    extrasInCart.forEach(e => total += e.price);
    bollitosInCart.forEach(item => {
      const b = bollitos.find(b => b.id === item.id);
      if (b) total += b.price * item.quantity;
    });
    pulguitasInCart.forEach(item => {
      const p = pulguitas.find(p => p.id === item.id);
      if (p) total += p.price * item.quantity;
    });
    selectedOptionalExtras.forEach(id => {
      const e = optionalExtras.find(opt => opt.id === id);
      if (e) total += e.price;
    });
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let message = `*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n`;

    // Panes personalizados
    if (pansPersonalizados.length > 0) {
      message += `\n*PANES PERSONALIZADOS:*\n`;
      pansPersonalizados.forEach((pan, index) => {
        message += `Pan ${index + 1}:\n`;
        pan.harinas.forEach(h => {
          message += `• ${h.icon ? h.icon + ' ' : ''}${h.name}\n`;
        });
        if (pan.extras && pan.extras.length > 0) {
          message += `Extras:\n`;
          pan.extras.forEach(ex => {
            message += `• ${ex.icon ? ex.icon + ' ' : ''}${ex.name} - ${formatPrice(ex.price)}\n`;
          });
        }
        const panTotal = (pan.basePrice || pan.price || 0) + (pan.extras || []).reduce((s, e) => s + (e.price || 0), 0);
        message += `Precio Pan ${index + 1}: ${formatPrice(panTotal)}\n`;
      });
    }

    // Extras globales
    if (extrasInCart.length > 0) {
      message += `\n*EXTRAS AÑADIDOS:*\n`;
      extrasInCart.forEach(extra => {
        message += `• ${extra.icon ? extra.icon + ' ' : ''}${extra.name} - ${formatPrice(extra.price)}\n`;
      });
    }

    // Bollitos
    if (bollitosInCart.length > 0) {
      message += `\n*BOLLITOS:*\n`;
      bollitosInCart.forEach(item => {
        const b = bollitos.find(b => b.id === item.id);
        if (b) message += `• ${b.image ? b.image + ' ' : ''}${b.name} x${item.quantity} - ${formatPrice(b.price * item.quantity)}\n`;
      });
    }

    // Pulguitas
    if (pulguitasInCart.length > 0) {
      message += `\n*PULGUITAS:*\n`;
      pulguitasInCart.forEach(item => {
        const p = pulguitas.find(p => p.id === item.id);
        if (p) message += `• ${p.image ? p.image + ' ' : ''}${p.name} x${item.quantity} - ${formatPrice(p.price * item.quantity)}\n`;
      });
    }

    // Extras opcionales "Manuel..."
    if (selectedOptionalExtras.length > 0) {
      message += `\n*MANUEL, QUÉ RICO TU PAN!...:*\n`;
      selectedOptionalExtras.forEach(id => {
        const e = optionalExtras.find(opt => opt.id === id);
        if (e) message += `• ${e.icon ? e.icon + ' ' : ''}${e.name} - ${formatPrice(e.price)}\n`;
      });
    }

    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n`;
    message += `🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n\n`;
    message += `🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. MUCHAS GRACIAS!!.\n`;
    return encodeURIComponent(message);
  };

  const handleSendWhatsApp = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = "627526380"; 
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    onSendWhatsApp();
  };

  const isOrderEmpty = cartItems.length === 0;

  return (
    <motion.div 
      className="bg-white rounded-2xl p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6" /> Resumen del Pedido
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {isOrderEmpty && (
          <div className="text-center py-4 text-gray-500">
            Tu carrito está vacío. ¡Añade algo delicioso!
          </div>
        )}

        {/* Panes Personalizados */}
        {pansPersonalizados.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Panes Personalizados:</h3>
            {pansPersonalizados.map((pan, index) => (
              <div key={pan.id} className="flex flex-col p-2 bg-amber-50 rounded-lg">
                <span className="font-bold">Pan {index + 1}:</span>
                {pan.harinas.map(h => <span key={h.id}>• {h.icon ? h.icon + ' ' : '🌾 '}{h.name}</span>)}
                {pan.extras && pan.extras.length > 0 && (
                  <div className="mt-1 ml-4">
                    <strong>Extras:</strong>
                    {pan.extras.map(ex => <div key={ex.id}>• {ex.icon ? ex.icon + ' ' : ''}{ex.name} - {formatPrice(ex.price)}</div>)}
                  </div>
                )}
                <span className="mt-1 font-bold">Precio: {formatPrice((pan.basePrice || pan.price || 0) + (pan.extras || []).reduce((s,e)=> s + (e.price||0), 0))}</span>
              </div>
            ))}
          </div>
        )}

        {/* Extras globales */}
        {extrasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Extras:</h3>
            {extrasInCart.map(extra => (
              <div key={extra.id} className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">{extra.icon ? extra.icon + ' ' : ''}{extra.name}</span>
                <span>{formatPrice(extra.price)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Bollitos */}
        {bollitosInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Bollitos:</h3>
            {bollitosInCart.map(item => {
              const b = bollitos.find(b => b.id === item.id);
              return b && (
                <div key={b.id} className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="flex items-center gap-2">{b.image ? b.image + ' ' : ''}{b.name} x{item.quantity}</span>
                  <span>{formatPrice(b.price * item.quantity)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Pulguitas */}
        {pulguitasInCart.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-700">Pulguitas:</h3>
            {pulguitasInCart.map(item => {
              const p = pulguitas.find(p => p.id === item.id);
              return p && (
                <div key={p.id} className="flex justify-between items-center p-2 bg-purple-50 rounded-lg">
                  <span className="flex items-center gap-2">{p.image ? p.image + ' ' :
