import api from '../api/axiosConfig';

/**
 * Obtiene la lista de cursos en los que un alumno específico está matriculado.
 * @param {number|string} userId - ID del alumno.
 * @returns {Promise<Array>} Listado de cursos del alumno.
 */
export const getCursosByAlumno = async (userId) => {
    const response = await api.get(`/cursos/alumno/${userId}`);
    return response.data;
};

/**
 * Recupera todos los cursos registrados en el sistema (Uso administrativo).
 * @returns {Promise<Array>} Lista completa de cursos.
 */
export const getAllCursos = async () => {
    const response = await api.get('/cursos/listar');
    return response.data;
};

/**
 * Obtiene la información detallada de un curso específico por su ID.
 * @param {number|string} id - Identificador único del curso.
 * @returns {Promise<Object>} Datos del curso (nombre, descripción, docente, etc).
 */
export const getCursoById = async (id) => {
    const response = await api.get(`/cursos/${id}`);
    return response.data;
};

/**
 * Obtiene los cursos asignados a un docente específico.
 * @param {number|string} userId - ID del docente.
 * @returns {Promise<Array>} Listado de cursos dictados por el docente.
 */
export const getCursosByDocente = async (userId) => {
    const response = await api.get(`/cursos/docente/${userId}`);
    return response.data;
};