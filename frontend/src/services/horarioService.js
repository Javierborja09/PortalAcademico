import api from '../api/axiosConfig';

/**
 * Obtiene el listado de horarios asociados a un curso específico.
 * @param {number|string} idCurso - Identificador único del curso.
 * @returns {Promise<Array>} Lista de objetos de horario.
 */
export const getHorariosByCurso = async (idCurso) => {
    const response = await api.get(`/horarios/curso/${idCurso}`);
    return response.data;
};

/**
 * Registra un nuevo horario vinculándolo a un curso mediante parámetros de consulta.
 * @param {Object} horarioData - Datos del nuevo horario (día, hora inicio, hora fin).
 * @param {number|string} idCurso - ID del curso al que se asignará el horario.
 * @returns {Promise<Object>} El objeto de horario creado.
 */
export const addHorario = async (horarioData, idCurso) => {
    // Se utiliza @RequestParam en el backend para capturar el idCurso
    const response = await api.post(`/horarios/agregar?idCurso=${idCurso}`, horarioData);
    return response.data;
};

/**
 * Actualiza la información de un horario existente.
 * @param {number|string} id - ID del horario a editar.
 * @param {Object} horarioData - Datos actualizados del horario.
 * @returns {Promise<Object>} El objeto de horario modificado.
 */
export const updateHorario = async (id, horarioData) => {
    const response = await api.put(`/horarios/editar/${id}`, horarioData);
    return response.data;
};

/**
 * Elimina un registro de horario del sistema.
 * @param {number|string} id - ID del horario a eliminar.
 * @returns {Promise<Object>} Mensaje de confirmación de la operación.
 */
export const deleteHorario = async (id) => {
    const response = await api.delete(`/horarios/eliminar/${id}`);
    return response.data;
};