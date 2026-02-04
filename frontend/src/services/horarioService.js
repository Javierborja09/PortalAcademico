import api from '../api/axiosConfig';

/**
 * Recupera todos los horarios registrados en el sistema (Uso administrativo).
 * @returns {Promise<Array>} Lista completa de horarios.
 */
export const getAllHorarios = async () => {
    const response = await api.get('/horarios/listar');
    return response.data;
};

/**
 * Obtiene el listado de horarios asociados a un curso específico.
 */
export const getHorariosByCurso = async (idCurso) => {
    const response = await api.get(`/horarios/curso/${idCurso}`);
    return response.data;
};

/**
 * Registra un nuevo horario vinculándolo a un curso.
 */
export const addHorario = async (horarioData, idCurso) => {
    const response = await api.post(`/horarios/agregar?idCurso=${idCurso}`, horarioData);
    return response.data;
};

/**
 * Actualiza la información de un horario existente.
 */
export const updateHorario = async (id, horarioData) => {
    const response = await api.put(`/horarios/editar/${id}`, horarioData);
    return response.data;
};

/**
 * Elimina un registro de horario del sistema.
 */
export const deleteHorario = async (id) => {
    const response = await api.delete(`/horarios/eliminar/${id}`);
    return response.data;
};