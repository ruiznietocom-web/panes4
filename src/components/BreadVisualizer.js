import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scissors, CheckCircle2, ShoppingBag } from 'lucide-react';
import { bollitos, pulguitas, getProductPhoto, getProductDefinition, calculatePanWeight } from '../data/products';
import { formatPrice } from '../utils/formatPrice';

/**
 * Función que calcula los colores, miga, corte y rebanadas según cereales y corte.
 */
const getPanVisualAttributes = (panFlours = [], panCorte = null, panExtras = []) => {
  const floursOnly = panFlours.filter(h => h.price > 0);
  const corteOnly = panCorte || panFlours.find(h => h.price === 0);
  const weight = calculatePanWeight(panExtras);

  const hasCenteno = floursOnly.some(f => f.name.toLowerCase().includes('centeno'));
  const hasKhorasan = floursOnly.some(f => f.name.toLowerCase().includes('khorasan'));
  const hasEspelta = floursOnly.some(f => f.name.toLowerCase().includes('espelta'));
  const hasTritordeum = floursOnly.some(f => f.name.toLowerCase().includes('tritordeum'));

  let colors;
  if (floursOnly.length === 0) {
    colors = {
      crustTop: '#D4A359',
      crustBase: '#9A6B28',
      crustGlow: '#F5D79E',
      crumbFace: '#FBF5E8',
      crumbBorder: '#C99E5C',
      name: 'Barra clásica de cereales'
    };
  } else if (hasCenteno) {
    colors = {
      crustTop: '#6E3C12',
      crustBase: '#422104',
      crustGlow: '#8F531E',
      crumbFace: '#D8C3A9',
      crumbBorder: '#784419',
      name: 'Centeno intenso'
    };
  } else if (hasKhorasan || hasTritordeum) {
    colors = {
      crustTop: '#C88A24',
      crustBase: '#8C560D',
      crustGlow: '#F3BE5C',
      crumbFace: '#FDF0CD',
      crumbBorder: '#C08527',
      name: 'Cereales ancestrales'
    };
  } else if (hasEspelta) {
    colors = {
      crustTop: '#A0631E',
      crustBase: '#6B3C08',
      crustGlow: '#CD8E38',
      crumbFace: '#F8EED8',
      crumbBorder: '#9E6422',
      name: 'Espelta tradicional'
    };
  } else {
    colors = {
      crustTop: '#B57428',
      crustBase: '#7A480D',
      crustGlow: '#E5A947',
      crumbFace: '#FAF2E2',
      crumbBorder: '#B2762C',
      name: 'Trigo ecológico'
    };
  }

  const corteType = corteOnly?.name?.toUpperCase()?.includes('FINO')
    ? 'fino'
    : corteOnly?.name?.toUpperCase()?.includes('GRUESO')
    ? 'grueso'
    : corteOnly?.name?.toUpperCase()?.includes('NORMAL')
    ? 'normal'
    : 'sin_corte';

  let slicesConfig = null;
  if (corteType === 'fino') {
    slicesConfig = { count: 11, width: 20, gap: 5, label: 'Cortado Fino (~10 mm)' };
  } else if (corteType === 'normal') {
    slicesConfig = { count: 8, width: 29, gap: 7, label: 'Cortado Normal (~14 mm)' };
  } else if (corteType === 'grueso') {
    slicesConfig = { count: 5, width: 48, gap: 10, label: 'Cortado Grueso (~20 mm)' };
  }

  return {
    floursOnly,
    corteOnly,
    corteType,
    slicesConfig,
    colors,
    weight,
    flourPct: floursOnly.length > 0 ? Math.round(100 / floursOnly.length) : 0
  };
};

/**
 * Tarjeta individual ilustrada para cada Barra de Pan (sea en diseño o ya añadida al pedido).
 */
