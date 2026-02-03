import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Usuarios from './pages/admin/Usuarios';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute'; // <--- El nuevo guardián
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS SOLO PARA NO LOGUEADOS */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* RUTAS PROTEGIDAS CON LAYOUT (Sidebar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;