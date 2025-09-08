<div className="flex space-x-2 mt-2">
  {opciones.map((opcion) => {
    const isSelected = selectedOpciones === opcion;
    return (
      <button
        key={opcion}
        onClick={() => onSelectOpcion(opcion)}
        className={`px-4 py-2 rounded-full border transition-all duration-200 font-medium ${
          isSelected
            ? 'bg-amber-500 text-white border-amber-500 shadow-lg'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        }`}
      >
        {opcion}
      </button>
    );
  })}
</div>
