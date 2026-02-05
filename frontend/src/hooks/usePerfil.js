import { useState, useEffect } from "react";
import { updateProfile } from "@/services/userService";
/**
 * Hook personalizado para la gestión del perfil de usuario.
 * Maneja la previsualización de archivos, carga de datos y sincronización con localStorage.
 */
export const usePerfil = () => {
    const [user, setUser] = useState({
        nombre: localStorage.getItem("nombre") || "",
        rol: localStorage.getItem("rol") || "",
        foto: localStorage.getItem("foto") || "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

    const userId = localStorage.getItem("userId");

    // Generar URL de previsualización cuando se selecciona un archivo
    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);

        // Limpieza de memoria al desmontar o cambiar archivo
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje({ texto: "", tipo: "" });

        const formData = new FormData();
        if (selectedFile) formData.append("foto", selectedFile);

        try {
            const response = await updateProfile(userId, formData);
            const nuevaFotoUrl = response.data.foto;

            if (nuevaFotoUrl) {
                // Sincronización con almacenamiento local
                localStorage.setItem("foto", nuevaFotoUrl);
                setUser((prev) => ({ ...prev, foto: nuevaFotoUrl }));
                
                // Notificar a otros componentes (como el Sidebar)
                window.dispatchEvent(new Event("perfilActualizado"));
            }

            setSelectedFile(null);
            setMensaje({
                texto: "¡Identidad actualizada con éxito!",
                tipo: "success",
            });
        } catch (error) {
            setMensaje({ texto: "No se pudo actualizar el perfil.", tipo: "error" });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        preview,
        loading,
        mensaje,
        selectedFile,
        handleFileChange,
        handleSubmit
    };
};