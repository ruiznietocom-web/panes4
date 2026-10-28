import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wheat, Bike, HeartHandshake } from 'lucide-react';

const TrustBar = () => {
  const { t } = useTranslation();

  const items = [
    { icon: Wheat, text: t('trust_bar.integral', { defaultValue: '100% integral ecológico' }) },
    { icon: Bike, text: t('trust_bar.delivery', { defaultValue: 'Entrega gratis en Chiclana' }) },
    { icon: HeartHandshake, text: t('trust_bar.direct', { defaultValue: 'Artesano y cercano' }) },
  ];

  return (
    <div className="bg-amber-50/70 dark:bg-stone-900/60 border-b border-amber-200/40 dark:border-stone-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-1.5 text-xs font-medium text-stone-700 dark:text-amber-200/90 text-center">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <item.icon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrustBar;
