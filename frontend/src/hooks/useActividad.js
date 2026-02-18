import { useState, useEffect } from "react";
import { useCursos } from "@/hooks/useCursos";
import EvaluacionService from "@/services/evaluacionService";
import EntregaService from "@/services/entregaService";
import { getAnunciosByCurso } from "@/services/anuncioService";

export const useActividad = () => {
    const { cursos, loading: loadingCursos } = useCursos();
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);

    const alumnoId = localStorage.getItem("userId");

    useEffect(() => {
        const cargarActividad = async () => {
            if (!cursos || cursos.length === 0) {
                if (!loadingCursos) setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const promesasCursos = cursos.map(async (curso) => {
                    const idCurso = curso.idCurso || curso.id_curso;
                    
                    const [evaluaciones, anuncios] = await Promise.all([
                        EvaluacionService.listarPorCurso(idCurso),
                        getAnunciosByCurso(idCurso)
                    ]);

                    const evalsProcesadas = await Promise.all(evaluaciones.map(async (ev) => {
                        const idEval = ev.id_evaluacion || ev.idEvaluacion;
                        
                        let entregas = [];
                        try {
                            entregas = await EntregaService.verMisEntregas(idEval, alumnoId);
                        } catch (e) {
                            console.warn("No se pudieron cargar entregas para eval:", idEval);
                        }

                        
                        const tieneEntrega = entregas && entregas.length > 0;
                        const notaExtraida = tieneEntrega ? (entregas[0].nota ?? entregas[0].calificacion ?? null) : null;

                        return {
                            ...ev,
                            tipo: "evaluacion",
                            nombreCurso: curso.nombreCurso || curso.nombre,
                            id_curso: idCurso,
                            entregado: tieneEntrega,
                            nota: notaExtraida,
                            calificacion: notaExtraida
                        };
                    }));

                    const anunciosProcesados = anuncios.map(an => ({
                        ...an,
                        tipo: "anuncio",
                        nombreCurso: curso.nombreCurso || curso.nombre,
                        id_curso: idCurso
                    }));

                    return [...evalsProcesadas, ...anunciosProcesados];
                });

                const resultados = await Promise.all(promesasCursos);
                let todosLosItems = resultados.flat();

                todosLosItems.sort((a, b) => {
                    const fechaA = new Date(a.fechaLimite || a.fecha_limite || a.fechaPublicacion || a.fechaCreacion || 0);
                    const fechaB = new Date(b.fechaLimite || b.fecha_limite || b.fechaPublicacion || b.fechaCreacion || 0);
                    return fechaB - fechaA;
                });

                setActividades(todosLosItems);
            } catch (error) {
                console.error("Error en useActividad:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!loadingCursos) cargarActividad();
    }, [cursos, alumnoId, loadingCursos]);

    return { actividades, loading };
};