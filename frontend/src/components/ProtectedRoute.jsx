import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Verificamos el token almacenado
    const token = localStorage.getItem('token');

    // Si no hay token, redirigimos al login
    return token ? <Outlet /> : <Navigate to="/" replace />; 
};

export default ProtectedRoute;