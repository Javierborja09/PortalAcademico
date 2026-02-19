import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  LayoutDashboard, 
  Clock, 
  Star, 
  ArrowUpRight,
  TrendingUp 
} from "lucide-react";
import { useActividad } from "@/hooks/useActividad";
import { 
  BarChart, 
  Bar, 
  ResponsiveContainer, 
  YAxis, 
  XAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  LabelList 
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const nombre = localStorage.getItem("nombre") || "Usuario";
  const { actividades, loading } = useActividad();
  const [favCursos, setFavCursos] = useState([]);

  // 1. Lógica para cargar y sincronizar Favoritos
  useEffect(() => {
    const cargarFavoritos = () => {
      const nombresFavoritos = JSON.parse(localStorage.getItem("fav_cursos")) || [];
      // Solo mostramos los nombres que realmente existen en nuestras actividades
      const cursosDisponibles = [...new Set(actividades.map(a => a.nombreCurso))];
      const filtrados = cursosDisponibles.filter(nombre => nombresFavoritos.includes(nombre));
      setFavCursos(filtrados);
    };

    cargarFavoritos();

    //esscuchar cambios en otras pestañas o componentes
    window.addEventListener('storage', cargarFavoritos);
    return () => window.removeEventListener('storage', cargarFavoritos);
  }, [actividades]);

  //Datos procesados para el mini gráfico de rendimiento
  const ultimasNotas = actividades
    .filter(a => a.tipo === "evaluacion" && a.nota !== null && a.nota !== undefined)
    .slice(0, 5) 
    .map(n => ({
      ...n,
      shortName: n.nombreCurso?.length > 12 ? n.nombreCurso.substring(0, 10) + "..." : n.nombreCurso,
      nota: parseFloat(n.nota)
    }))
    .reverse();

  return (
    <div className="animate-fadeIn pb-10">
      {/* --- ENCABEZADO --- */}
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden sm:block">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                Panel Principal
              </h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                Bienvenido, {nombre}. Gestiona tu éxito académico hoy.
              </p>
            </div>
          </div>
          <div className="text-right text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-[0.2em]">
            Ciclo 2026-I
          </div>
        </div>
      </header>

      {/* --- GRID DE ACCESOS DIRECTOS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Card: Mi Progreso */}
        <button 
          onClick={() => navigate("/progreso")}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm text-left transition-all hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Mi Progreso</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            Analiza tus promedios, descarga reportes y mira tu evolución por curso.
          </p>
        </button>

        {/* Card: Actividad Reciente */}
        <button 
          onClick={() => navigate("/actividad")}
          className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm text-left transition-all hover:shadow-xl hover:border-emerald-200 hover:-translate-y-2 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <ArrowUpRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Actividad</h3>
          <p className="text-slate-500 text-xs font-medium leading-relaxed">
            Revisa tareas pendientes, anuncios de docentes y entregas realizadas.
          </p>
        </button>

        {/* Card: Favoritos (SISTEMA MANUAL) */}
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 shadow-sm group transition-all hover:border-amber-100">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Star size={24} fill={favCursos.length > 0 ? "currentColor" : "none"} />
            </div>
            <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-lg uppercase tracking-widest">
              Mis Accesos
            </span>
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Favoritos</h3>
          
          <div className="space-y-2">
            {favCursos.length > 0 ? (
              favCursos.slice(0, 3).map((curso, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate("/cursos")}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-transparent hover:border-amber-200 hover:bg-white transition-all cursor-pointer group/item"
                >
                  <Star size={12} className="text-amber-400" fill="currentColor" />
                  <span className="text-[10px] font-black text-slate-600 uppercase truncate group-hover/item:text-slate-900">
                    {curso}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-[9px] font-black uppercase leading-tight">
                  Usa la ⭐ en Cursos<br/>para añadir aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/*seccion vissta rapida de rendimiento - */}
      <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                  <LayoutDashboard className="text-blue-600" size={24} />
                  Vista Rápida de Rendimiento
                </h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                  Últimas 5 calificaciones obtenidas
                </p>
            </div>
            <button 
                onClick={() => navigate("/progreso")}
                className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200 w-full sm:w-auto"
            >
                Ver análisis completo
            </button>
        </div>

        <div className="h-[280px] w-full">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : ultimasNotas.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ultimasNotas} margin={{ top: 30, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                    dataKey="shortName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }}
                    dy={15}
                />
                <YAxis domain={[0, 20]} hide />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}}
                    itemStyle={{fontWeight: '900', fontSize: '14px'}}
                />
                <Bar 
                    dataKey="nota" 
                    radius={[12, 12, 12, 12]} 
                    barSize={50}
                >
                  {ultimasNotas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.nota >= 13 ? '#3b82f6' : '#ef4444'} />
                  ))}
                  <LabelList 
                    dataKey="nota" 
                    position="top" 
                    style={{ fill: '#1e293b', fontSize: 12, fontWeight: '900' }} 
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                <TrendingUp size={48} className="mb-3 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center px-4">
                  No hay evaluaciones calificadas recientemente
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;