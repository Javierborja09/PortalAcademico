import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "@/config/sidebarConfig";

export const useSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Estado del perfil
    const [foto, setFoto] = useState(localStorage.getItem("foto"));
    const nombre = localStorage.getItem("nombre") || "Usuario";
    const rol = localStorage.getItem("rol")?.toLowerCase() || "alumno";

    // Estado de la interfaz (Móvil)
    const [isOpen, setIsOpen] = useState(false);

    // Listener para cambios en el perfil (desde el componente Perfil)
    useEffect(() => {
        const actualizarDatos = () => setFoto(localStorage.getItem("foto"));
        window.addEventListener("perfilActualizado", actualizarDatos);
        return () => window.removeEventListener("perfilActualizado", actualizarDatos);
    }, []);

    // Cerrar sidebar automáticamente al cambiar de ruta
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const toggleSidebar = () => setIsOpen(!isOpen);

    // Filtrar los items del menú según el rol actual
    const menuFiltrado = MENU_ITEMS.map(group => ({
        ...group,
        items: group.items.filter(item => item.roles.includes(rol))
    })).filter(group => group.items.length > 0);

    return {
        foto,
        nombre,
        rol,
        isOpen,
        toggleSidebar,
        handleLogout,
        menuFiltrado,
        currentPath: location.pathname
    };
};