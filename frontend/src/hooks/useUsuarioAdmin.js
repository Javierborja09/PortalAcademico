import { useState, useEffect } from 'react';
import { saveUsuario } from '@/services/userService';

export const useUsuarioAdmin = (usuario, isOpen, onClose, onSave) => {
    const [loading, setLoading] = useState(false);
    const [errorServer, setErrorServer] = useState(null);
    const [foto, setFoto] = useState(null);
    const [preview, setPreview] = useState(null);

    const initialFormState = {
        nombre: '',
        apellido: '',
        correo: '',
        contrasena: '',
        rol: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setErrorServer(null);
            if (usuario) {
                setFormData({
                    nombre: usuario.nombre || '',
                    apellido: usuario.apellido || '',
                    correo: usuario.correo || '',
                    contrasena: '', 
                    rol: usuario.rol?.toLowerCase() || ''
                });
                setPreview(usuario.foto_perfil); // Pasamos solo la ruta, Avatar hará el resto
            } else {
                setFormData(initialFormState);
                setPreview(null);
            }
            setFoto(null);
        }
    }, [isOpen, usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFoto(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorServer(null);

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('correo', formData.correo);
        data.append('rol', formData.rol);
        
        if (formData.contrasena) data.append('password', formData.contrasena);
        if (foto) data.append('foto', foto);

        try {
            await saveUsuario(usuario?.id_usuario, data);
            if (onSave) onSave(); 
            onClose();
        } catch (err) {
            setErrorServer(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        errorServer,
        preview,
        handleChange,
        handleFileChange,
        handleSubmit
    };
};