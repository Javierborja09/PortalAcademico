import { useState, useEffect } from "react";
import sesionService from "../services/sesionService";

/**
 * Hook para gestionar la lista de participantes en tiempo real.
 * Maneja la sincronización inicial, entradas y salidas de usuarios.
 */
export const useParticipantes = (cursoId) => {
    const [participantes, setParticipantes] = useState([]);
    
    const nombre = localStorage.getItem('nombre') || 'Usuario';
    const apellido = localStorage.getItem('apellido') || '';
    const usuarioNombreActual = `${nombre} ${apellido}`.trim();

    useEffect(() => {
        const client = sesionService.client;
        
        if (client && client.connected) {
            // 1. Suscribirse a actualizaciones de presencia
            const sub = client.subscribe(`/topic/curso/${cursoId}`, (payload) => {
                const msg = JSON.parse(payload.body);

                // Sincronización inicial de lista completa
                if (msg.tipo === 'PARTICIPANTS_LIST') {
                    const otros = msg.lista.filter(p => p.nombre !== usuarioNombreActual);
                    setParticipantes(otros);
                }

                // Usuario nuevo se une
                if (msg.tipo === 'JOIN') {
                    if (msg.remitente === usuarioNombreActual) return;
                    setParticipantes(prev => {
                        if (prev.find(p => p.nombre === msg.remitente)) return prev;
                        return [...prev, { nombre: msg.remitente, rol: msg.rol }];
                    });
                }

                // Usuario sale de la sesión
                if (msg.tipo === 'LEAVE') {
                    setParticipantes(prev => prev.filter(p => p.nombre !== msg.remitente));
                }
            });

            // 2. Pedir la lista al servidor inmediatamente al conectar
            sesionService.solicitarListaParticipantes(cursoId);

            return () => sub.unsubscribe();
        }
    }, [cursoId, usuarioNombreActual]);

    return {
        participantes,
        usuarioNombreActual,
        totalConectados: participantes.length + 1
    };
};