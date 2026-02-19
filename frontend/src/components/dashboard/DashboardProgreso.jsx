import React, { useState, useMemo } from 'react';
import { 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Target, BookOpen, Award, TrendingUp, Zap, Filter } from 'lucide-react';

const DashboardProgreso = ({ actividades }) => {
    const [cursoSeleccionado, setCursoSeleccionado] = useState('todos');

    //procesar datos para el gráfico 
    const datosProcesados = useMemo(() => {
        const filtradas = actividades
            .filter(a => a.tipo === "evaluacion" && a.nota !== null && a.nota !== undefined)
            .map(ev => ({
                name: ev.tituloEvaluacion || ev.titulo || "Ev",
                nota: parseFloat(ev.nota),
                curso: ev.nombreCurso
            }))
            .reverse();

        if (cursoSeleccionado === 'todos') return filtradas;
        return filtradas.filter(a => a.curso === cursoSeleccionado);
    }, [actividades, cursoSeleccionado]);

    //obtener lista de cursos únicos para el filtro
    const listaCursos = useMemo(() => {
        const cursos = actividades.map(a => a.nombreCurso).filter(Boolean);
        return ['todos', ...new Set(cursos)];
    }, [actividades]);

    //Ddatos para el gráfico de Pastel distribucion
    const datosPie = useMemo(() => {
        const rangos = { sobresaliente: 0, aprobado: 0, bajo: 0 };
        datosProcesados.forEach(d => {
            if (d.nota >= 17) rangos.sobresaliente++;
            else if (d.nota >= 13) rangos.aprobado++;
            else rangos.bajo++;
        });
        return [
            { name: 'Excelente (17-20)', value: rangos.sobresaliente, color: '#10b981' },
            { name: 'Regular (13-16)', value: rangos.aprobado, color: '#3b82f6' },
            { name: 'Bajo (0-12)', value: rangos.bajo, color: '#ef4444' }
        ].filter(d => d.value > 0);
    }, [datosProcesados]);

    //  ls metricasa
    const promedio = datosProcesados.length > 0 
        ? (datosProcesados.reduce((acc, curr) => acc + curr.nota, 0) / datosProcesados.length).toFixed(1)
        : "0.0";

    return (
        <div className="w-full space-y-8 animate-fadeIn">
            {/* SELECTOR DE CURSO PROFESIONAL */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 px-4">
                    <Filter size={18} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Filtrar por materia:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {listaCursos.map(curso => (
                        <button
                            key={curso}
                            onClick={() => setCursoSeleccionado(curso)}
                            className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border-2 ${
                                cursoSeleccionado === curso 
                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-500'
                            }`}
                        >
                            {curso}
                        </button>
                    ))}
                </div>
            </div>

            {/* grid de metricass */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard icon={<Target className="text-blue-600" />} label="Promedio" value={promedio} color="bg-blue-50" />
                <MetricCard icon={<Award className="text-emerald-600" />} label="Nivel" value={parseFloat(promedio) >= 13 ? "Apto" : "En Riesgo"} color="bg-emerald-50" />
                <MetricCard icon={<Zap className="text-purple-600" />} label="Muestras" value={datosProcesados.length} color="bg-purple-50" />
            </div>

            {/* loss grafivcos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Tendencia Temporal area */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border-2 border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
                        <TrendingUp size={16} /> Tendencia de Calificaciones
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={datosProcesados}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" hide />
                                <YAxis domain={[0, 20]} stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="nota" stroke="#3b82f6" strokeWidth={4} fill="#3b82f6" fillOpacity={0.05} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribución (Pie Chart) */}
                <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-8">Distribución</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={datosPie}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {datosPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{value}</p>
        </div>
    </div>
);

export default DashboardProgreso;