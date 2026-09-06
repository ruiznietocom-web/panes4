/**
 * Calcula el precio base de un pan personalizado según las harinas seleccionadas:
 * - Centeno solo: 5,50 €
 * - Trigo solo: 5,50 €
 * - Dos harinas de trigo y centeno: 5,50 €
 * - Tres, cuatro o cinco harinas: 6,00 €
 * - Tritordeum solo: 6,00 €
 * - Espelta solo: 6,00 €
 * - Khorasan solo: 6,00 €
 * - Otras combinaciones de 2 harinas con especiales: 6,00 €
 */
export const calculatePanBasePrice = (selectedHarinas) => {
  if (!selectedHarinas || !Array.isArray(selectedHarinas)) return 5.50;

  // Filtrar las harinas reales (excluir opciones de corte)
  const realFlours = selectedHarinas.filter(h => {
    if (h.price !== undefined) return h.price > 0;
    return h.id && h.id <= 5;
  });

  const count = realFlours.length;
  if (count === 0) return 5.50;

  const isTrigoOrCenteno = (flour) => {
    if (flour.id === 1 || flour.id === 2) return true;
    if (flour.name) {
      const nameLower = flour.name.toLowerCase();
      if (nameLower.includes('trigo') || nameLower.includes('centeno')) return true;
    }
    return false;
  };

  // 1 harina solo
  if (count === 1) {
    if (isTrigoOrCenteno(realFlours[0])) {
      return 5.50;
    }
    return 6.00;
  }

  // 2 harinas
  if (count === 2) {
    const f1 = realFlours[0];
    const f2 = realFlours[1];
    if (isTrigoOrCenteno(f1) && isTrigoOrCenteno(f2)) {
      return 5.50;
    }
    return 6.00;
  }

  // 3, 4 o 5 harinas
  if (count >= 3) {
    return 6.00;
  }

  return 5.50;
};
