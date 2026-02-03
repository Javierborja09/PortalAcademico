import api from '../api/axiosConfig';

export const getCursosByAlumno = async (userId) => {
    const response = await api.get(`/cursos/alumno/${userId}`);
    return response.data;
};

export const getAllCursos = async () => {
    const response = await api.get('/cursos/listar');
    return response.data;
};