import React from 'react';
import { useUsuarios } from '@/hooks/useUsuarios';
import UsuarioItem from '@/components/UsuarioItem';
import UsuarioAdmin from '@/components/UsuarioAdmin';
import { Search, UserPlus, Loader2, Users } from 'lucide-react';

const Usuarios = () => {
    const {
        usuarios, loading, searchTerm, setSearchTerm,
        isModalOpen, selectedUsuario, handleNuevoUsuario,
        handleEditar, handleEliminar, closeModal, refreshUsuarios
    } = useUsuarios();

    return (
        <div className="animate-fadeIn pb-10">
            <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-600 hidden md:block">
                        <Users size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 font-medium">Control administrativo de accesos</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative group flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Buscar por nombre, correo o rol..."
                            className="pl-12 pr-6 py-4 w-full sm:w-72 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all font-medium outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={handleNuevoUsuario}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        <UserPlus size={20} />
                        <span className="whitespace-nowrap">Nuevo Registro</span>
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="hidden md:table-header-group">
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Identidad</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Correo</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Rol</th>
                            <th className="p-6 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] text-right">Gestión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 flex flex-col md:table-row-group">
                        {loading ? (
                            <tr>
                                <td colSpan="4" className="py-32 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em]">Sincronizando...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : usuarios.length > 0 ? (
                            usuarios.map(u => (
                                <UsuarioItem 
                                    key={u.id_usuario} 
                                    usuario={u} 
                                    onEdit={handleEditar}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-24 text-center">
                                    <div className="opacity-30 flex flex-col items-center gap-4">
                                        <Search size={56} className="text-slate-300" />
                                        <p className="text-slate-900 font-black text-lg">Sin coincidencias</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UsuarioAdmin 
                isOpen={isModalOpen}
                onClose={closeModal}
                usuario={selectedUsuario}
                onSave={refreshUsuarios} 
            />
        </div>
    );
};

export default Usuarios;