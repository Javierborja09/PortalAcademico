import api from '@/api/axiosConfig'; 

const ContenidoService = {
    // Obtener todo el contenido jerárquico del curso (Unidades -> Temas -> Documentos)
    getTodoElContenido: async (idCurso) => {
        const response = await api.get(`/contenido/curso/${idCurso}/todo`);
        return response.data;
    },

    // --- MÉTODOS PARA UNIDADES ---
    crearUnidad: async (idCurso, titulo) => {
        const response = await api.post('/contenido/unidades', {
            tituloUnidad: titulo,
            curso: { id_curso: idCurso },
            orden: 0
        });
        return response.data;
    },

    editarUnidad: async (id, titulo) => {
        const response = await api.put(`/contenido/unidad/${id}`, {
            tituloUnidad: titulo
        });
        return response.data;
    },

    eliminarUnidad: async (id) => {
        await api.delete(`/contenido/unidad/${id}`);
    },

    // --- MÉTODOS PARA TEMAS ---
    crearTema: async (idUnidad, titulo, descripcion) => {
        const response = await api.post('/contenido/temas', {
            tituloTema: titulo,
            descripcionTema: descripcion,
            unidad: { id_unidad: idUnidad },
            orden: 0
        });
        return response.data;
    },

    editarTema: async (id, titulo, descripcion) => {
        const response = await api.put(`/contenido/tema/${id}`, {
            tituloTema: titulo,
            descripcionTema: descripcion
        });
        return response.data;
    },

    eliminarTema: async (id) => {
        await api.delete(`/contenido/tema/${id}`);
    },

    // --- NUEVOS MÉTODOS PARA DOCUMENTOS (ARCHIVOS) ---
    
    /**
     * Sube un archivo físico asociado a un tema.
     * @param {number} idTema - ID del tema padre.
     * @param {string} titulo - Nombre visible del archivo (ej: "Lectura 1").
     * @param {File} archivo - El archivo binario desde el input file.
     */
    subirDocumento: async (idTema, titulo, archivo) => {
        const formData = new FormData();
        formData.append('idTema', idTema);
        formData.append('titulo', titulo);
        formData.append('archivo', archivo);

        const response = await api.post('/contenido/documentos/subir', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    eliminarDocumento: async (id) => {
        await api.delete(`/contenido/documento/${id}`);
    }
};

export default ContenidoService;