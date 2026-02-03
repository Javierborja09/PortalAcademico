import api from '../api/axiosConfig';

export const matricularAlumno = async (idAlumno, idCurso, ciclo) => {
    return await api.post('/matriculas/registrar', { idAlumno, idCurso, ciclo });
};

// Retirar alumno usando el ID de la matrícula
export const retirarAlumno = async (idMatricula) => {
    return await api.delete(`/matriculas/eliminar/${idMatricula}`);
};

export const getIntegrantesCurso = async (cursoId) => {
    const response = await api.get(`/matriculas/curso/${cursoId}`);
    return response.data;
};