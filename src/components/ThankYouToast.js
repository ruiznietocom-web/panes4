import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const showThankYouToast = (t) => {
    toast.custom((toastEntry) => (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`${toastEntry.visible ? 'animate-enter' : 'animate-leave'}
      max-w-md w-full bg-white dark:bg-slate-800 shadow-2xl rounded-2xl
      pointer-events-auto flex ring-1 ring-black ring-opacity-5
      border-2 border-amber-400 overflow-hidden`}
        >
            {/* CONTENIDO */}
            <div className="flex-1 w-0 p-4">
                <div className="flex items-center justify-center gap-3">

                    {/* Estrella izquierda con animación */}
                    <motion.span
                        className="text-4xl"
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        ✨
                    </motion.span>

                    {/* Texto centrado */}
                    <div className="flex flex-col text-center">
                        <p className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                            {t('order_summary.thank_you_title')}
                        </p>
                        <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">
                            {t('order_summary.thank_you_body')}
                        </p>
                    </div>

                    {/* Estrella derecha con animación */}
                    <motion.span
                        className="text-4xl"
                        animate={{ rotate: [0, -20, 20, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                        ✨
                    </motion.span>

                </div>
            </div>

        </motion.div>
    ), {
        id: 'thank-you-toast',
        duration: 4000,
        position: 'top-center',
    });
};
