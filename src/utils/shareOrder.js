import { toast } from 'react-hot-toast';

export const shareCustomBread = ({ flours = [], corte = null, extras = [] }) => {
  const flourNames = flours
    .filter(h => h.price > 0)
    .map(h => h.name.replace(' Integral Ecológico', ''))
    .join(' + ');

  const corteName = corte?.name ? corte.name.replace(' (gratuito)', '') : 'Sin cortar (Entero)';
  const extrasNames = extras.length > 0
    ? extras.map(e => `${e.icon || ''} ${e.name}`).join(', ')
    : 'Ninguno';

  const text = `🥖 *¡Mira el pan artesano que he creado en PanZen Obrador!*

🌾 *Harinas ecológicas:* ${flourNames || 'Trigo Integral'}
🔪 *Corte:* ${corteName}
🥜 *Extras:* ${extrasNames}

✨ Puedes diseñar el tuyo o hacer tu pedido con reparto gratis en Chiclana aquí:
👉 https://panespersonalizados.netlify.app/`;

  if (navigator.share) {
    navigator.share({
      title: 'Mi Pan Personalizado en PanZen',
      text: text,
      url: 'https://panespersonalizados.netlify.app/'
    }).catch(() => {});
  } else {
    // Copiar al portapapeles
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success('¡Receta copiada al portapapeles para compartir! 📋✨', {
        duration: 3500,
        position: 'top-center',
        style: {
          background: '#B8860B',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '16px'
        }
      });
    }
  }
};
