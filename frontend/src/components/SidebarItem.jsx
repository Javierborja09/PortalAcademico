import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Componente individual para los elementos de navegación del Sidebar.
 * @param {string} to - Ruta de destino.
 * @param {React.ElementType} icon - Icono de Lucide-React.
 * @param {string} label - Texto a mostrar.
 * @param {boolean} isActive - Estado de activación basado en la ruta actual.
 * @param {Function} onClick - Función opcional (útil para cerrar el sidebar en móvil).
 */
const SidebarItem = ({ to, icon: Icon, label, isActive, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* El strokeWidth más grueso le da un aspecto más moderno/UI */}
        <Icon size={18} strokeWidth={2.5} />
        <span className="text-sm font-bold">{label}</span>
      </div>

      {/* Indicador de flecha que aparece solo al estar activo o en hover */}
      <ChevronRight
        size={14}
        className={`transition-all duration-300 ${
          isActive 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
        }`}
      />
    </Link>
  );
};

export default SidebarItem;