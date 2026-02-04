import { useState, useEffect } from 'react';
import { getAllCursos } from '../services/courseService';
import { addHorario, updateHorario } from '../services/horarioService';

export const useHorarioAdmin = (horario, isOpen, onSave, onClose) => {
    const [loading, setLoading] = useState(false);
    const [cursos, setCursos] = useState([]);
    const [formData, setFormData] = useState({
        idCurso: '',
        diaSemana: '',
        horaInicio: '',
        horaFin: '',
        aula: ''
    });

    // Cargar cursos disponibles al abrir el modal
    useEffect(() => {
        const cargarCursos = async () => {
            try {
                const data = await getAllCursos();
                setCursos(data);
            } catch (err) {
                console.error("Error al cargar cursos para el horario", err);
            }
        };

        if (isOpen) {
            cargarCursos();
            if (horario) {
                setFormData({
                    idCurso: horario.curso?.id_curso || '',
                    diaSemana: horario.diaSemana,
                    horaInicio: horario.horaInicio,
                    horaFin: horario.horaFin,
                    aula: horario.aula || ''
                });
            } else {
                setFormData({ idCurso: '', diaSemana: '', horaInicio: '', horaFin: '', aula: '' });
            }
        }
    }, [isOpen, horario]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const horarioBody = {
            diaSemana: formData.diaSemana,
            horaInicio: formData.horaInicio,
            horaFin: formData.horaFin,
            aula: formData.aula
        };

        try {
            if (horario) {
                // Actualizar horario existente
                await updateHorario(horario.id_horario, horarioBody);
            } else {
                // Agregar nuevo horario vinculado al curso
                await addHorario(horarioBody, formData.idCurso);
            }
            
            if (onSave) onSave();
            onClose();
        } catch (err) {
            console.error("Error en la petición:", err.response?.status, err.response?.data);
            if (err.response?.status === 403) {
                alert("Error 403: No tienes permisos de Admin.");
            } else {
                alert(err.response?.data || "Error al guardar la programación");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return {
        formData,
        cursos,
        loading,
        handleSubmit,
        handleChange
    };
};