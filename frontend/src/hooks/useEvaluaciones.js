import { useState, useEffect, useCallback } from "react";
import EvaluacionService from "@/services/evaluacionService";
import EntregaService from "@/services/entregaService";

export const useEvaluaciones = (idCurso, idAlumno, rol) => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [misEntregas, setMisEntregas] = useState({});
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState({ isOpen: false, url: null, titulo: "" });

    const BASE_URL = "http://localhost:8080";
    const alumnoIdReal = idAlumno || localStorage.getItem("userId");

    const cargarDatos = useCallback(async () => {
        if (!idCurso) return;
        setLoading(true);
        try {
            const data = await EvaluacionService.listarPorCurso(idCurso);
            setEvaluaciones(data);

            // Si es alumno, cargamos sus entregas para cada evaluación
            if (rol === "alumno" && alumnoIdReal) {
                const promesasEntregas = data.map(evaluacion => {
                    const idEval = evaluacion.id_evaluacion || evaluacion.idEvaluacion;
                    return EntregaService.verMisEntregas(idEval, alumnoIdReal)
                        .then(entregas => ({ idEval, entregas }))
                        .catch(() => ({ idEval, entregas: [] }));
                });

                const resultados = await Promise.all(promesasEntregas);
                const entregasMap = resultados.reduce((acc, curr) => {
                    acc[curr.idEval] = curr.entregas;
                    return acc;
                }, {});

                setMisEntregas(entregasMap);
            }
        } catch (error) {
            console.error("Error al sincronizar evaluaciones:", error);
        } finally {
            setLoading(false);
        }
    }, [idCurso, alumnoIdReal, rol]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    // Lógica de Previsualización
    const handlePreview = async (ruta, titulo) => {
        if (!ruta) return;

        const rutaLimpia = ruta.replace(/^\/+/, '');
        const extension = rutaLimpia.split('.').pop().toLowerCase();

        let prefijo = '';
        if (!rutaLimpia.startsWith('exams/') && !rutaLimpia.startsWith('submissions/')) {
            prefijo = titulo.toLowerCase().includes('entrega') ? 'submissions/' : 'exams/';
        }

        const urlFinal = `${BASE_URL}/${prefijo}${rutaLimpia}`;

        if (extension === 'pdf') {
            try {
              
                const response = await fetch(urlFinal);
                if (!response.ok) throw new Error('Error al obtener archivo');

                const blob = await response.blob();
                
                const objectUrl = URL.createObjectURL(blob);

                setPreview({
                    isOpen: true,
                    url: objectUrl, 
                    titulo: titulo
                });
            } catch (error) {
                console.error("Error cargando PDF:", error);
                window.open(urlFinal, '_blank'); 
            }
        } else if (['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
            setPreview({ isOpen: true, url: urlFinal, titulo: titulo });
        } else {
            // DESCARGA PARA ZIP, DOCX, ETC.
            const link = document.createElement('a');
            link.href = urlFinal;
            link.download = rutaLimpia.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const closePreview = () => setPreview({ ...preview, isOpen: false });

    // Validaciones de negocio
    const evaluacionExpirada = (fecha) => new Date(fecha) < new Date();

    const puedeEnviar = (evaluacion) => {
        if (evaluacionExpirada(evaluacion.fechaLimite)) return false;
        const idEval = evaluacion.id_evaluacion || evaluacion.idEvaluacion;
        const entregas = misEntregas[idEval] || [];
        return entregas.length < (evaluacion.intentosPermitidos || 1);
    };

    return {
        evaluaciones,
        misEntregas,
        loading,
        preview,
        alumnoIdReal,
        cargarDatos,
        handlePreview,
        closePreview,
        evaluacionExpirada,
        puedeEnviar
    };
};