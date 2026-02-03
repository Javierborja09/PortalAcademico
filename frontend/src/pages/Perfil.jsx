import React, { useState, useEffect } from 'react';
import { updateProfile } from '../services/userService';

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
        if (selectedFile) {
            formData.append('foto', selectedFile);
        }

        try {
            const response = await updateProfile(userId, formData);
            const nuevaFotoUrl = response.data.foto;

            if (nuevaFotoUrl) {
                localStorage.setItem('foto', nuevaFotoUrl);
                
                setUser(prev => ({ ...prev, foto: nuevaFotoUrl }));

                window.dispatchEvent(new Event('perfilActualizado'));
            }

            setSelectedFile(null); 
            setMensaje({ texto: '¡Perfil actualizado al instante!', tipo: 'success' });

        } catch (error) {
            setMensaje({ texto: 'Error al actualizar el perfil.', tipo: 'error' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn flex justify-center items-start pt-4">
            <div className="max-w-2xl w-full bg-white shadow-sm border border-gray-100 rounded-[2.5rem] p-10">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mi Perfil</h1>
                    <p className="text-slate-500 font-medium">Gestiona tu identidad en la plataforma</p>
                </header>
                
                {mensaje.texto && (
                    <div className={`mb-8 p-4 rounded-2xl text-sm font-bold text-center ${
                        mensaje.tipo === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                        {mensaje.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="flex flex-col items-center bg-slate-50 p-8 rounded-[2rem] border border-dashed border-slate-200">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img 
                                src={preview || (user.foto && user.foto !== 'null' ? `${API_BASE}${user.foto}?t=${Date.now()}` : `${API_BASE}/uploads/profiles/default.png`)} 
                                alt="Avatar" 
                                className="relative w-44 h-44 rounded-full object-cover border-4 border-white shadow-2xl transition group-hover:scale-105"
                            />
                            <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                                <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    Cambiar Foto
                                </div>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                            <input type="text" value={user.nombre} disabled className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Rol Asignado</label>
                            <input type="text" value={user.rol} disabled className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold uppercase cursor-not-allowed" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !selectedFile}
                        className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-blue-100 ${
                            loading || !selectedFile ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
                        }`}
                    >
                        {loading ? 'Sincronizando...' : 'Actualizar mi perfil'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Perfil;