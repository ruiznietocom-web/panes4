import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { bollitos, pulguitas } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

const optionalExtras = [
  { id: 'propina', name: 'Toma una Propina!', price: 0.50, icon: '💰' },
  { id: 'cafe', name: 'Toma para un Café!', price: 1.00, icon: '☕' },
  { id: 'cerveza', name: 'Tómate una Cerveza a mi Salud!', price: 1.50, icon: '🍺' },
];

const OrderSummary = ({ cartItems, onSendWhatsApp }) => {
  const [selectedOptionalExtras, setSelectedOptionalExtras] = React.useState([]);

  const toggleOptionalExtra = (extra) => {
    setSelectedOptionalExtras(prev =>
      prev.includes(extra.id) ? prev.filter(id => id !== extra.id) : [...prev, extra.id]
    );
  };

  const panes = cartItems.filter(i => i.type==='panPersonalizado');
  const extras = cartItems.filter(i => i.type==='extra');
  const boll = cartItems.filter(i => i.type==='bollito');
  const pulg = cartItems.filter(i => i.type==='pulguita');

  const calculateTotal = () => {
    let total=0;
    panes.forEach(p=>total+=p.price*p.quantity);
    extras.forEach(e=>total+=e.price);
    boll.forEach(bi=>{ const b = bollitos.find(b=>b.id===bi.id); if(b) total+=b.price*bi.quantity; });
    pulg.forEach(pi=>{ const p = pulguitas.find(p=>p.id===pi.id); if(p) total+=p.price*pi.quantity; });
    selectedOptionalExtras.forEach(id=>{ const e = optionalExtras.find(opt=>opt.id===id); if(e) total+=e.price; });
    return total.toFixed(2);
  };

  const generateWhatsAppMessage = () => {
    let msg = '*NUEVO PEDIDO - PanZen*\n\n*RESUMEN DE TU PEDIDO:*\n';
    panes.forEach(pan=>{
      msg += `\n*PAN PERSONALIZADO (${pan.corte}):*\n`;
      pan.harinas.forEach(h=>msg += `• ${h.icon? h.icon+' ':''}${h.name}\n`);
      msg += `Precio: ${formatPrice(pan.price)}\n`;
    });
    if(extras.length>0){ msg+='\n*EXTRAS:*\n'; extras.forEach(e=>msg+=`• ${e.icon? e.icon+' ':''}${e.name} - ${formatPrice(e.price)}\n`);}
    if(boll.length>0){ msg+='\n*BOLLITOS:*\n'; boll.forEach(item=>{ const b=bollitos.find(b=>b.id===item.id); if(b) msg+=`• ${b.image?b.image+' ':''}${b.name} x${item.quantity} - ${formatPrice(b.price*item.quantity)}\n`;});}
    if(pulg.length>0){ msg+='\n*PULGUITAS:*\n'; pulg.forEach(item=>{ const p=pulguitas.find(p=>p.id===item.id); if(p) msg+=`• ${p.image?p.image+' ':''}${p.name} x${item.quantity} - ${formatPrice(p.price*item.quantity)}\n`;});}
    if(selectedOptionalExtras.length>0){ msg+='\n*MANUEL, QUÉ RICO TU PAN!...:*\n'; selectedOptionalExtras.forEach(id=>{ const e = optionalExtras.find(opt=>opt.id===id); if(e) msg+=`• ${e.icon?e.icon+' ':''}${e.name} - ${formatPrice(e.price)}\n`;}); }
    msg += `\n*TOTAL: ${formatPrice(calculateTotal())}*\n\n🚚 Entrega a domicilio en *Chiclana* *GRATUITA!* 🎉\n🙏 EN CUANTO PUEDA CONTACTO CONTIGO Y TE CONFIRMO EL DÍA DE ENTREGA. ¡MUCHAS GRACIAS!\n`;
    return encodeURIComponent(msg);
  };

  const handleSendWhatsApp = () => { window.open(`https://wa.me/627526380?text=${generateWhatsAppMessage()}`,'_blank'); onSendWhatsApp(); };
  const isEmpty = cartItems.length===0;

  return (
    <motion.div className="bg-white rounded-2xl p-6 shadow-lg" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><ShoppingCart className="w-6 h-6"/>Resumen del Pedido</h2>

      {isEmpty && <p className="text-gray-500 text-center">Tu carrito está vacío.</p>}

      {panes.map((p)=>(
        <div key={p.cartId} className="mb-2 p-2 bg-amber-50 rounded-lg">
          <strong>Pan ({p.corte}):</strong>
          <ul className="ml-4">{p.harinas.map(h=><li key={h.id}>{h.icon? h.icon+' ':''}{h.name}</li>)}</ul>
          <p>Precio: {formatPrice(p.price)}</p>
        </div>
      ))}

      {extras.length>0 && <div className="mb-2"><strong>Extras:</strong><ul className="ml-4">{extras.map(e=><li key={e.cartId}>{e.icon? e.icon+' ':''}{e.name} - {formatPrice(e.price)}</li>)}</ul></div>}
      {boll.length>0 && <div className="mb-2"><strong>Bollitos:</strong><ul className="ml-4">{boll.map(bi=>{ const b=bollitos.find(b=>b.id===bi.id); return b?<li key={bi.cartId}>{b.image?b.image+' ':''}{b.name} x{bi.quantity} - {formatPrice(b.price*bi.quantity)}</li>:null;})}</ul></div>}
      {pulg.length>0 && <div className="mb-2"><strong>Pulguitas:</strong><ul className="ml-4">{pulg.map(pi=>{ const p=pulguitas.find(p=>p.id===pi.id); return p?<li key={pi.cartId}>{p.image?p.image+' ':''}{p.name} x{pi.quantity} - {formatPrice(p.price*pi.quantity)}</li>:null;})}</ul></div>}

      {optionalExtras.length>0 && <div className="mb-2"><strong>Manuel, qué rico tu pan!...:</strong><ul className="ml-4">{selectedOptionalExtras.map(id=>{ const e = optionalExtras.find(opt=>opt.id===id); return e?<li key={e.id}>{e.icon?e.icon+' ':''}{e.name} - {formatPrice(e.price)}</li>:null;})}</ul></div>}

      <div className="border-t pt-3 mt-3 flex justify-between items-center text-xl font-bold">
        <span>Total:</span>
        <span>{formatPrice(calculateTotal())}</span>
      </div>

      <button onClick={handleSendWhatsApp} disabled={isEmpty} className={`w-full mt-4 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl ${isEmpty?'opacity-50 cursor-not-allowed':''}`}>
        <MessageCircle className="w-6 h-6"/> Enviar Pedido por WhatsApp
      </button>
    </motion.div>
  );
};

export default OrderSummary;
