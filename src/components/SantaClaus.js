import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SantaClaus = ({ isVisible }) => {

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
                            className="absolute -top-16 -right-10 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border-2 border-red-500"
                        >
                            <p className="text-sm font-bold text-red-600 whitespace-nowrap">¡Jo Jo Jo! 🎅</p>
                        </motion.div>

                        {/* SVG Santa Claus */}

                        <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <radialGradient id="skinGrad" cx="50%" cy="35%" r="70%">
                                    <stop offset="0%" stopColor="#ffe5e5" />
                                    <stop offset="60%" stopColor="#f5b5b5" />
                                    <stop offset="100%" stopColor="#e68585" />
                                </radialGradient>
                                <radialGradient id="shadowEye" cx="50%" cy="50%" r="60%">
                                    <stop offset="0%" stopColor="black" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="black" stopOpacity="0" />
                                </radialGradient>
                                <linearGradient id="hatRed" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#dc2626" />
                                    <stop offset="100%" stopColor="#7f1d1d" />
                                </linearGradient>
                                <radialGradient id="beardShade" cx="50%" cy="70%" r="80%">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="100%" stopColor="#d4d4d4" />
                                </radialGradient>
                                <radialGradient id="noseGrad">
                                    <stop offset="0%" stopColor="#ff9f9f" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                </radialGradient>
                                <radialGradient id="hatShine" cx="50%" cy="30%" r="50%">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </radialGradient>
                                <radialGradient id="glowBody" cx="50%" cy="120%" r="80%">
                                    <stop offset="0%" stopColor="#fff9f0" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#fff9f0" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Cuerpo con resplandor */}
                            <path d="M10,110 Q60,95 110,110 L110,140 L10,140 Z" fill="url(#hatRed)" stroke="#7F1D1D" strokeWidth="3" />
                            <path d="M10,110 Q60,95 110,110 L110,140 L10,140 Z" fill="url(#glowBody)" />

                            {/* Cabeza y mejillas con parpadeo suave */}
                            <circle cx="60" cy="65" r="28" fill="url(#skinGrad)" />
                            <circle cx="45" cy="70" r="6" fill="#fecaca">
                                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="75" cy="70" r="6" fill="#fecaca">
                                <animate attributeName="opacity" values="0.7;0.9;0.7" dur="2s" repeatCount="indefinite" />
                            </circle>

                            {/* Gorro con brillo animado */}
                            <path d="M20,45 Q60,0 100,45" fill="url(#hatRed)" stroke="#7F1D1D" strokeWidth="3" />
                            <path d="M20,45 Q60,0 100,45" fill="url(#hatShine)">
                                <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite" />
                            </path>
                            <circle cx="100" cy="45" r="10" fill="white" />
                            <circle cx="100" cy="47" r="6" fill="#d4d4d4" opacity="0.7" />
                            <rect x="22" y="40" width="76" height="14" rx="7" fill="white" stroke="#d4d4d4" strokeWidth="2" />

                            {/* Barba con sombra dinámica */}
                            <path d="M30,65 Q60,115 90,65 Q112,90 60,125 Q8,90 30,65" fill="url(#beardShade)" stroke="#e5e7eb" strokeWidth="3">
                                <animate attributeName="stroke-opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                            </path>

                            {/* Ojos */}
                            <circle cx="48" cy="58" r="4" fill="url(#shadowEye)" opacity="0.3" />
                            <circle cx="48" cy="58" r="3" fill="black" />
                            <circle cx="72" cy="58" r="3" fill="black">
                                <animate attributeName="r" values="3;0;3" dur="1s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="47" cy="57" r="1" fill="white" />
                            <circle cx="71" cy="57" r="1" fill="white" />

                            {/* Nariz */}
                            <circle cx="60" cy="69" r="7" fill="url(#noseGrad)" />

                            {/* Bigote */}
                            <path d="M42,72 Q60,82 78,72 Q60,76 42,72" fill="#f3f4f6" stroke="white" strokeWidth="2" />

                            {/* Manos animadas */}
                            <g>
                                <animateTransform attributeName="transform" type="rotate" values="0 100 80;15 100 80;0 100 80;15 100 80;0 100 80" dur="1.3s" repeatCount="indefinite" />
                                <path d="M100,80 L117,55" stroke="#B91C1C" strokeWidth="7" strokeLinecap="round" />
                                <circle cx="100" cy="80" r="10" fill="#ffe5e5" stroke="#fca5a5" strokeWidth="2" />
                            </g>

                            <g>
                                <animateTransform attributeName="transform" type="rotate" values="0 20 80;-15 20 80;0 20 80;-15 20 80;0 20 80" dur="1.3s" repeatCount="indefinite" />
                                <path d="M20,80 L3,55" stroke="#B91C1C" strokeWidth="7" strokeLinecap="round" />
                                <circle cx="20" cy="80" r="10" fill="#ffe5e5" stroke="#fca5a5" strokeWidth="2" />
                            </g>

                            {/* Nieve animada con rebote al llegar al suelo */}
                            <g fill="white">
                                <circle cx="20" cy="10" r="1.5">
                                    <animate attributeName="cy" from="-5" to="135" dur="5s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="0.5s" begin="5s" repeatCount="indefinite" />
                                    <animate attributeName="cx" values="20;25;20" dur="5s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="60" cy="-10" r="2">
                                    <animate attributeName="cy" from="-5" to="135" dur="6s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="0.6s" begin="6s" repeatCount="indefinite" />
                                    <animate attributeName="cx" values="60;65;60" dur="6s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="90" cy="0" r="1">
                                    <animate attributeName="cy" from="-5" to="135" dur="4s" repeatCount="indefinite" />
                                    <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="0.4s" begin="4s" repeatCount="indefinite" />
                                    <animate attributeName="cx" values="90;95;90" dur="4s" repeatCount="indefinite" />
                                </circle>
                            </g>
                        </svg>






                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SantaClaus;
