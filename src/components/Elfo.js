import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as ElfoSvg } from './elfo.svg';

const Elfo = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    exit={{ y: 200 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed -bottom-7 left-4 z-[60] pointer-events-none"
                >
                    <div className="relative w-36 h-48 md:w-48 md:h-64">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-4 -right-10 bg-white p-2 rounded-2xl rounded-bl-none shadow-lg border-2 border-green-600"
                        >
                            <p className="text-xs font-bold text-green-700 whitespace-nowrap">¡Ayudando a Santa! 🎁</p>
                        </motion.div>
                        <ElfoSvg className="w-full h-full drop-shadow-2xl" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Elfo;
