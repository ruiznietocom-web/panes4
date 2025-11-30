import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as PapaNoelSvg } from './papanoel3.svg';

const PapaNoel3 = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }} // Empieza abajo fuera de pantalla
                    animate={{ y: 0 }}   // Sube
                    exit={{ y: 200 }}    // Baja al salir
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed -bottom-10 left-4 z-[60] pointer-events-none"
                >
                    <div className="relative w-36 h-48 md:w-48 md:h-64">
                        {/* Globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-3 -right-16 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-red-600"
                        >
                            <p className="text-sm font-bold text-red-700 whitespace-nowrap">¡Jo Jo Jo! Feliz Navidad 🎅</p>
                        </motion.div>

                        <PapaNoelSvg className="w-full h-full drop-shadow-2xl" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PapaNoel3;
