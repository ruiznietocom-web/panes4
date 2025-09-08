import React, { useState } from 'react';

const PanCortado = () => {
  const [corte, setCorte] = useState("Normal"); // por defecto "Normal"

  const opciones = ["Normal", "Fino", "Grueso"];

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Pan Cortado</h3>
      <div className="flex gap-2">
        {opciones.map((op) => (
          <button
            key={op}
            onClick={() => setCorte(op)}
            className={`px-3 py-1 text-xs rounded-lg border transition-all 
              ${corte === op ? "bg-amber-500 text-white" : "hover:bg-amber-100"}`}
          >
            {op}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm text-gray-600">
        Opción seleccionada: <span className="font-semibold">{corte}</span>
      </p>
    </div>
  );
};

export default PanCortado;
