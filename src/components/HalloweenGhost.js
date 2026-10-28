import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Decoración de Halloween:
 * Un fantasma flotante y semitransparente que se pasea por la pantalla cada 20 segundos
 * a diferentes alturas aleatorias, alternando de izquierda a derecha y viceversa.
 */
const HalloweenGhost = () => {
  const [isCrossing, setIsCrossing] = useState(false);
  const [direction, setDirection] = useState('ltr'); // 'ltr' (izq -> dcha) o 'rtl' (dcha -> izq)
  const [topPercent, setTopPercent] = useState(30);

  useEffect(() => {
    let isMounted = true;
    let crossTimeout = null;
    let nextTimeout = null;

    const CROSSING_DURATION_MS = 9000; // 9 segundos para cruzar suavemente la pantalla flotando
    const PAUSE_BETWEEN_PASSES_MS = 11000; // 11 segundos de pausa (9s + 11s = 20s de ciclo completo)

    const startCrossing = () => {
      if (!isMounted) return;

      // Altura aleatoria entre el 15% y el 70% de la pantalla para que siempre sea visible
      const randomTop = Math.floor(Math.random() * 55) + 15;
      setTopPercent(randomTop);
      setIsCrossing(true);

      // Cuando termina el cruce:
      crossTimeout = setTimeout(() => {
        if (!isMounted) return;
        setIsCrossing(false);

        // Alternar dirección para el siguiente cruce (izq a dcha <-> dcha a izq)
        setDirection(prev => (prev === 'ltr' ? 'rtl' : 'ltr'));

        // Programar el siguiente cruce para completar el ciclo de 20 segundos
        nextTimeout = setTimeout(() => {
          startCrossing();
        }, PAUSE_BETWEEN_PASSES_MS);
      }, CROSSING_DURATION_MS);
    };

    // Primer cruce poco después de cargar la app (2 segundos)
    nextTimeout = setTimeout(startCrossing, 2000);

    return () => {
      isMounted = false;
      if (crossTimeout) clearTimeout(crossTimeout);
      if (nextTimeout) clearTimeout(nextTimeout);
    };
  }, []);

  if (!isCrossing) return null;

  const isLtr = direction === 'ltr';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none"
      aria-hidden="true"
    >
      <motion.div
        key={`ghost-${direction}-${topPercent}`}
        initial={{
          x: isLtr ? -180 : 'calc(100vw + 180px)',
          y: 0,
          rotate: isLtr ? -4 : 4,
          opacity: 0
        }}
        animate={{
          x: isLtr ? 'calc(100vw + 180px)' : -180,
          y: [0, -25, 20, -30, 15, -20, 0],
          rotate: isLtr ? [-4, 6, -6, 5, -4] : [4, -6, 6, -5, 4],
          opacity: [0, 0.65, 0.7, 0.65, 0]
        }}
        transition={{
          duration: 9,
          ease: 'linear',
          opacity: { duration: 9, times: [0, 0.08, 0.5, 0.92, 1] }
        }}
        style={{
          position: 'absolute',
          top: `${topPercent}vh`,
          left: 0,
          width: '135px',
          transform: `scaleX(${isLtr ? 1 : -1})`,
          filter: 'drop-shadow(0 0 14px rgba(249, 115, 22, 0.5)) drop-shadow(0 0 26px rgba(168, 85, 247, 0.3))'
        }}
      >
        <img
          src={`${process.env.PUBLIC_URL || ''}/images/hallowen/fantasma.png`}
          alt="Fantasma Halloween"
          className="w-full h-auto pointer-events-none select-none"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};

export default HalloweenGhost;
