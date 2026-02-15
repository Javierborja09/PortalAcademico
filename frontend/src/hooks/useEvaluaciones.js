import { useState, useEffect, useCallback } from "react";
import EvaluacionService from "@/services/evaluacionService";
import EntregaService from "@/services/entregaService";

export const useEvaluaciones = (idCurso, idAlumno, rol) => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [misEntregas, setMisEntregas] = useState({});
    const [loading, setLoading] = useState(true);

    const alumnoIdReal = idAlumno || localStorage.getItem("userId");

    const cargarDatos = useCallback(async () => {
        if (!idCurso) return;
        setLoading(true);
        try {
            const data = await EvaluacionService.listarPorCurso(idCurso);
            setEvaluaciones(data);

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
        alumnoIdReal,
        cargarDatos,
        evaluacionExpirada,
        puedeEnviar
    };
};