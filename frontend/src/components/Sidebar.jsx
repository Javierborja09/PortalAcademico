import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Importamos los iconos de Lucide
import { 
  LayoutDashboard, 
  User, 
  Users, 
  BookOpen, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const API_BASE = "http://localhost:8080";

    const [foto, setFoto] = useState(localStorage.getItem('foto'));
    const [nombre] = useState(localStorage.getItem('nombre'));
    const [rol] = useState(localStorage.getItem('rol'));
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const actualizarDatos = () => setFoto(localStorage.getItem('foto'));
        window.addEventListener('perfilActualizado', actualizarDatos);
        return () => window.removeEventListener('perfilActualizado', actualizarDatos);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white';

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
                <div 
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 lg:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside className={`
                fixed left-0 top-0 h-screen bg-slate-950 text-white flex flex-col z-40
                transition-all duration-300 ease-in-out border-r border-slate-800/50
                ${isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'} 
                lg:w-64
            `}>
                
                {/* PERFIL EXPANDIDO */}
                <div className="p-8 text-center">
                    <div className="relative inline-block group">
                        <div className="absolute -inset-1.5 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <img 
                            src={foto && foto !== 'null' 
                                ? `${API_BASE}${foto}?t=${Date.now()}` 
                                : `${API_BASE}/uploads/profiles/default.png`} 
                            alt="Avatar" 
                            className="relative w-20 h-20 rounded-full border-2 border-slate-800 object-cover mx-auto transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.target.src = `${API_BASE}/uploads/profiles/default.png`; }}
                        />
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-4 border-slate-950 rounded-full"></div>
                    </div>
                    
                    <h2 className="mt-4 font-bold text-slate-100 tracking-tight">{nombre}</h2>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1 opacity-80">
                        {rol}
                    </p>
                </div>

                {/* MENÚ */}
                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <header className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4 mt-2">
                        Navegación
                    </header>
                    
                    <Link to="/dashboard" className={`group flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/dashboard')}`}>
                        <div className="flex items-center space-x-3">
                            <LayoutDashboard size={18} strokeWidth={2.5} />
                            <span className="text-sm font-bold">Dashboard</span>
                        </div>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <Link to="/perfil" className={`group flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/perfil')}`}>
                        <div className="flex items-center space-x-3">
                            <User size={18} strokeWidth={2.5} />
                            <span className="text-sm font-bold">Mi Perfil</span>
                        </div>
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    {rol === 'admin' && (
                        <div className="pt-6 mt-6 border-t border-slate-800/50">
                            <header className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] mb-4">
                                Gestión
                            </header>
                            <Link to="/admin/usuarios" className={`group flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/admin/usuarios')}`}>
                                <div className="flex items-center space-x-3">
                                    <Users size={18} strokeWidth={2.5} />
                                    <span className="text-sm font-bold">Usuarios</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <Link to="/admin/cursos" className={`group flex items-center justify-between p-3 rounded-xl transition-all ${isActive('/admin/cursos')}`}>
                                <div className="flex items-center space-x-3">
                                    <BookOpen size={18} strokeWidth={2.5} />
                                    <span className="text-sm font-bold">Cursos</span>
                                </div>
                                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                        </div>
                    )}
                </nav>

                {/* BOTÓN SALIR */}
                <div className="p-4 bg-slate-900/20">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-xs font-black uppercase tracking-widest"
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;