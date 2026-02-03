import React, { useState, useEffect } from 'react';
import { updateProfile } from '../services/userService';
import { User, ShieldCheck, Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Perfil = () => {
    const [user, setUser] = useState({
        nombre: localStorage.getItem('nombre') || '',
        rol: localStorage.getItem('rol') || '',
        foto: localStorage.getItem('foto') || ''
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    const API_BASE = "http://localhost:8080";
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ texto: '', tipo: '' });

        const formData = new FormData();
        if (selectedFile) formData.append('foto', selectedFile);

        try {
            const response = await updateProfile(userId, formData);
            const nuevaFotoUrl = response.data.foto;

            if (nuevaFotoUrl) {
                localStorage.setItem('foto', nuevaFotoUrl);
                setUser(prev => ({ ...prev, foto: nuevaFotoUrl }));
                window.dispatchEvent(new Event('perfilActualizado'));
            }

            setSelectedFile(null); 
            setMensaje({ texto: '¡Identidad actualizada con éxito!', tipo: 'success' });
        } catch (error) {
            setMensaje({ texto: 'No se pudo actualizar el perfil.', tipo: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn flex justify-center items-start pt-10 px-4 pb-20">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* LADO IZQUIERDO: Tarjeta de Identidad (Visual) */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-center relative overflow-hidden shadow-2xl">
                        {/* Círculos decorativos de fondo */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full -ml-16 -mb-16 blur-3xl"></div>

                        <div className="relative inline-block mb-6">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full opacity-30 blur-md"></div>
                            <img 
                                src={preview || (user.foto && user.foto !== 'null' ? `${API_BASE}${user.foto}?t=${Date.now()}` : `${API_BASE}/uploads/profiles/default.png`)} 
                                alt="Avatar" 
                                className="relative w-40 h-40 rounded-full object-cover border-4 border-slate-800 shadow-2xl"
                            />
                            <label className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-2xl cursor-pointer shadow-xl transition-all active:scale-90 border-4 border-slate-900">
                                <Camera size={20} strokeWidth={2.5} />
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>

                        <h2 className="text-2xl font-black text-white tracking-tight">{user.nombre}</h2>
                        <div className="inline-flex items-center gap-2 mt-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <ShieldCheck size={14} />
                            {user.rol}
                        </div>
                    </div>

                    {/* Mensajes de Estado */}
                    {mensaje.texto && (
                        <div className={`p-5 rounded-[2rem] border flex items-center gap-3 animate-slideUp ${
                            mensaje.tipo === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
                        }`}>
                            {mensaje.tipo === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            <span className="text-sm font-black uppercase tracking-tight">{mensaje.texto}</span>
                        </div>
                    )}
                </div>

                {/* LADO DERECHO: Formulario de Configuración */}
                <div className="lg:col-span-7 bg-white rounded-[3rem] p-12 border border-slate-100 shadow-sm">
                    <header className="mb-10">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración</h1>
                        <p className="text-slate-400 font-medium">Información personal registrada en el sistema</p>
                    </header>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="group space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <User size={14} /> Nombre Completo
                                </label>
                                <input 
                                    type="text" 
                                    value={user.nombre} 
                                    disabled 
                                    className="w-full p-5 bg-slate-50 border-transparent rounded-[1.5rem] text-slate-600 font-bold cursor-not-allowed group-hover:bg-slate-100 transition-colors" 
                                />
                            </div>

                            <div className="group space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <ShieldCheck size={14} /> Rango Académico
                                </label>
                                <input 
                                    type="text" 
                                    value={user.rol} 
                                    disabled 
                                    className="w-full p-5 bg-slate-50 border-transparent rounded-[1.5rem] text-slate-600 font-bold uppercase cursor-not-allowed group-hover:bg-slate-100 transition-colors" 
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                disabled={loading || !selectedFile}
                                className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-3 ${
                                    loading || !selectedFile 
                                    ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                                    : 'bg-slate-900 hover:bg-blue-600 text-white shadow-2xl shadow-slate-200 active:scale-95'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Procesando
                                    </>
                                ) : (
                                    'Guardar Cambios'
                                )}
                            </button>
                            <p className="text-center text-[10px] text-slate-400 mt-6 font-bold uppercase tracking-widest">
                                * Los datos personales son gestionados por el administrador
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Perfil;