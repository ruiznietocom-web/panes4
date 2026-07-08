import React from 'react';
import { useTranslation } from 'react-i18next';

// Franja fina de confianza bajo el menú: comunica la propuesta de valor
// en un vistazo a quien entra por primera vez.
const TrustBar = () => {
  const { t } = useTranslation();

  const items = [
    { icon: '🌾', text: t('trust_bar.integral', { defaultValue: '100% integral ecológico' }) },
    { icon: '🚴', text: t('trust_bar.delivery', { defaultValue: 'Entrega gratis en Chiclana' }) },
    { icon: '🤝', text: t('trust_bar.direct', { defaultValue: 'Artesano y cercano' }) },
  ];

  return (
    <div className="bg-amber-500/10 dark:bg-slate-800/60 border-b border-amber-100 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200 text-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
            <span aria-hidden="true">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
