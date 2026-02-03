import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, User, Users, BookOpen, 
  LogOut, Menu, X, ChevronRight, CalendarClock,
} from "lucide-react";

// Componente para los items del menú
const SidebarItem = ({ to, icon: Icon, label, isActive, onClick }) => (
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
      <Icon size={18} strokeWidth={2.5} />
      <span className="text-sm font-bold">{label}</span>
    </div>
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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = "http://localhost:8080";

  const [foto, setFoto] = useState(localStorage.getItem("foto"));
  const [nombre] = useState(localStorage.getItem("nombre"));
  const [rol] = useState(localStorage.getItem("rol")?.toLowerCase()); // Normalizamos a minúsculas
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const actualizarDatos = () => setFoto(localStorage.getItem("foto"));
    window.addEventListener("perfilActualizado", actualizarDatos);
    return () => window.removeEventListener("perfilActualizado", actualizarDatos);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* BOTÓN MÓVIL */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-2xl"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR CONTAINER */}
      <aside className={`fixed left-0 top-0 h-screen bg-slate-950 text-white flex flex-col z-40 transition-all duration-300 border-r border-slate-800/50 ${isOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0"} lg:w-64`}>
        
        {/* PERFIL */}
        <div className="p-8 text-center">
          <div className="relative inline-block group">
            <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <img
              src={foto && foto !== "null" ? `${API_BASE}${foto}?t=${Date.now()}` : `${API_BASE}/uploads/profiles/default.png`}
              alt="Avatar"
              className="relative w-20 h-20 rounded-full border-2 border-slate-800 object-cover mx-auto"
              onError={(e) => { e.target.src = `${API_BASE}/uploads/profiles/default.png`; }}
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full"></div>
          </div>
          <h2 className="mt-4 font-bold text-slate-100">{nombre}</h2>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1">{rol}</p>
        </div>

        {/* MENÚ DE NAVEGACIÓN */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <header className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4 mt-2">
            Navegación
          </header>

          <SidebarItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={location.pathname === "/dashboard"}
          />

          {/* CURSOS ACCESIBLES PARA TODOS */}
          <SidebarItem
            to="/cursos"
            icon={BookOpen}
            label="Mis Cursos"
            isActive={location.pathname === "/cursos"}
          />

          <SidebarItem
            to="/perfil"
            icon={User}
            label="Mi Perfil"
            isActive={location.pathname === "/perfil"}
          />

          {/* SECCIÓN ADMINISTRATIVA (Solo para Admin) */}
          {rol === "admin" && (
            <div className="pt-6 mt-6 border-t border-slate-800/50">
              <header className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4">
                Gestión
              </header>
              <SidebarItem
                to="/admin/usuarios"
                icon={Users}
                label="Usuarios"
                isActive={location.pathname === "/admin/usuarios"}
              />
              <SidebarItem
                to="/admin/horarios"
                icon={CalendarClock}
                label="Horarios"
                isActive={location.pathname === "/admin/horarios"}
              />
            </div>
          )}
        </nav>

        {/* BOTÓN SALIR */}
        <div className="p-4 bg-slate-900/20">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-xs font-black uppercase tracking-widest group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;