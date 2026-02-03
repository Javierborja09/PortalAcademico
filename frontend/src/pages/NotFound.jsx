import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center relative overflow-hidden">
            {/* Luces de fondo estilo Cyberpunk */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[150px]"></div>

            <div className="relative z-10 text-center px-4">
                {/* El "404" con glitch y degradado */}
                <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-800 drop-shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                    404
                </h1>
                
                <div className="mt-[-20px]">
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        Página no encontrada
                    </h2>
                    <p className="text-gray-400 text-lg max-w-md mx-auto mb-10">
                        Parece que te has aventurado en una zona fuera del mapa académico. No te preocupes, te ayudamos a volver.
                    </p>

                    {/* Botón Estilizado */}
                    <button 
                        onClick={() => navigate('/')}
                        className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-blue-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg shadow-blue-500/30 hover:bg-blue-500 active:scale-95"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>

            {/* Decoración de líneas de código falsas en el fondo */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none font-mono text-[10px] text-blue-400 leading-relaxed overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div key={i}>
                        const error = "Not Found"; if (page === null) throw new Error(404);
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotFound;