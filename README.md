<div align="center">

# 🎓 PortalAcademico

**Sistema Integral de Gestión Académica**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg?logo=spring)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 🛠️ Tecnologías

### Backend
- ☕ **Java 17+**
- 🍃 **Spring Boot 3.x**
- 🔐 **Spring Security + JWT**
- 🗄️ **MySQL 8.x**
- 📦 **Maven (mvnw)**

### Frontend
- ⚛️ **React 18.x**
- 🎨 **Tailwind CSS**
- ⚡ **Vite**
- 🔗 **Axios**
- 🧭 **Lucide React** (Iconografía moderna)

---

## 📁 Estructura del Proyecto

Basada en la arquitectura de carpetas del repositorio:

```
PortalAcademico/
│
├── 📂 backend/          # API REST con Spring Boot
├── 📂 frontend/         # Interfaz de usuario con React
├── 📂 database/         # Script de base de datos (script.sql)
├── 📂 uploads/          # Almacenamiento local de imágenes de perfil
├── 📂 docs/             # Documentación y Diagramas ER
└── 📄 README.md
```

---

## 🚀 Instalación y Configuración

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/PortalAcademico.git
cd PortalAcademico
```

### 2️⃣ Configurar Base de Datos
Dado que el archivo `script.sql` ya contiene la lógica de creación de la base de datos `blackboard_db` y sus tablas, solo debes ejecutar:

```bash
cd database
mysql -u root -p < script.sql
```

### 3️⃣ Configurar e Iniciar Backend
Asegúrate de configurar tus credenciales en `backend/src/main/resources/application.properties`. Luego inicia el servidor:

```bash
cd ../backend
./mvnw spring-boot:run
```

El backend correrá en `http://localhost:8080`.

### 4️⃣ Configurar e Iniciar Frontend
Desde una nueva terminal en la raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

El frontend correrá en `http://localhost:5173`.

---

## 📸 Características Principales

- **Gestión Full-Stack**: Integración completa entre Spring Boot y React.
- **Actualización Instantánea**: Los cambios en la foto de perfil se sincronizan en tiempo real en Sidebar y Navbar mediante eventos personalizados.
- **Diseño Responsivo**: Tablas de usuarios que se transforman en tarjetas para una experiencia móvil fluida.
- **Optimización de Medios**: Conversión automática de imágenes subidas a formato WebP para optimizar el almacenamiento y carga.
- **Seguridad**: Gestión de accesos basada en roles (Admin, Docente, Alumno) mediante JWT.

---

<div align="center">

Hecho con ❤️ para la gestión académica

</div>