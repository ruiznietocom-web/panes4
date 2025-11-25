import React from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      className="max-w-4xl mx-auto p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl transition-colors duration-300 border border-amber-50 dark:border-slate-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white font-serif border-b-2 border-amber-100 dark:border-slate-600 pb-4">
        {t('info_page.title')}
      </h1>

      {/* BOTÓN PARA DESCARGAR PDF AL PRINCIPIO */}
      <div className="my-8 flex justify-center">
        <a
          href="/docs/PRECIOS PANES INTEGRALES 30 11 2025.pdf"
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 
                     text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:from-green-700 hover:to-green-800
                     transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
        >
          <Download className="w-6 h-6" />
          {t('info_page.download_pdf')}
        </a>
      </div>

      <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-lg">
        <p className="font-serif text-xl text-amber-700 dark:text-amber-500 text-center italic">
          {t('info_page.quote')}
        </p>

        <p>
          {t('info_page.p1')}
        </p>

        <p>
          {t('info_page.p2')}
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={PantoMateImg}
            alt="Pan de tomate"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleImageClick(PantoMateImg)}
          />
        </div>

        <p>
          {t('info_page.p3')}
        </p>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif">
          {t('info_page.fermentation_title')}
        </h3>

        <p>
          {t('info_page.p4')}
        </p>

        <p>
          {t('info_page.p5')}
        </p>

        <p>
          {t('info_page.p6')}
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={BarrasPan}
            alt="Barras"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleImageClick(BarrasPan)}
          />
        </div>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif border-b border-amber-100 dark:border-slate-700 pb-2 inline-block">
          {t('info_page.know_flours')}
        </h3>

        <ul className="space-y-4">
          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">{t('info_page.flours.1.title')}</strong>
            {t('info_page.flours.1.desc')}
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">{t('info_page.flours.2.title')}</strong>
            {t('info_page.flours.2.desc')}
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">{t('info_page.flours.3.title')}</strong>
            {t('info_page.flours.3.desc')}
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">{t('info_page.flours.4.title')}</strong>
            {t('info_page.flours.4.desc')}
          </li>

          <li className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-xl border border-amber-100 dark:border-slate-600">
            <strong className="text-amber-800 dark:text-amber-400 block mb-2 font-serif text-lg">{t('info_page.flours.5.title')}</strong>
            {t('info_page.flours.5.desc')}
          </li>
        </ul>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={PantoMate}
            alt="Pan tomate"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleImageClick(PantoMate)}
          />
        </div>

        <p>
          {t('info_page.yeast')}
        </p>

        <p>
          {t('info_page.salt')}
        </p>

        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-8 mb-4 font-serif">
          {t('info_page.commitment_title')}
        </h3>

        <p>
          {t('info_page.p7')}
        </p>

        <p>
          {t('info_page.p8')}
        </p>

        <p className="font-serif text-lg text-center text-amber-800 dark:text-amber-400 italic my-8 bg-amber-50 dark:bg-slate-700/30 p-6 rounded-xl">
          {t('info_page.thanks')}
        </p>

        <p className="text-center font-bold text-lg">
          {t('info_page.contact')} <span className="text-green-600 dark:text-green-400">627-52-63-80</span>.
        </p>

        {/* Imagen dentro del contenido */}
        <div className="my-8 flex justify-center">
          <img
            src={CorazonHarina}
            alt="Bollo Pulguita"
            className="w-full max-w-md rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => handleImageClick(CorazonHarina)}
          />
        </div>

        <div className="border-t-2 border-dashed border-gray-300 dark:border-slate-600 my-8"></div>

        <h3 className="text-2xl font-bold text-center text-amber-700 dark:text-amber-500 mb-6 font-serif">
          {t('info_page.tips_title')}
        </h3>

        <div className="bg-blue-50 dark:bg-slate-700/50 p-6 rounded-xl border border-blue-100 dark:border-slate-600 space-y-4">
          <p>
            {t('info_page.tip1')}
          </p>
          <p>
            {t('info_page.tip2')}
          </p>
          <p className="font-semibold text-blue-800 dark:text-blue-300">
            {t('info_page.tip3')}
          </p>
        </div>

        {/* Galería de imágenes final */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {[BollosPulguitas, Bolloswenos, PandeAjo, PandeCacao, PandeOliva, Pulguitascenteno].map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Galería ${index}`}
              className="rounded-lg shadow-md hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>

      </div>

      {/* Modal para imagen ampliada */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 cursor-pointer"
          >
            <motion.img
              src={selectedImage}
              alt="Ampliada"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white bg-gray-800 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InformacionPage;
