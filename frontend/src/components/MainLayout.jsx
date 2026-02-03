import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#f8f9fa]">
            {/* Sidebar con su propia lógica interna de z-index y posición */}
            <Sidebar />

            {/* Ajustamos el margen para que sea dinámico */}
            <main className="flex-1 transition-all duration-300 min-w-0 lg:pl-64">
                {/* lg:pl-64 -> Solo aplica margen cuando el Sidebar está visible (Escritorio)
                   min-w-0  -> Evita que el contenido rompa el flexbox en tablas
                */}
                <div className="p-4 md:p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;