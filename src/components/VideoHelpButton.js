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
      <div className={`fixed right-5 flex flex-col items-center z-40 transition-all duration-500 ${isRaised ? 'bottom-44 lg:bottom-28' : 'bottom-20 lg:bottom-6'}`}>
        {/* Floating Button */}
        <button
          onClick={toggleModal}
          className="bg-amber-500 hover:bg-amber-400 text-stone-950 w-11 h-11 flex justify-center items-center rounded-full shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-110 border-2 border-white dark:border-stone-800"
          title="Ver video explicativo"
        >
          <FaVideo className="w-5 h-5 text-stone-950" />
        </button>

        {/* Text Label */}
        <div
          className="mt-1.5 flex items-center justify-center bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-stone-800 dark:text-stone-200 px-2.5 py-0.5 rounded-full shadow-md border border-amber-900/10 dark:border-stone-700 cursor-pointer hover:bg-white dark:hover:bg-stone-800 transition-colors"
          onClick={toggleModal}
        >
          <span className="text-[11px] font-bold whitespace-nowrap">¿Cómo pedir?</span>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm"
            onClick={toggleModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-stone-900 rounded-2xl shadow-2xl overflow-hidden max-w-[90vw] max-h-[90vh] mx-4 border border-amber-900/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-4 right-4 z-10 bg-stone-900/80 hover:bg-stone-900 text-white p-2.5 rounded-full transition-colors"
              >
                <FaTimes className="w-5 h-5" />
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
