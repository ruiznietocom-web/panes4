import React from 'react'; // Componente pequeño y reutilizable para mostrar alérgenos
import { useTranslation } from 'react-i18next';

// Icono asociado a cada alérgeno (los nombres traducidos vienen de allergens.* en translation.json)
const ALLERGEN_ICONS = {
  gluten: '🌾',
  nuts: '🥜',
  milk: '🥛',
  sesame: '⚪'
};

// Chips discretos con los alérgenos de un producto.
// size: 'xs' (tarjetas de producto) o 'sm' (fichas/modales).
const AllergenBadges = ({ allergens, size = 'xs', className = '' }) => {
  const { t } = useTranslation();

  if (!allergens || allergens.length === 0) return null;

  const sizeClasses = size === 'sm'
    ? 'text-xs px-2.5 py-1'
    : 'text-[10px] px-2 py-0.5';

  return (
    <div className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}>
      {allergens.map(a => (
        <span
          key={a}
          title={t('allergens.title')}
          className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 dark:border-slate-500 dark:bg-slate-700 dark:text-amber-200 font-medium ${sizeClasses}`}
        >
          <span aria-hidden="true">{ALLERGEN_ICONS[a] || '⚠️'}</span>
          {t(`allergens.${a}`)}
        </span>
      ))}
    </div>
  );
};

export default AllergenBadges;
