import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, User, Mail, Shield, Camera, Lock } from 'lucide-react';
import { saveUsuario } from '../../services/userService'; // Importamos tu nuevo servicio

const UsuarioAdmin = ({ isOpen, onClose, usuario = null, onSave }) => {
    const [loading, setLoading] = useState(false);
    
    const initialFormState = {
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        rol: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const roles = ['alumno', 'docente', 'admin'];

    useEffect(() => {
        if (isOpen) {
            if (usuario) {
                setFormData({
                    nombre: usuario.nombre || '',
                    apellido: usuario.apellido || '',
                    correo: usuario.correo || '',
                    contrasena: '', 
                    rol: usuario.rol?.toLowerCase() || ''
                });
                setPreview(usuario.foto_perfil ? `http://localhost:8080${usuario.foto_perfil}` : null);
            } else {
                setFormData(initialFormState);
                setPreview(null);
            }
            setFoto(null);
        }
    }, [isOpen, usuario]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Construimos el FormData campo por campo para que coincida con @RequestParam
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('correo', formData.correo);
        data.append('rol', formData.rol);
        
        // Solo enviamos la contraseña si se ha escrito algo (para cambios o nuevos)
        if (formData.contrasena) {
            data.append('password', formData.contrasena);
        }
        
        if (foto) {
            data.append('foto', foto);
        }

        try {
            // 2. Usamos tu servicio saveUsuario
            await saveUsuario(usuario?.id_usuario, data);
            
            if (onSave) onSave(); 
            onClose();
        } catch (err) {
            console.error("Error al guardar usuario:", err);
            alert(err.response?.data?.mensaje || "Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-fadeIn" onClick={onClose} />
            
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slideUp">
                {/* Cabecera */}
                <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black">{usuario ? 'Editar Perfil' : 'Nuevo Usuario'}</h2>
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Sincronización vía UserService</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Avatar Picker */}
                        <div className="md:col-span-2 flex justify-center mb-6">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                                    {preview ? (
                                        <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-slate-300" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 p-2.5 rounded-full text-white cursor-pointer shadow-xl hover:bg-blue-700 border-4 border-white transition-all active:scale-90">
                                    <Camera size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFoto(file);
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }} />
                                </label>
                            </div>
                        </div>

                        {/* Inputs del Formulario */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nombre</label>
                            <input required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Apellido</label>
                            <input required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Mail size={12}/> Correo Electrónico</label>
                            <input required type="email" className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Shield size={12}/> Rol</label>
                            <select required className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none"
                                value={formData.rol} onChange={e => setFormData({...formData, rol: e.target.value})}>
                                <option value="">Seleccionar...</option>
                                {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Lock size={12}/> Contraseña</label>
                            <input 
                                required={!usuario} // Obligatoria solo para nuevos registros
                                type="password" 
                                placeholder={usuario ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"}
                                className="w-full px-6 py-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                value={formData.contrasena} 
                                onChange={e => setFormData({...formData, contrasena: e.target.value})} 
                            />
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