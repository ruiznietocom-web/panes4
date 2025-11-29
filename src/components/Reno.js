import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as RenoSvg } from './reno.svg';

const Reno = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }} // Empieza abajo fuera de pantalla
                    animate={{ y: 0 }}   // Sube
                    exit={{ y: 200 }}    // Baja al salir
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-0 left-4 z-[60] pointer-events-none"
                >
                    <div className="relative w-24 h-auto md:w-40 md:h-56">
                        {/* Globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-16 -right-10 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-amber-600"
                        >
                            <p className="text-sm font-bold text-amber-700 whitespace-nowrap">Feliz Navidad!! 🦌</p>
                        </motion.div>

                        <RenoSvg className="w-full h-full drop-shadow-2xl" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Reno;
