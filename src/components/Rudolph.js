import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Rudolph = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200 }} // Empieza abajo fuera de pantalla
                    animate={{ y: 0 }}   // Sube
                    exit={{ y: 200 }}    // Baja al salir
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[60] pointer-events-none"
                >
                    <div className="relative w-24 h-24 md:w-40 md:h-40">
                        {/* Globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -top-16 -right-10 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-amber-600"
                        >
                            <p className="text-sm font-bold text-amber-700 whitespace-nowrap">¡Feliz Navidad! 🦌</p>
                        </motion.div>

                        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                            <defs>
                                <radialGradient id="furMain" cx="50%" cy="40%" r="60%">
                                    <stop offset="0%" stopColor="#c38a53" />
                                    <stop offset="70%" stopColor="#9b6434" />
                                    <stop offset="100%" stopColor="#7a4a23" />
                                </radialGradient>
                                <radialGradient id="muzzleGrad" cx="50%" cy="55%" r="50%">
                                    <stop offset="0%" stopColor="#eac59e" />
                                    <stop offset="100%" stopColor="#c79b6b" />
                                </radialGradient>
                                <radialGradient id="earInner" cx="40%" cy="40%" r="70%">
                                    <stop offset="0%" stopColor="#f5cab3" />
                                    <stop offset="100%" stopColor="#b5794c" />
                                </radialGradient>
                                <linearGradient id="hornGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#7f5632" />
                                    <stop offset="100%" stopColor="#5b3a1f" />
                                </linearGradient>
                                <radialGradient id="eyeGrad" cx="50%" cy="50%" r="70%">
                                    <stop offset="0%" stopColor="#000" />
                                    <stop offset="100%" stopColor="#1a1a1a" />
                                </radialGradient>
                            </defs>

                            {/* OREJAS REALISTAS */}
                            <path d="M22 33 C16 20, 22 10, 32 22 C36 28, 34 37, 22 33" fill="url(#earInner)" />
                            <path d="M78 33 C84 20, 78 10, 68 22 C64 28, 66 37, 78 33" fill="url(#earInner)" />

                            {/* CUERNOS DETALLADOS */}
                            <path
                                d="M32 25 C20 10, 10 8, 18 22 
                                   M30 22 C18 12, 15 5, 25 3 
                                   M68 25 C80 10, 90 8, 82 22 
                                   M70 22 C82 12, 85 5, 75 3"
                                stroke="url(#hornGrad)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                fill="none"
                            />

                            {/* CARA CON DEGRADADO SUAVE */}
                            <ellipse cx="50" cy="55" rx="30" ry="27" fill="url(#furMain)" />

                            {/* HOCICO REALISTA */}
                            <ellipse cx="50" cy="66" rx="19" ry="14" fill="url(#muzzleGrad)" />

                            {/* OJOS SUPER REALISTAS */}
                            <ellipse cx="40" cy="52" rx="5" ry="7" fill="url(#eyeGrad)" />
                            <ellipse cx="60" cy="52" rx="5" ry="7" fill="url(#eyeGrad)" />

                            {/* Brillos del ojo */}
                            <circle cx="39" cy="50" r="1.6" fill="white" opacity="0.9" />
                            <circle cx="59" cy="50" r="1.6" fill="white" opacity="0.9" />

                            {/* Nariz Roja Brillante — ANIMADA */}
                            <motion.circle
                                cx="50"
                                cy="62"
                                r="7"
                                fill="#E32626"
                                animate={{ fill: ["#E32626", "#B30000", "#E32626"] }}
                                transition={{ duration: 1.3, repeat: Infinity }}
                            />
                            <circle cx="48" cy="60" r="2.5" fill="white" opacity="0.6" />

                            {/* SOMBRA BAJA DEL CUELLO */}
                            <path d="M20,90 Q50,78 80,90 L80,100 L20,100 Z" fill="#855a33" />

                            {/* PATA SALUDANDO REALISTA */}
                            <motion.g
                                animate={{ rotate: [0, 15, 0, 15, 0] }}
                                transition={{ delay: 0.5, duration: 1, repeat: 1 }}
                                style={{ originX: "75px", originY: "80px" }}
                            >
                                <path
                                    d="M70,85 Q86,72 96,62"
                                    stroke="#8b5e36"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                                <circle cx="96" cy="62" r="5.5" fill="#4a2c12" />
                            </motion.g>
                        </svg>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Rudolph;
