import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReyesMagosImg from './REYESMAGOS2.png';

const ReyesMagos = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed -bottom-10 left-4 z-[60] pointer-events-none"
                >
                    <div className="relative w-48 h-auto md:w-64 md:h-80">
                        {/* Globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-12 -right-2 bg-white p-2 rounded-2xl rounded-bl-none shadow-xl border-4 border-purple-500 max-w-[140px]"
                        >
                            <p className="text-xs md:text-sm font-bold text-center text-purple-700 leading-tight">
                                Ya vienen los Reyes! 👑👑👑🐫🐫🐫
                            </p>
                        </motion.div>

                        <img
                            src={ReyesMagosImg}
                            alt="Reyes Magos"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ReyesMagos;
