import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const AnuncioCard = ({ anuncio, esDocente, hoy, onEditar, onEliminar }) => {
    const esAnuncioFuturo = anuncio.fechaPublicacion > hoy;

    return (
        <div
            className={`p-4 rounded-2xl relative group transition-all border ${
                esAnuncioFuturo 
                    ? 'bg-amber-50/40 border-dashed border-amber-200' 
                    : 'bg-blue-50 border-blue-100'
            }`}
        >
            {esDocente && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEditar(anuncio)} 
                        className="p-1.5 bg-white text-blue-600 hover:bg-blue-100 rounded-lg shadow-sm border border-blue-100"
                        title="Editar anuncio"
                    >
                        <Pencil size={14} />
                    </button>
                    <button 
                        onClick={() => onEliminar(anuncio.id_anuncio)} 
                        className="p-1.5 bg-white text-red-500 hover:bg-red-100 rounded-lg shadow-sm border border-red-100"
                        title="Eliminar anuncio"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}
            
            <p className="text-sm font-black text-slate-800 pr-12">
                {anuncio.titulo}
            </p>
            
            <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">
                {anuncio.contenido}
            </p>
            
            <p className={`text-[10px] font-bold uppercase mt-3 ${
                esAnuncioFuturo ? 'text-amber-600' : 'text-slate-400'
            }`}>
                {esAnuncioFuturo ? '🕒 Se publicará: ' : '✅ Publicado: '} 
                {anuncio.fechaPublicacion}
            </p>
        </div>
    );
};

export default AnuncioCard;