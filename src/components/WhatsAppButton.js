import React from "react";
import { FaWhatsapp, FaUser } from "react-icons/fa";

const WhatsAppButton = () => {
  const message = "Hola, ";

  const phoneNumber = "627526380"; // Cambia por tu número de WhatsApp

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center z-50">


      {/* Botón de WhatsApp */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 flex justify-center items-center rounded-full shadow-lg transition-all duration-30000 animate-pulse snow-cap"
        title="Enviar mensaje por WhatsApp"
      >
        <FaWhatsapp className="w-8 h-8" />
      </a>

      {/* Texto con icono debajo */}
      <div className="mt-1 flex items-center gap-1 bg-white/50 text-gray-800 px-2 py-1 rounded-full shadow-sm border border-gray-400">
        <FaUser className="w-3 h-4" />
        <span className="text-xs font-medium">Puedo ayudarte?</span>
      </div>
    </div>
  );
};

export default WhatsAppButton;
