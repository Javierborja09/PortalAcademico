import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Perfil from "@/pages/Perfil";
import Cursos from "@/pages/general/Cursos";
import Horarios from "@/pages/admin/Horarios";
import Usuarios from "@/pages/admin/Usuarios";
import NotFound from "@/pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import MainLayout from "@/components/MainLayout";
import RoleRoute from "@/components/RoleRoute";
import AulaVirtual from "@/pages/general/AulaVirtual";
import AulaSesion from "@/pages/general/AulaSesion";
import Horario from "@/pages/general/Horario";
function App() {
  return (
    <Router>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* RUTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}>
          {/* 🟢 RUTA DE SESIÓN (FUERA DEL LAYOUT PARA PANTALLA COMPLETA) */}
          <Route path="/aula-virtual/:id/sesion" element={<AulaSesion />} />

          {/* RUTAS CON BARRA LATERAL (MAINLAYOUT) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/horario" element={<Horario />} />
            <Route path="/aula-virtual/:id" element={<AulaVirtual />} />

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
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
