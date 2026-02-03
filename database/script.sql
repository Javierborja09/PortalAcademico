-- 1. Creación de la base de datos
DROP DATABASE IF EXISTS blackboard_db;
CREATE DATABASE blackboard_db;
USE blackboard_db;

-- 2. Tabla de Usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    correo VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    rol ENUM('alumno', 'docente', 'admin') DEFAULT 'alumno',
    foto_perfil VARCHAR(255) DEFAULT ''
);

-- 3. Tabla de Cursos (Con fechas de inicio y fin)
CREATE TABLE cursos (
    id_curso INT PRIMARY KEY AUTO_INCREMENT,
    nombre_curso VARCHAR(100),
    codigo_curso VARCHAR(20) UNIQUE,
    id_docente INT,
    imagen_portada VARCHAR(255) DEFAULT 'uploads/courses/default_course.png',
    fecha_inicio DATE,
    fecha_fin DATE,
    FOREIGN KEY (id_docente) REFERENCES usuarios(id_usuario)
);

-- 4. Tabla de Horarios (Relación uno a muchos con cursos)
CREATE TABLE horarios (
    id_horario INT PRIMARY KEY AUTO_INCREMENT,
    id_curso INT,
    dia_semana ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'),
    hora_inicio TIME,
    hora_fin TIME,
    aula VARCHAR(50) DEFAULT 'Virtual',
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- 5. Tabla de Matrícula
CREATE TABLE matriculas (
    id_matricula INT PRIMARY KEY AUTO_INCREMENT,
    id_alumno INT,
    id_curso INT,
    ciclo VARCHAR(10),
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

-- 6. Tabla de Notas
CREATE TABLE notas (
    id_nota INT PRIMARY KEY AUTO_INCREMENT,
    id_alumno INT,
    id_curso INT,
    nota_parcial DECIMAL(4,2),
    nota_final DECIMAL(4,2),
    continua DECIMAL(4,2),
    promedio_final DECIMAL(4,2),
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso)
);

-- ==========================================
-- INSERCIÓN DE DATOS INICIALES
-- ==========================================

-- Usuarios (Docentes y Alumnos)
INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES
('Admin', 'Sistema', 'admin@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'admin'),
('Carlos', 'Ramírez', 'carlos.ramirez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'docente'),
('María', 'Gómez', 'maria.gomez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'docente'),
('Luis', 'Pérez', 'luis.perez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Ana', 'Torres', 'ana.torres@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('José', 'Flores', 'jose.flores@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno');

-- Cursos con Fechas del Ciclo 2026-I
INSERT INTO cursos (nombre_curso, codigo_curso, id_docente, fecha_inicio, fecha_fin) VALUES
('Matemática Básica', 'MAT101', 2, '2026-03-15', '2026-07-20'),
('Programación I', 'PROG101', 2, '2026-03-15', '2026-07-20'),
('Base de Datos', 'BD202', 3, '2026-03-15', '2026-07-20'),
('Diseño de Interfaces (UI/UX)', 'UX201', 3, '2026-03-15', '2026-07-20'),
('Redes y Conectividad', 'RED102', 2, '2026-03-15', '2026-07-20'),
('Inteligencia Artificial', 'IA501', 3, '2026-03-15', '2026-07-20');

-- Horarios detallados
INSERT INTO horarios (id_curso, dia_semana, hora_inicio, hora_fin, aula) VALUES
(1, 'Martes', '07:00:00', '09:00:00', 'Aula 302'),
(1, 'Jueves', '07:00:00', '09:00:00', 'Aula 302'),
(2, 'Lunes', '18:00:00', '21:00:00', 'Lab 104'),
(3, 'Miércoles', '15:00:00', '18:00:00', 'Virtual'),
(4, 'Lunes', '09:00:00', '12:00:00', 'Lab 205'),
(5, 'Viernes', '14:00:00', '17:00:00', 'Lab 101'),
(6, 'Sábado', '08:00:00', '11:00:00', 'Virtual');

-- Matrículas de Alumnos
INSERT INTO matriculas (id_alumno, id_curso, ciclo) VALUES
(4, 1, '2026-I'), (4, 2, '2026-I'), (4, 4, '2026-I'), -- Luis
(5, 1, '2026-I'), (5, 3, '2026-I'), (5, 5, '2026-I'), -- Ana
(6, 2, '2026-I'), (6, 3, '2026-I'), (6, 6, '2026-I'); -- José



INSERT INTO usuarios (nombre, apellido, correo, password, rol) VALUES
('Roberto', 'Sánchez', 'roberto.sanchez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Lucía', 'Mendoza', 'lucia.mendoza@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Ricardo', 'Espinoza', 'ricardo.espinoza@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Elena', 'Vargas', 'elena.vargas@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Fernando', 'Rojas', 'fernando.rojas@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Sofía', 'Castro', 'sofia.castro@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Javier', 'Ortega', 'javier.ortega@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Gabriela', 'Núñez', 'gabriela.nunez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Mateo', 'Cortez', 'mateo.cortez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Valeria', 'Silva', 'valeria.silva@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Andrés', 'Morales', 'andres.morales@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Camila', 'Reyes', 'camila.reyes@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Hugo', 'Jiménez', 'hugo.jimenez@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Daniela', 'Salazar', 'daniela.salazar@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Alejandro', 'Paredes', 'alejandro.paredes@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Natalia', 'Huerta', 'natalia.huerta@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Sebastian', 'Carrillo', 'sebastian.carrillo@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Isabella', 'Farfán', 'isabella.farfan@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Diego', 'Lozano', 'diego.lozano@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Paula', 'Quispe', 'paula.quispe@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Oscar', 'Medina', 'oscar.medina@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Beatriz', 'Zambrano', 'beatriz.zambrano@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Leonardo', 'Velasco', 'leonardo.velasco@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Ximena', 'Cano', 'ximena.cano@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Esteban', 'Peralta', 'esteban.peralta@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Adriana', 'Cáceres', 'adriana.caceres@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Iván', 'Guerrero', 'ivan.guerrero@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Juliana', 'Mejía', 'juliana.mejia@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Emilio', 'Miranda', 'emilio.miranda@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Mariana', 'Vidal', 'mariana.vidal@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Gustavo', 'Villalobos', 'gustavo.villalobos@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Clara', 'Bravo', 'clara.bravo@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Samuel', 'Escobar', 'samuel.escobar@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Fabiola', 'Lara', 'fabiola.lara@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Marcos', 'Ponce', 'marcos.ponce@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Raquel', 'Solís', 'raquel.solis@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Felipe', 'Bustamante', 'felipe.bustamante@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Diana', 'Montoya', 'diana.montoya@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Cristian', 'Vega', 'cristian.vega@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno'),
('Leticia', 'Duarte', 'leticia.duarte@blackboard.com', '$2a$10$W/flyFH5fP4oVzrieEAp5OGXnuy.0TMPKOHkmgZfR7yxjY5QX5kii', 'alumno');

-- Matrículas automáticas para llenar los cursos (Ciclo 2026-I)
-- Matricular a los nuevos alumnos (IDs del 7 al 46) en 2 cursos aleatorios cada uno
INSERT INTO matriculas (id_alumno, id_curso, ciclo) 
SELECT id_usuario, 1, '2026-I' FROM usuarios WHERE id_usuario BETWEEN 7 AND 26;
INSERT INTO matriculas (id_alumno, id_curso, ciclo) 
SELECT id_usuario, 2, '2026-I' FROM usuarios WHERE id_usuario BETWEEN 27 AND 46;
INSERT INTO matriculas (id_alumno, id_curso, ciclo) 
SELECT id_usuario, 3, '2026-I' FROM usuarios WHERE id_usuario BETWEEN 7 AND 46 AND id_usuario % 2 = 0;


-- 7. Tabla de Anuncios (Relación muchos a uno con cursos)
CREATE TABLE anuncios (
    id_anuncio INT PRIMARY KEY AUTO_INCREMENT,
    id_curso INT,
    id_autor INT,
    titulo VARCHAR(150),
    contenido TEXT,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE,
    FOREIGN KEY (id_autor) REFERENCES usuarios(id_usuario)
);

CREATE TABLE unidades (
    id_unidad INT PRIMARY KEY AUTO_INCREMENT,
    id_curso INT,
    titulo_unidad VARCHAR(150) NOT NULL,
    orden INT DEFAULT 0, -- Para organizar qué unidad va primero
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- 2. Tabla de Temas
CREATE TABLE temas (
    id_tema INT PRIMARY KEY AUTO_INCREMENT,
    id_unidad INT,
    titulo_tema VARCHAR(150) NOT NULL,
    descripcion_tema TEXT,
    orden INT DEFAULT 0,
    FOREIGN KEY (id_unidad) REFERENCES unidades(id_unidad) ON DELETE CASCADE
);

-- 3. Tabla de Documentos/Archivos
CREATE TABLE documentos (
    id_documento INT PRIMARY KEY AUTO_INCREMENT,
    id_tema INT,
    titulo_documento VARCHAR(150) NOT NULL, -- Ej: "CLASE NUMERO 1"
    ruta_archivo VARCHAR(255) NOT NULL, -- Ruta del PDF en el servidor
    fecha_subida DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tema) REFERENCES temas(id_tema) ON DELETE CASCADE
);



CREATE TABLE evaluaciones (
    id_evaluacion INT PRIMARY KEY AUTO_INCREMENT,
    id_curso INT,
    titulo_evaluacion VARCHAR(150) NOT NULL,
    descripcion_evaluacion TEXT,
    ruta_recurso VARCHAR(255), -- PDF o guía que sube el docente
    fecha_limite DATETIME NOT NULL,
    intentos_permitidos INT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_curso) REFERENCES cursos(id_curso) ON DELETE CASCADE
);

-- 2. Tabla de Entregas (Subidas por los Alumnos)
CREATE TABLE entregas (
    id_entrega INT PRIMARY KEY AUTO_INCREMENT,
    id_evaluacion INT,
    id_alumno INT,
    contenido_texto TEXT, -- Respuesta escrita del alumno
    ruta_archivo VARCHAR(255), -- ZIP, PDF, DOCX, XLSX
    nota DECIMAL(4,2) DEFAULT NULL, -- Calificación puesta por el docente
    comentario_docente TEXT,
    fecha_entrega DATETIME DEFAULT CURRENT_TIMESTAMP,
    intento_numero INT DEFAULT 1,
    FOREIGN KEY (id_evaluacion) REFERENCES evaluaciones(id_evaluacion) ON DELETE CASCADE,
    FOREIGN KEY (id_alumno) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Inserción de Anuncios Iniciales
INSERT INTO anuncios (id_curso, id_autor, titulo, contenido) VALUES
-- Anuncios para Curso 1
(1, 2, 'Sesión de Tutoría Extra', 'Este viernes a las 5:00 PM realizaremos una sesión de repaso sobre derivadas por Zoom.'),
(1, 2, 'Resultados de la Práctica 1', 'Ya pueden visualizar sus calificaciones de la primera práctica en el registro de notas.'),

-- Anuncios para Curso 2
(2, 2, 'Guía de Configuración Git', 'He subido un PDF con los comandos básicos de Git que usaremos para el despliegue del bot.'),
(2, 2, 'Cambio de Repositorio', 'A partir de ahora, todos los laboratorios se entregarán en la organización de GitHub creada para la clase.'),
(2, 2, 'Taller de APIs con Express', 'No falten a la clase de mañana; configuraremos nuestro primer servidor profesional conectado a MySQL.'),

-- Anuncios para Curso 3
(3, 3, 'Lectura Obligatoria: UX Research', 'Por favor, lean el capítulo 3 del libro de Norman para el debate que tendremos en el foro.'),
(3, 3, 'Invitado Especial', 'La próxima semana contaremos con un experto de la industria que hablará sobre diseño centrado en el usuario.'),

-- Anuncios para Curso 4
(4, 3, 'Actualización de Rúbrica', 'Se han ajustado los criterios de evaluación del proyecto final. Por favor, descarguen la nueva versión.'),
(4, 3, 'Feriado Académico', 'Les recordamos que este lunes no habrá actividades por feriado nacional. Retomamos el miércoles.'),

-- Anuncio General / Extra
(1, 2, 'Encuesta de Satisfacción', 'Por favor, completen la encuesta sobre el desarrollo del curso que les llegó a sus correos institucionales.');
-- ==========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ==========================================
DELIMITER //

-- Actualizar foto de perfil
CREATE PROCEDURE sp_actualizar_foto_usuario(IN p_id_usuario INT, IN p_ruta_foto VARCHAR(255))
BEGIN
    UPDATE usuarios SET foto_perfil = p_ruta_foto WHERE id_usuario = p_id_usuario;
END //

-- Listar cursos con nombre de docente y fechas
CREATE PROCEDURE sp_listar_cursos()
BEGIN
    SELECT c.*, CONCAT(u.nombre, ' ', u.apellido) AS nombre_docente 
    FROM cursos c 
    LEFT JOIN usuarios u ON c.id_docente = u.id_usuario;
END //

DELIMITER ;



DELIMITER //

-- Listar anuncios de un curso específico con nombre del autor
CREATE PROCEDURE sp_listar_anuncios_por_curso(IN p_id_curso INT)
BEGIN
    SELECT a.*, CONCAT(u.nombre, ' ', u.apellido) AS autor_nombre
    FROM anuncios a
    JOIN usuarios u ON a.id_autor = u.id_usuario
    WHERE a.id_curso = p_id_curso
    ORDER BY a.fecha_publicacion DESC;
END //

DELIMITER ;


SELECT 
    u.id_usuario, 
    u.nombre, 
    u.apellido, 
    u.correo, 
    u.foto_perfil,
    m.ciclo
FROM matriculas m
JOIN usuarios u ON m.id_alumno = u.id_usuario
WHERE m.id_curso = 2; -- Cambia el 1 por el ID que necesites
