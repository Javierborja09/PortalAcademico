import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importaciones
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Perfil from './pages/Perfil';
import Cursos from './pages/general/Cursos';
import Horarios from './pages/admin/Horarios';
import Usuarios from './pages/admin/Usuarios';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import MainLayout from './components/MainLayout';
import RoleRoute from './components/RoleRoute'; // <--- IMPORTANTE
import AulaVirtual from './pages/general/AulaVirtual';

// ... dentro de las rutas protegidas

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* RUTAS PROTEGIDAS CON MAINLAYOUT */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Cursos es para todos (Admin, Docente, Alumno) */}
            <Route path="/cursos" element={<Cursos />} /> 
<Route path="/aula-virtual/:id" element={<AulaVirtual />} />
            {/* 🛡️ BLOQUEO DE RUTAS ADMINISTRATIVAS */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin/usuarios" element={<Usuarios />} />
              <Route path="/admin/horarios" element={<Horarios />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;