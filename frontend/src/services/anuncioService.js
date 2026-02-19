import api from '@/api/axiosConfig';
export const getAnunciosByCurso = async (idCurso) => {
    
    const response = await api.get(`/anuncios/curso/${idCurso}`);
    return response.data;
};

export const crearAnuncio = async (anuncioData) => {
    const response = await api.post('/anuncios/crear', anuncioData);
    return response.data;
};

export const eliminarAnuncio = async (id) => {
    const response = await api.delete(`/anuncios/eliminar/${id}`);
    return response.data;
};

export const editarAnuncio = async (id, anuncioData) => {
    const response = await api.put(`/anuncios/editar/${id}`, anuncioData);
    return response.data;
};