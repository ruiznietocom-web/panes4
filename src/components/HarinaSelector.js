import React, { useState } from "react";
import { harinas } from "../data/products";

const HarinaSelector = ({ selectedHarinas, onToggleHarina, onAddPan }) => {
  const [localSelection, setLocalSelection] = useState([]);

  const handleToggleLocal = (harina) => {
    if (localSelection.find(h => h.id === harina.id)) {
      setLocalSelection(prev => prev.filter(h => h.id !== harina.id));
    } else {
      setLocalSelection(prev => [...prev, harina]);
    }
  };

  const handleAddPan = () => {
    if (localSelection.length === 0) return;
    onAddPan({
      id: Date.now(), // id único para cada pan
      type: "pan",
      selectedHarinas: localSelection.map(h => ({ ...h })),
    });
    setLocalSelection([]); // limpiar selección local después de añadir
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Elige tus Harinas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {harinas.map(harina => {
          const isSelected = localSelection.find(h => h.id === harina.id);
          return (
            <div
              key={harina.id}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-center ${
                isSelected ? "border-yellow-400 bg-yellow-100" : "border-gray-200 hover:border-yellow-300 hover:bg-yellow-50"
              }`}
              onClick={() => handleToggleLocal(harina)}
            >
              <div className="text-4xl mb-2">{harina.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{harina.name}</h3>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={handleAddPan}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-bold rounded-xl shadow-md transition-all duration-300"
        >
          Añadir Pan
        </button>
      </div>
    </div>
  );
};

export default HarinaSelector;
