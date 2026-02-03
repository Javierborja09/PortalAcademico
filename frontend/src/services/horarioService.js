import api from '../api/axiosConfig';

export const getHorariosByCurso = async (idCurso) => {
    const response = await api.get(`/horarios/curso/${idCurso}`);
    return response.data;
};

export const addHorario = async (horarioData, idCurso) => {
    const response = await api.post(`/horarios/agregar?idCurso=${idCurso}`, horarioData);
    return response.data;
};

export const updateHorario = async (id, horarioData) => {
    const response = await api.put(`/horarios/editar/${id}`, horarioData);
    return response.data;
};

export const deleteHorario = async (id) => {
    const response = await api.delete(`/horarios/eliminar/${id}`);
    return response.data;
};