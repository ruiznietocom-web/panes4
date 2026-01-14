import React, { useState } from 'react';
import { FaVideo, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const VideoHelpButton = ({ isRaised }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className={`fixed right-6 flex flex-col items-center z-50 transition-all duration-500 ${isRaised ? 'bottom-40' : 'bottom-4'}`}>

                {/* Floating Button */}
                <button
                    onClick={toggleModal}
                    className="bg-blue-600/35 hover:bg-blue-600/60 text-white w-12 h-12 flex justify-center items-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-md"
                    title="Ver video de ayuda"
                >
                    <FaVideo className="w-6 h-6" />
                </button>

                {/* Text Label */}
                <div className="mt-2 flex items-center justify-center bg-white/70 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-white/90 transition-colors" onClick={toggleModal}>
                    <span className="text-xs font-bold whitespace-nowrap">Como usar la app</span>
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={toggleModal}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-transparent rounded-lg shadow-2xl overflow-hidden max-w-[90vw] max-h-[90vh] mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={toggleModal}
                                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>

                            {/* Video Player */}
                            <video
                                src="/docs/usarapp_edit2.mp4"
                                controls
                                autoPlay
                                className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
                            >
                                Tu navegador no soporta el elemento de video.
                            </video>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VideoHelpButton;
