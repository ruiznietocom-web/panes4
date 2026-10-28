import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Wheat, Sparkles, Heart, Phone, Lightbulb, X } from 'lucide-react';

import PantoMateImg from '../assets/images/pantomate.jpg';
import BarrasPan from '../assets/images/barras.jpg';
import PantoMate from '../assets/images/pantomateb.jpg';
import BollosPulguitas from '../assets/images/bollopulga.jpg';
import CorazonHarina from '../assets/images/corazon.jpg';
import PandeAjo from '../assets/images/panajo.jpg';
import PandeCacao from '../assets/images/pancacao.jpg';
import PandeOliva from '../assets/images/panoliva.jpg';
import Pulguitascenteno from '../assets/images/pulguitas.jpg';
import Bolloswenos from '../assets/images/bollos.jpg';

const InformacionPage = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = React.useState(null);

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 sm:p-10 bg-white/95 dark:bg-stone-900/95 rounded-3xl shadow-artisan transition-colors duration-300 border border-amber-900/10 dark:border-stone-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Cabecera */}
      <div className="text-center mb-8 pb-6 border-b border-amber-900/10 dark:border-stone-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
          <Wheat className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Filosofía de Obrador</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white font-serif">
          {t('info_page.title')}
        </h1>
      </div>

      <div className="space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed font-sans text-base sm:text-lg">
        {/* Cita destacada */}
        <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/60 dark:border-stone-700 text-center my-6">
          <p className="font-serif text-xl sm:text-2xl text-amber-900 dark:text-amber-300 italic">
            "{t('info_page.quote')}"
          </p>
        </div>

        <p>{t('info_page.p1')}</p>
        <p>{t('info_page.p2')}</p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-amber-900/10 dark:border-stone-700">
            <img
              src={PantoMateImg}
              alt="Pan de tomate"
              loading="lazy"
              className="w-full max-w-md object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(PantoMateImg)}
            />
          </div>
        </div>

        <p>{t('info_page.p3')}</p>

        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-8 mb-4 font-serif flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          {t('info_page.fermentation_title')}
        </h3>

        <p>{t('info_page.p4')}</p>
        <p>{t('info_page.p5')}</p>
        <p>{t('info_page.p6')}</p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-amber-900/10 dark:border-stone-700">
            <img
              src={BarrasPan}
              alt="Barras"
              loading="lazy"
              className="w-full max-w-md object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(BarrasPan)}
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-8 mb-4 font-serif border-b border-amber-200/60 dark:border-stone-700 pb-2 inline-block">
          {t('info_page.know_flours')}
        </h3>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((idx) => (
            <li
              key={idx}
              className={`p-4 rounded-2xl border border-amber-200/70 dark:border-stone-700 bg-amber-50/50 dark:bg-stone-800/50 ${
                idx === 5 ? 'md:col-span-2' : ''
              }`}
            >
              <strong className="text-amber-900 dark:text-amber-300 block mb-1 font-serif text-lg">
                {t(`info_page.flours.${idx}.title`)}
              </strong>
              <span className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                {t(`info_page.flours.${idx}.desc`)}
              </span>
            </li>
          ))}
        </ul>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-amber-900/10 dark:border-stone-700">
            <img
              src={PantoMate}
              alt="Pan de tomate y orégano"
              loading="lazy"
              className="w-full max-w-md object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(PantoMate)}
            />
          </div>
        </div>

        <p>{t('info_page.yeast')}</p>
        <p>{t('info_page.salt')}</p>

        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mt-8 mb-4 font-serif flex items-center gap-2">
          <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          {t('info_page.commitment_title')}
        </h3>

        <p>{t('info_page.p7')}</p>
        <p>{t('info_page.p8')}</p>

        <p className="font-serif text-lg text-center text-amber-900 dark:text-amber-200 italic my-8 bg-amber-100/60 dark:bg-stone-800/80 p-6 rounded-2xl border border-amber-300/40 dark:border-stone-700 shadow-sm">
          {t('info_page.thanks')}
        </p>

        <div className="text-center p-4 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-2">
          <Phone className="w-4 h-4 text-emerald-600" />
          <span className="font-medium text-sm sm:text-base">
            {t('info_page.contact')}{' '}
            <strong className="text-emerald-700 dark:text-emerald-400 font-bold">627-52-63-80</strong>
          </span>
        </div>

        {/* Imagen corazón */}
        <div className="my-8 flex justify-center">
          <div className="relative group overflow-hidden rounded-2xl shadow-lg border border-amber-900/10 dark:border-stone-700">
            <img
              src={CorazonHarina}
              alt="Corazón dibujado en harina"
              loading="lazy"
              className="w-full max-w-md object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
              onClick={() => handleImageClick(CorazonHarina)}
            />
          </div>
        </div>

        <div className="border-t-2 border-dashed border-amber-200 dark:border-stone-700 my-8"></div>

        <h3 className="text-2xl font-bold text-center text-amber-900 dark:text-amber-300 mb-6 font-serif flex items-center justify-center gap-2">
          <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          {t('info_page.tips_title')}
        </h3>

        <div className="bg-amber-50/70 dark:bg-stone-800/70 p-6 rounded-2xl border border-amber-200/60 dark:border-stone-700 space-y-3 text-sm sm:text-base">
          <p>{t('info_page.tip1')}</p>
          <p>{t('info_page.tip2')}</p>
          <p className="font-semibold text-amber-900 dark:text-amber-200">
            {t('info_page.tip3')}
          </p>
        </div>

        {/* Galería de imágenes final */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-8">
          {[BollosPulguitas, Bolloswenos, PandeAjo, PandeCacao, PandeOliva, Pulguitascenteno].map((img, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl shadow-md border border-amber-900/10 dark:border-stone-700 cursor-pointer"
              onClick={() => handleImageClick(img)}
            >
              <img
                src={img}
                alt={`${t('info_page.title')} ${index + 1}`}
                loading="lazy"
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Modal Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-sm p-4 cursor-pointer"
          >
            <motion.img
              src={selectedImage}
              alt="Ampliada"
              className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl border border-amber-900/30"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white bg-stone-900/70 rounded-full p-2.5 hover:bg-stone-900 transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InformacionPage;
