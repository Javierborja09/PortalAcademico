import api from '@/api/axiosConfig';

const EntregaService = {
    /**
     * Ver todas las entregas de una evaluación (solo docente/admin)
     * @param {number} idEvaluacion - ID de la evaluación
     */
    verTodasLasEntregas: async (idEvaluacion) => {
        const response = await api.get(`/entregas/evaluacion/${idEvaluacion}/todas`);
        return response.data;
    },

    /**
     * Ver mis entregas para una evaluación (solo alumno)
     * @param {number} idEvaluacion - ID de la evaluación
     * @param {number} idAlumno - ID del alumno
     */
    verMisEntregas: async (idEvaluacion, idAlumno) => {
        const response = await api.get(`/entregas/evaluacion/${idEvaluacion}/mis-entregas/${idAlumno}`);
        return response.data;
    },

    /**
     * Enviar una tarea (solo alumno)
     * @param {number} idEvaluacion - ID de la evaluación
     * @param {number} idAlumno - ID del alumno
     * @param {string} texto - Contenido de texto (opcional)
     * @param {File} archivo - Archivo adjunto (opcional)
     */
    enviarTarea: async (idEvaluacion, idAlumno, texto, archivo) => {
        const formData = new FormData();
        formData.append('idEvaluacion', idEvaluacion);
        formData.append('idAlumno', idAlumno);
        if (texto) formData.append('texto', texto);
        if (archivo) formData.append('archivo', archivo);

        const response = await api.post('/entregas/enviar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    /**
     * Calificar una entrega (solo docente/admin)
     * @param {number} idEntrega - ID de la entrega
     * @param {number} nota - Nota asignada
     * @param {string} comentario - Comentario del docente (opcional)
     */
    calificarEntrega: async (idEntrega, nota, comentario) => {
        const params = new URLSearchParams();
        params.append('nota', nota);
        if (comentario) params.append('comentario', comentario);

        const response = await api.put(`/entregas/calificar/${idEntrega}?${params.toString()}`);
        return response.data;
    }
};

export default EntregaService;