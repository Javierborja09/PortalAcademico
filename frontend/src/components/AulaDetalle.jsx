import React from 'react';

const AulaDetalle = ({ isOpen, onClose, curso }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-[3rem] p-12 shadow-2xl animate-slideUp" onClick={e => e.stopPropagation()}>
        <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Información Académica</h2>
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-[10px] font-black text-blue-600 uppercase mb-2">Descripción</p>
            <p className="text-slate-600 font-medium">Entorno virtual de {curso?.nombreCurso}.</p>
          </div>
        </div>
        <button onClick={onClose} className="mt-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all shadow-xl">
          Entendido
        </button>
      </div>
    </div>
  );
};

export default AulaDetalle;