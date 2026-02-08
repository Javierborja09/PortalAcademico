import React from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useSidebar } from "@/hooks/useSidebar";
import SidebarItem from "@/components/SidebarItem";
import Avatar from "@/components/common/Avatar";
const Sidebar = () => {
  const {
    foto,
    nombre,
    rol,
    isOpen,
    toggleSidebar,
    handleLogout,
    menuFiltrado,
    currentPath,
  } = useSidebar();

  return (
    <>
      {/* BOTÓN MÓVIL */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-2xl"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950 text-white flex flex-col z-40 transition-all duration-300 border-r border-slate-800/50 ${isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0"} lg:w-64`}
      >
        {/* SECCIÓN DE PERFIL */}
        <div className="p-8 text-center">
          <div className="relative inline-block group">
            {/* Efecto de resplandor dinámico */}
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>

            {/* USAMOS EL COMPONENTE GLOBAL AVATAR */}
            <Avatar
              src={foto}
              type="perfil"
              className="relative w-20 h-20 rounded-full border-2 border-slate-800 group-hover:scale-105"
              alt="Avatar de usuario"
            />

            {/* Indicador de estado (Online) */}
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full shadow-lg"></div>
          </div>

          <h2 className="mt-4 font-bold text-slate-100 truncate px-2 leading-tight">
            {nombre}
          </h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1 italic opacity-80">
            {rol}
          </p>
        </div>

        {/* NAVEGACIÓN DINÁMICA */}
        <nav className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-2">
          {menuFiltrado.map((group, gIdx) => (
            <div key={gIdx} className="animate-fadeIn">
              <header className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">
                {group.group}
              </header>
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentPath.startsWith(item.to)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* FOOTER - CERRAR SESIÓN */}
        <div className="p-4 bg-slate-900/30 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest group"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
