import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const token = localStorage.getItem('token');

    // Si hay token, lo mandamos al dashboard para que no vea el login
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    // Si no hay token, lo dejamos pasar al Login
    return <Outlet />;
};

export default PublicRoute;