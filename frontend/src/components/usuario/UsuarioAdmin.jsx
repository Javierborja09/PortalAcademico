import React from 'react';
import { X, Save, Loader2, Mail, Shield, Camera, Lock, ShieldAlert } from 'lucide-react';
import { useUsuarioAdmin } from '@/hooks/useUsuarioAdmin';
import Avatar from '@/components/common/Avatar';

const UsuarioAdmin = ({ isOpen, onClose, usuario = null, onSave }) => {
    const {
        formData, loading, errorServer, preview,
        handleChange, handleFileChange, handleSubmit
    } = useUsuarioAdmin(usuario, isOpen, onClose, onSave);

    if (!isOpen) return null;

    const roles = ['alumno', 'docente', 'admin'];

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
            
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                
                <header className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Gestión de accesos</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </header>

                <div className="p-10">
                    {errorServer && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                            <ShieldAlert size={20} />
                            <p className="text-xs font-black uppercase tracking-tight leading-none">{errorServer}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Avatar Picker con Componente Global */}
                        <div className="md:col-span-2 flex justify-center mb-6">
                            <div className="relative group">
                                <Avatar 
                                    src={preview} 
                                    type="perfil" 
                                    className="w-32 h-32 rounded-full border-4 border-slate-50"
                                    alt="Vista previa"
                                />
                                <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white cursor-pointer shadow-xl hover:bg-blue-700 border-4 border-white transition-all active:scale-90">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre</label>
                            <input name="nombre" required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.nombre} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Apellido</label>
                            <input name="apellido" required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.apellido} onChange={handleChange} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Mail size={12}/> Correo Electrónico</label>
                            <input name="correo" required type="email" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.correo} onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Shield size={12}/> Rol</label>
                            <select name="rol" required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                                value={formData.rol} onChange={handleChange}>
                                <option value="">Seleccionar...</option>
                                {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Lock size={12}/> Contraseña</label>
                            <input name="contrasena" required={!usuario} type="password" 
                                placeholder={usuario ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.contrasena} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="mt-10">
                        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:bg-slate-100 disabled:text-slate-300">
                            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                            {usuario ? 'Guardar Cambios' : 'Registrar Usuario'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UsuarioAdmin;