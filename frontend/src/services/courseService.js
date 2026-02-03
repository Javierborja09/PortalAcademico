import api from '../api/axiosConfig';

export const getCursosByAlumno = async (userId) => {
    const response = await api.get(`/cursos/alumno/${userId}`);
    return response.data;
};

export const getAllCursos = async () => {
    const response = await api.get('/cursos/listar');
    return response.data;
};


export const getCursoById = async (id) => {
    const response = await api.get(`/cursos/${id}`);
    return response.data;
};

export const getCursosByDocente = async (userId) => {
    const response = await api.get(`/cursos/docente/${userId}`);
    return response.data;
};