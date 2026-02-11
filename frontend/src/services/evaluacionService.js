import api from '@/api/axiosConfig';

export const getResourceUrl = (ruta) => {
  if (!ruta) return null;
  const BASE_URL = "http://localhost:8080";
  const rutaLimpia = ruta.replace(/^\/+/, '');
  
  // Si la ruta ya trae el prefijo, no lo duplicamos
  if (rutaLimpia.startsWith('exams/') || rutaLimpia.startsWith('submissions/')) {
    return `${BASE_URL}/${rutaLimpia}`;
  }
  
  // Por defecto, si no se puede determinar, intentamos inferir o devolver limpia
  // Lo ideal es que el backend devuelva la ruta con el prefijo incluido.
  return `${BASE_URL}/${rutaLimpia}`; 
};
const EvaluacionService = {
    // Listar evaluaciones
    listarPorCurso: async (idCurso) => {
        const response = await api.get(`/evaluaciones/curso/${idCurso}`);
        return response.data;
    },

    // Crear evaluación
    crearEvaluacion: async (idCurso, titulo, descripcion, fechaLimite, intentos, archivo) => {
        const formData = new FormData();
        formData.append('idCurso', idCurso);
        formData.append('titulo', titulo);
        formData.append('descripcion', descripcion);
        formData.append('fechaLimite', fechaLimite); 
        formData.append('intentos', intentos);
        
        if (archivo) {
            formData.append('archivo', archivo);
        }

        const response = await api.post('/evaluaciones/crear', formData);
        return response.data;
    },

    // Editar evaluación
    editarEvaluacion: async (id, titulo, descripcion, fechaLimite, intentos, archivo) => {
        const formData = new FormData();
        if (titulo) formData.append('titulo', titulo);
        if (descripcion) formData.append('descripcion', descripcion);
        if (fechaLimite) formData.append('fechaLimite', fechaLimite);
        if (intentos) formData.append('intentos', intentos);
        if (archivo) formData.append('archivo', archivo);

        const response = await api.put(`/evaluaciones/editar/${id}`, formData);
        return response.data;
    },

    // Eliminar evaluación
    eliminarEvaluacion: async (id) => {
        await api.delete(`/evaluaciones/${id}`);
    }
};

export default EvaluacionService;