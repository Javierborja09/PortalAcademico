import api from '@/api/axiosConfig';

/**
 * Autentica a un usuario en el sistema.
 * @param {string} correo - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<Object>} Datos de la sesión (token, rol, nombre).
 */
export const login = async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    return response.data;
};

/**
 * Actualiza el perfil del usuario actual (soporta carga de imágenes).
 * @param {number|string} userId - ID del usuario a editar.
 * @param {FormData} formData - Objeto FormData con los campos y archivo de imagen.
 * @returns {Promise<Object>} Respuesta del servidor.
 */
export const updateProfile = async (userId, formData) => {
    const response = await api.put(`/usuarios/editar/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response; 
};

/**
 * Obtiene la lista completa de usuarios registrados.
 * @returns {Promise<Array>} Lista de objetos de usuario.
 */
export const getAllUsuarios = async () => {
    const response = await api.get('/usuarios/listar');
    return response.data;
};

/**
 * Registra un nuevo usuario o actualiza uno existente (Administración).
 * @param {number|string|null} id - ID del usuario (si es null, registra; si existe, edita).
 * @param {FormData|Object} formData - Datos del usuario.
 * @returns {Promise<Object>} Resultado de la operación.
 */
export const saveUsuario = async (id, formData) => {
    try {
        if (id) {
            const response = await api.put(`/usuarios/editar/${id}`, formData);
            return response.data;
        } else {
            const response = await api.post('/usuarios/registrar', formData);
            return response.data;
        }
    } catch (error) {
        const message = error.response?.data || "Error en la operación";
        throw new Error(message);
    }
};