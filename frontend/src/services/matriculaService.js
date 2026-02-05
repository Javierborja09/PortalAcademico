import api from '@/api/axiosConfig';

/**
 * Registra la matrícula de un alumno en un curso específico.
 * @param {number|string} idAlumno - Identificador único del estudiante.
 * @param {number|string} idCurso - Identificador único del curso.
 * @param {string} ciclo - Periodo académico (ej. "2026-I").
 * @returns {Promise<Object>} Resultado de la operación de registro.
 */
export const matricularAlumno = async (idAlumno, idCurso, ciclo) => {
    return await api.post('/matriculas/registrar', { idAlumno, idCurso, ciclo });
};

/**
 * Elimina el registro de matrícula de un alumno (Retiro).
 * @param {number|string} idMatricula - ID específico de la relación de matrícula.
 * @returns {Promise<Object>} Confirmación de la eliminación del registro.
 */
export const retirarAlumno = async (idMatricula) => {
    return await api.delete(`/matriculas/eliminar/${idMatricula}`);
};

/**
 * Obtiene el listado de todos los alumnos matriculados en un curso.
 * @param {number|string} cursoId - ID del curso para filtrar integrantes.
 * @returns {Promise<Array>} Lista de integrantes con sus datos de perfil.
 */
export const getIntegrantesCurso = async (cursoId) => {
    const response = await api.get(`/matriculas/curso/${cursoId}`);
    return response.data;
};