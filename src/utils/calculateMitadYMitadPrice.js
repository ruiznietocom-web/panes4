/**
 * Sabores disponibles para las opciones de Mitad y Mitad en Bollitos y Pulguitas
 */
export const MITAD_Y_MITAD_FLAVORS = [
  { id: 'clasico', name: 'Clásico', icon: '🍞', allergens: ['gluten'] },
  { id: 'semillas', name: 'Semillas', icon: '🌻', allergens: ['gluten', 'sesame'] },
  { id: 'nueces', name: 'Nueces', icon: '🥜', allergens: ['gluten', 'nuts'] },
  { id: 'cacao', name: 'Cacao', icon: '🍫', allergens: ['gluten'] },
  { id: 'pasas', name: 'Ciruelas Pasas', icon: '🍇', allergens: ['gluten'] },
  { id: 'curcuma', name: 'Cúrcuma', icon: '🧡', allergens: ['gluten'] },
  { id: 'tomate', name: 'Tomate y Orégano', icon: '🍅', allergens: ['gluten'] },
  { id: 'ajo', name: 'Ajo', icon: '🧄', allergens: ['gluten'] }
];

/**
 * Calcula el precio de un pack Mitad y Mitad según las reglas:
 * - Si se añade alguna mitad de tomate y orégano: 8,00 €
 * - Si se añade cúrcuma y cacao (ambos sabores de 7€): 7,00 €
 * - Para el resto de combinaciones: 7,50 €
 */
export const calculateMitadYMitadPrice = (flavor1Id, flavor2Id) => {
  const isTomate = (id) => id === 'tomate';
  const isCacaoOrCurcuma = (id) => id === 'cacao' || id === 'curcuma';

  // 1. Si se añade alguna mitad de tomate y orégano el precio es de 8€
  if (isTomate(flavor1Id) || isTomate(flavor2Id)) {
    return 8.00;
  }

  // 2. Si se añade cúrcuma y cacao (o ambos de 7€) el precio es de 7€
  if (isCacaoOrCurcuma(flavor1Id) && isCacaoOrCurcuma(flavor2Id)) {
    return 7.00;
  }

  // 3. Para el resto de combinaciones el precio es de 7,50€
  return 7.50;
};

/**
 * Resuelve los detalles completos de un pack Mitad y Mitad a partir de su ID o estructura
 * Formato del ID: mitad_${productType}_${flavor1Id}_${flavor2Id}
 */
export const resolveMitadPackDetails = (item) => {
  if (!item || !item.id) return null;
  const idStr = item.id.toString();
  if (!idStr.startsWith('mitad_')) return null;

  const parts = idStr.split('_');
  if (parts.length >= 4) {
    const productType = parts[1]; // 'bollito' o 'pulguita'
    const f1Id = parts[2];
    const f2Id = parts[3];
    const f1 = MITAD_Y_MITAD_FLAVORS.find(f => f.id === f1Id) || { id: f1Id, name: f1Id };
    const f2 = MITAD_Y_MITAD_FLAVORS.find(f => f.id === f2Id) || { id: f2Id, name: f2Id };
    const isBollito = productType === 'bollito';
    const totalUnits = isBollito ? 6 : 12;
    const halfUnits = isBollito ? 3 : 6;
    const label = isBollito ? 'Bollitos' : 'Pulguitas';
    const price = calculateMitadYMitadPrice(f1Id, f2Id);
    const name = `PACK ${totalUnits} ${label} Mitad y Mitad (${halfUnits}x ${f1.name} + ${halfUnits}x ${f2.name})`;

    return {
      name,
      price,
      image: '🧺',
      icon: '🧺',
      flavor1: f1Id,
      flavor2: f2Id
    };
  }
  return null;
};
