// src/config/sidebarConfig.js
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  CalendarClock,
  ClipboardList,
  TrendingUp 
} from "lucide-react";

export const MENU_ITEMS = [
  {
    group: "Navegación",
    items: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "docente", "alumno"],
      },
      {
        to: "/cursos",
        label: "Mis Cursos",
        icon: BookOpen,
        roles: ["admin", "docente", "alumno"],
      },
      {
        to: "/actividad",
        label: "Actividad",
        icon: ClipboardList,
        roles: ["alumno"],
      },
      {
        to: "/progreso", 
        label: "Mi Progreso",
        icon: TrendingUp, 
        roles: ["alumno"],
      },
      {
        to: "/horario",
        label: "Mi Horario",
        icon: CalendarClock,
        roles: ["docente", "alumno"],
      },
      {
        to: "/perfil",
        label: "Mi Perfil",
        icon: User,
        roles: ["admin", "docente", "alumno"],
      },
    ],
  },
  {
    group: "Gestión",
    items: [
      {
        to: "/admin/usuarios",
        label: "Usuarios",
        icon: Users,
        roles: ["admin"],
      },
      {
        to: "/admin/horarios",
        label: "Horarios",
        icon: CalendarClock,
        roles: ["admin"],
      },
    ],
  },
];