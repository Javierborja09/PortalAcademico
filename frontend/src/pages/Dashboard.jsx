import React from 'react';
import { GraduationCap, LayoutDashboard, Clock, Star } from 'lucide-react';

const Dashboard = () => {
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const rol = localStorage.getItem('rol')?.toLowerCase();

    return (
        <div className="animate-fadeIn">
            {/* Encabezado de Bienvenida */}
            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden sm:block">
                            <GraduationCap size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                                Panel Principal
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Bienvenido, {nombre}. Gestiona tus actividades académicas de hoy.
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-widest">
                            Ciclo 2026-I
                        </span>
                    </div>
                </div>
            </header>

            {/* Espacio para contenido futuro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Card de Estado - Ejemplo de lo que podrías poner luego */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                        <LayoutDashboard size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Resumen</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Próximamente podrás visualizar tus estadísticas y accesos rápidos aquí.
                    </p>
                </div>

                {/* Card de Actividad */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                        <Clock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Actividad Reciente</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Aquí aparecerán tus últimas notificaciones y cambios en tus cursos.
                    </p>
                </div>

                {/* Card de Destacados */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                        <Star size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Favoritos</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Marca tus asignaturas o documentos importantes para verlos rápido.
                    </p>
                </div>
            </div>

            {/* Placeholder para una sección más grande abajo */}
            <div className="mt-8 p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <LayoutDashboard size={32} className="text-slate-300" />
                </div>
                <h2 className="text-slate-400 font-bold text-lg">Espacio de Trabajo</h2>
                <p className="text-slate-400 text-sm max-w-xs mt-2">
                    Puedes usar este espacio para mostrar calendarios, anuncios globales o el horario del día.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;