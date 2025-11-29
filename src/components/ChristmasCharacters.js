import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================================================
   WRAPPER MEJORADO
========================================================= */
const CharacterWrapper = ({ isVisible, children, greeting, color = "amber" }) => (
    <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ y: 150, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 150, opacity: 0 }}
                transition={{ type: "spring", stiffness: 80, damping: 15 }}
                className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[80] pointer-events-none"
            >
                <div className="relative w-44 h-44">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className={`
                            absolute -top-16 -right-10 bg-white px-3 py-2 rounded-2xl 
                            shadow-xl border-2 border-${color}-600
                        `}
                    >
                        <p className={`text-sm font-bold text-${color}-700`}>
                            {greeting}
                        </p>
                    </motion.div>

                    {children}
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

/* =========================================================
   PERSONAJES (SVGs mejorados)
========================================================= */

// No hay personajes extra por ahora.

/* =========================================================
   ROTADOR AUTOMÁTICO (15s intervalo, 4s visible)
========================================================= */

const CHARACTERS = [
    // Lista vacía
];

export default function CharacterShowcase() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (CHARACTERS.length === 0) return;

        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setIndex((i) => (i + 1) % CHARACTERS.length);
                setVisible(true);
            }, 4000); // dura 4 segundos visible
        }, 15000); // aparece cada 15s

        return () => clearInterval(interval);
    }, []);

    if (CHARACTERS.length === 0) return null;

    const { Component } = CHARACTERS[index];
    return <Component isVisible={visible} />;
}
