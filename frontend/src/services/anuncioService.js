import api from '../api/axiosConfig';

export const getAnunciosByCurso = async (idCurso) => {
    
    const response = await api.get(`/anuncios/curso/${idCurso}`);
    return response.data;
};

export const crearAnuncio = async (anuncioData) => {
    const params = new URLSearchParams();
    params.append('idCurso', anuncioData.idCurso);
    params.append('titulo', anuncioData.titulo);
    params.append('contenido', anuncioData.contenido);
    
    if (anuncioData.fechaPublicacion) {
        params.append('fechaPublicacion', anuncioData.fechaPublicacion);
    }

    const response = await api.post('/anuncios/crear', params);
    return response.data;
};