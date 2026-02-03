import api from '../api/axiosConfig';

export const login = async (correo, password) => {
    const response = await api.post('/auth/login', { correo, password });
    return response.data;
};

export const updateProfile = async (userId, formData) => {
    const response = await api.put(`/usuarios/editar/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response; 
};

export const getAllUsuarios = async () => {
    const response = await api.get('/usuarios/listar');
    return response.data;
};