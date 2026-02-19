import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "@/services/userService";

/**
 * Hook personalizado para gestionar la lógica de autenticación.
 * Maneja estados de carga, errores y persistencia de sesión.
 */
export const useAuth = () => {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    /**
     * Procesa el inicio de sesión y guarda los datos en localStorage.
     * @param {Event} e - Evento del formulario.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const data = await loginService(correo, password);

            // Persistencia de datos de sesión
            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol);
            localStorage.setItem("nombre", data.nombre);
            localStorage.setItem("apellido", data.apellido);
            localStorage.setItem("foto", data.foto);
            localStorage.setItem("userId", data.userId);

            // Redirección al área privada
            navigate("/dashboard");
        } catch (err) {
            const serverMessage =
                err.response?.data?.message || "Error de conexión con el servidor";
            setError(serverMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        correo,
        setCorreo,
        password,
        setPassword,
        error,
        isLoading,
        handleLogin
    };
};