import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YoNavidadImg from './YONAVIDAD2.png';

const YoNavidad = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-0 left-4 z-[60] pointer-events-none"
                >
                    <div className="relative w-40 h-auto md:w-56 md:h-72">
                        {/* Globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-16 -right-4 bg-white p-2 rounded-2xl rounded-bl-none shadow-xl border-4 border-yellow-400 max-w-[180px]"
                        >
                            <p className="text-xs md:text-sm font-black text-center text-yellow-600 leading-tight">
                                OS DESEO UN FELIZ AÑO NUEVO 🥂2026🥂 Y MUCHO PAN!! 🥖🥖🥖
                            </p>
                        </motion.div>

                        <img
                            src={YoNavidadImg}
                            alt="Yo Navidad"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default YoNavidad;