const BarraLoafCard = ({
  flours = [],
  corte = null,
  extras = [],
  title,
  price,
  quantity = 1,
  isDraft = false,
  uniqueId = 'default'
}) => {
  const attrs = getPanVisualAttributes(flours, corte, extras);
  const idPrefix = `${uniqueId}_${isDraft ? 'draft' : 'loaf'}`.replace(/[^a-zA-Z0-9_-]/g, '_');

  return (
    <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
      isDraft
        ? 'bg-amber-100/50 dark:bg-stone-800/90 border-amber-400 dark:border-amber-500/50 shadow-sm ring-2 ring-amber-400/20'
        : 'bg-stone-50/80 dark:bg-stone-800/60 border-amber-200/60 dark:border-stone-700 shadow-xs'
    }`}>
      {/* Cabecera del Pan */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
            isDraft
              ? 'bg-amber-500 text-stone-950 animate-pulse'
              : 'bg-amber-600 text-white'
          }`}>
            {isDraft ? '✨ En Diseño' : title}
          </span>
          {quantity > 1 && (
            <span className="shrink-0 text-[10px] font-bold bg-amber-200 dark:bg-stone-700 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full">
              x{quantity}
            </span>
          )}
          <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-white truncate">
            {attrs.floursOnly.length === 0
              ? 'Barra 100% Integral Ecológica'
              : attrs.floursOnly.map(f => f.name.replace(' Integral Ecológico', '')).join(' + ')}
          </span>
        </div>

        {/* Peso calculado dinámicamente con extras */}
        <span className="shrink-0 text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-stone-700 px-2 py-0.5 rounded-full border border-amber-300/40 dark:border-stone-600">
          {attrs.weight.label}
        </span>
      </div>

      {/* Ilustración SVG de la Barra de Pan */}
      <div className="relative w-full h-24 sm:h-28 bg-gradient-to-b from-amber-50/80 to-amber-100/40 dark:from-stone-800/80 dark:to-stone-850/60 rounded-xl p-1 flex items-center justify-center border border-amber-200/50 dark:border-stone-700/60 mb-2 overflow-hidden">
        <svg viewBox="0 0 320 130" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <radialGradient id={`crust_${idPrefix}`} cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor={attrs.colors.crustGlow} />
              <stop offset="60%" stopColor={attrs.colors.crustTop} />
              <stop offset="100%" stopColor={attrs.colors.crustBase} />
            </radialGradient>

            <linearGradient id={`crumb_${idPrefix}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor={attrs.colors.crumbFace} />
              <stop offset="100%" stopColor={attrs.colors.crumbBorder} stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id={`shadow_${idPrefix}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,0,0,0.28)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>

          {/* Sombra base */}
          <ellipse cx="160" cy="108" rx="140" ry="10" fill={`url(#shadow_${idPrefix})`} />

          {/* CASO 1: BARRA ENTERA (SIN CORTE) */}
          {!attrs.slicesConfig ? (
            <g>
              <path
                d="M 22 68 C 22 45, 60 32, 160 32 C 260 32, 298 45, 298 68 C 298 88, 260 98, 160 98 C 60 98, 22 88, 22 68 Z"
                fill={`url(#crust_${idPrefix})`}
                stroke="#542B05"
                strokeWidth="2.5"
              />
              <path
                d="M 45 52 Q 160 36 275 52 Q 160 44 45 52 Z"
                fill="#FFFFFF"
                opacity="0.38"
              />
              <g stroke="#FFF0D4" strokeWidth="4" strokeLinecap="round" opacity="0.95">
                <path d="M 65 48 Q 80 65 92 78" />
                <path d="M 115 42 Q 130 63 145 80" />
                <path d="M 175 42 Q 190 63 205 80" />
                <path d="M 230 48 Q 245 65 258 78" />
              </g>
              <g stroke="#482203" strokeWidth="1.5" strokeLinecap="round" opacity="0.75">
                <path d="M 63 46 Q 78 63 90 76" />
                <path d="M 113 40 Q 128 61 143 78" />
                <path d="M 173 40 Q 188 61 203 78" />
                <path d="M 228 46 Q 243 63 256 76" />
              </g>
            </g>
          ) : (
            /* CASO 2: BARRA CORTADA (REBANADA FÍSICAMENTE EN SEPARACIONES) */
            <g>
              {Array.from({ length: attrs.slicesConfig.count }).map((_, i) => {
                const totalW = attrs.slicesConfig.count * (attrs.slicesConfig.width + attrs.slicesConfig.gap) - attrs.slicesConfig.gap;
                const startX = 160 - totalW / 2;
                const x = startX + i * (attrs.slicesConfig.width + attrs.slicesConfig.gap);
                const isFirst = i === 0;
                const isLast = i === attrs.slicesConfig.count - 1;

                return (
                  <g key={`slice_${i}`}>
                    <rect
                      x={x}
                      y="36"
                      width={attrs.slicesConfig.width}
                      height="60"
                      rx={isFirst || isLast ? "10" : "5"}
                      fill={`url(#crust_${idPrefix})`}
                      stroke="#542B05"
                      strokeWidth="1.5"
                    />
                    <rect
                      x={x + 2}
                      y="40"
                      width={Math.max(4, attrs.slicesConfig.width - 4)}
                      height="52"
                      rx="4"
                      fill={`url(#crumb_${idPrefix})`}
                      stroke={attrs.colors.crumbBorder}
                      strokeWidth="1"
                    />
                    {attrs.slicesConfig.width > 15 && (
                      <g fill={attrs.colors.crumbBorder} opacity="0.45">
                        <circle cx={x + attrs.slicesConfig.width / 2} cy="56" r="1.5" />
                        <circle cx={x + attrs.slicesConfig.width / 2 - 2} cy="72" r="1.8" />
                        <circle cx={x + attrs.slicesConfig.width / 2 + 3} cy="64" r="1.2" />
                      </g>
                    )}
                    <path
                      d={`M ${x + 2} 40 Q ${x + attrs.slicesConfig.width / 2} 37 ${x + attrs.slicesConfig.width - 2} 40`}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Badge indicador de corte */}
        <div className="absolute bottom-1.5 right-2 bg-stone-900/85 dark:bg-stone-950/85 backdrop-blur-md text-amber-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-300/30">
          <Scissors className="w-2.5 h-2.5 text-amber-400" />
          <span>{attrs.slicesConfig ? attrs.slicesConfig.label : 'Barra entera'}</span>
        </div>
      </div>

      {/* Chips de Harinas y Extras */}
      <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
        <div className="flex flex-wrap gap-1">
          {attrs.floursOnly.map(f => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100/70 dark:bg-stone-700 text-stone-800 dark:text-amber-200 text-[10px] font-semibold"
            >
              <CheckCircle2 className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
              {f.name.replace(' Integral Ecológico', '')}
            </span>
          ))}

          {extras.map(e => (
            <span
              key={e.id}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 text-[10px] font-semibold"
            >
              <span>{e.icon}</span>
              <span>{e.name}</span>
            </span>
          ))}
        </div>

        {price && (
          <span className="font-serif font-bold text-xs text-amber-800 dark:text-amber-300">
            {formatPrice(price + extras.reduce((sum, e) => sum + e.price, 0))}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * BreadVisualizer
 * Previsualizador dinámico de Tu Creación.
 * Refleja TODOS los panes añadidos a la cesta, además del pan actualmente en preparación.
 */
const BreadVisualizer = ({ selectedHarinas = [], cartItems = [] }) => {
  // Harinas y corte actualmente seleccionados en el configurador activo
  const activeFlours = selectedHarinas.filter(h => h.price > 0);
  const activeCorte = selectedHarinas.find(h => h.price === 0);
  const isConfiguringNewPan = activeFlours.length > 0;

  // Todos los panes personalizados que ya están en la cesta
  const panesInCart = cartItems.filter(item => item.type === 'panPersonalizado');

  // Filtrar bollitos y pulguitas en la cesta para mostrar su referencia fotográfica y definición
  const bollitosInCart = cartItems.filter(item => item.type === 'bollito');
  const pulguitasInCart = cartItems.filter(item => item.type === 'pulguita');
  const hasPastryInCart = bollitosInCart.length > 0 || pulguitasInCart.length > 0;

  // Total de panes que existen
  const totalBreadsCount = panesInCart.length + (isConfiguringNewPan ? 1 : 0);

  return (
    <div className="rounded-3xl bg-white/95 dark:bg-stone-900/95 p-5 shadow-ticket border border-amber-900/15 dark:border-stone-800 relative overflow-hidden transition-all duration-300">
      
      {/* Luz ambiente de fondo */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Cabecera de Tu Creación */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-stone-950 shadow-xs">
            <Sparkles className="w-3 h-3" />
            Tu Creación
          </span>
          <span className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100">
            {totalBreadsCount > 1
              ? `Tus Panes Artesanos (${totalBreadsCount})`
              : totalBreadsCount === 1
              ? 'Barra Artesana'
              : 'Añade tu primera barra artesana'}
          </span>
        </div>

        {totalBreadsCount > 0 ? (
          <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
            {totalBreadsCount} {totalBreadsCount === 1 ? 'pan creado' : 'panes creados'}
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
            Obrador libre
          </span>
        )}
      </div>

      {/* SECCIÓN DE PANES: MUESTRA TODOS LOS PANES REFLEJADOS (CADA UNO CON SU CORTE, HARINAS Y EXTRAS) */}
      <div className={`space-y-3 mb-3 ${totalBreadsCount > 2 ? 'max-h-[520px] overflow-y-auto pr-1' : ''}`}>
        {/* 1. TODOS los panes personalizados que ya han sido añadidos al pedido */}
        {panesInCart.map((pan, idx) => (
          <BarraLoafCard
            key={pan.id || idx}
            uniqueId={`cart_pan_${pan.id || idx}`}
            flours={pan.harinas || []}
            corte={pan.harinas?.find(h => h.price === 0)}
            extras={pan.extras || []}
            title={`Pan ${idx + 1}`}
            price={pan.price}
            quantity={pan.quantity || 1}
            isDraft={false}
          />
        ))}

        {/* 2. Pan actualmente en preparación (si el usuario ha empezado a seleccionar harinas para otro pan) */}
        {isConfiguringNewPan && (
          <BarraLoafCard
            key="draft_pan"
            uniqueId="draft_pan"
            flours={selectedHarinas}
            corte={activeCorte}
            extras={[]}
            title={`Pan ${panesInCart.length + 1} (En Creación)`}
            isDraft={true}
          />
        )}

        {/* 3. Estado inicial cuando aún no se ha seleccionado ninguna barra */}
        {totalBreadsCount === 0 && (
          <div className="p-4 rounded-2xl border-2 border-dashed border-amber-300/80 dark:border-stone-700 bg-amber-50/50 dark:bg-stone-850/50 text-center transition-all">
            {/* Cabecera / Badge */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-stone-950">
                ✨ Tu Creación
              </span>
              <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-stone-700 px-2 py-0.5 rounded-full">
                Aprox. 1000g - 1100g
              </span>
            </div>

            {/* Ilustración SVG de la Barra de Pan en silueta artesanal */}
            <div className="relative w-full h-24 sm:h-28 bg-gradient-to-b from-amber-50/70 to-amber-100/40 dark:from-stone-800/60 dark:to-stone-850/40 rounded-xl p-1 flex items-center justify-center border border-amber-200/50 dark:border-stone-700/60 mb-2 overflow-hidden">
              <svg viewBox="0 0 320 130" className="w-full h-full drop-shadow-sm opacity-65">
                <defs>
                  <radialGradient id="crust_empty_placeholder" cx="50%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="60%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                  </radialGradient>
                  <radialGradient id="shadow_empty_placeholder" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(0,0,0,0.18)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>
                <ellipse cx="160" cy="108" rx="140" ry="10" fill="url(#shadow_empty_placeholder)" />
                <path
                  d="M 22 68 C 22 45, 60 32, 160 32 C 260 32, 298 45, 298 68 C 298 88, 260 98, 160 98 C 60 98, 22 88, 22 68 Z"
                  fill="url(#crust_empty_placeholder)"
                  stroke="#78350F"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />
                <g stroke="#FEF3C7" strokeWidth="3" strokeLinecap="round" opacity="0.9">
                  <path d="M 65 48 Q 80 65 92 78" />
                  <path d="M 115 42 Q 130 63 145 80" />
                  <path d="M 175 42 Q 190 63 205 80" />
                  <path d="M 230 48 Q 245 65 258 78" />
                </g>
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 bg-stone-900/10 dark:bg-stone-950/20 backdrop-blur-[0.5px]">
                <span className="font-serif font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  Añade tu primera barra artesana
                </span>
                <span className="text-[10px] text-amber-900/80 dark:text-stone-300 font-sans mt-0.5">
                  Elige hasta 5 harinas en el Obrador
                </span>
              </div>
            </div>

            <p className="text-[11px] text-stone-600 dark:text-stone-400 font-medium">
              🌾 Selecciona tus cereales y tipo de corte para ver tu barra reflejada aquí.
            </p>
          </div>
        )}
      </div>

      {/* REFERENCIA DE IMAGEN CON DEFINICIÓN COMPLETA PARA BOLLITOS Y PULGUITAS */}
      {hasPastryInCart && (
        <div className="pt-3 border-t border-dashed border-amber-200/80 dark:border-stone-700/80 space-y-2.5">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Productos y Packs Seleccionados
            </span>
          </div>

          <div className="space-y-2">
            {bollitosInCart.concat(pulguitasInCart).map((item) => {
              const photo = getProductPhoto(item);
              const name = item.name || 'Producto artesano';
              const definition = getProductDefinition(item);

              return (
                <div
                  key={`${item.type}_${item.id}`}
                  className="flex items-start gap-3 p-2.5 rounded-2xl bg-amber-50/70 dark:bg-stone-800/70 border border-amber-200/60 dark:border-stone-700 shadow-xs transition-all"
                >
                  {/* Foto del producto */}
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover shadow-xs border border-amber-200/80 dark:border-stone-600 shrink-0 mt-0.5"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl bg-amber-100 dark:bg-stone-700 flex items-center justify-center text-2xl shrink-0">
                      {item.image || '🧺'}
                    </div>
                  )}

                  {/* Definición completa del producto / pack */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-serif font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 leading-snug">
                        {name}
                      </span>
                      <span className="shrink-0 text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full">
                        x{item.quantity}
                      </span>
                    </div>

                    {definition && (
                      <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                        {definition}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default BreadVisualizer;
