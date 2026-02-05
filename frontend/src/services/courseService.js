import api from '@/api/axiosConfig';

/**
 * Obtiene la lista de cursos en los que un alumno específico está matriculado.
 */
export const getCursosByAlumno = async (userId) => {
    const response = await api.get(`/cursos/alumno/${userId}`);
    return response.data;
};

/**
 * Recupera todos los cursos registrados en el sistema.
 */
export const getAllCursos = async () => {
    const response = await api.get('/cursos/listar');
    return response.data;
};

/**
 * Obtiene la información detallada de un curso específico por su ID.
 */
export const getCursoById = async (id) => {
    const response = await api.get(`/cursos/${id}`);
    return response.data;
};

/**
 * Obtiene los cursos asignados a un docente específico.
 */
export const getCursosByDocente = async (userId) => {
    const response = await api.get(`/cursos/docente/${userId}`);
    return response.data;
};

/**
 * Crea un nuevo curso en el sistema.
 * @param {FormData} formData - Datos del curso incluyendo la imagen.
 * @param {number|string} idDocente - ID del docente asignado.
 */
export const crearCurso = async (formData, idDocente) => {
    const response = await api.post(`/cursos/crear?idDocente=${idDocente}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * Actualiza la información de un curso existente.
 * @param {number|string} idCurso - ID del curso a editar.
 * @param {FormData} formData - Datos actualizados del curso.
 */
export const editarCurso = async (idCurso, formData) => {
    const response = await api.put(`/cursos/editar/${idCurso}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

/**
 * Elimina un curso del sistema (Opcional, si lo necesitas).
 */
export const eliminarCurso = async (idCurso) => {
    const response = await api.delete(`/cursos/eliminar/${idCurso}`);
    return response.data;
};