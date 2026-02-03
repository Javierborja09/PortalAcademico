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
- 📦 **Maven**

### Frontend
- ⚛️ **React 18.x**
- 🎨 **Tailwind CSS**
- ⚡ **Vite**
- 🔗 **Axios**
- 🧭 **React Router**

---

## 📁 Estructura del Proyecto

```
PortalAcademico/
│
├── 📂 backend/           # Spring Boot Application
│   ├── 📂 src/
│   ├── 📄 pom.xml
│   └── 📄 application.properties
│
├── 📂 frontend/          # React Application
│   ├── 📂 src/
│   ├── 📄 package.json
│   └── 📄 vite.config.js
│
└── 📂 database/          # SQL Scripts
    └── 📄 schema.sql
```

---

## 🚀 Instalación

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/PortalAcademico.git
cd PortalAcademico
```

### 2️⃣ Configurar Base de Datos

```bash
# Crear la base de datos en MySQL
mysql -u root -p
```

```sql
CREATE DATABASE blackboard_db;
EXIT;
```

```bash
# Cargar el schema
mysql -u root -p blackboard_db < database/schema.sql
```

### 3️⃣ Configurar Backend

Editar `backend/src/main/resources/application.properties`:

```properties
spring.application.name=portal-academico

# Conexión a Base de Datos 
spring.datasource.url=jdbc:mysql://localhost:3306/blackboard_db?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=TU_PASSWORD_AQUI
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Config
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Seguridad JWT
jwt.secret=7b2f9a3c5e8d1f4a6b0c2e4f8a0d1c3b5e7f9a2b4c6d8e0f1a3b5c7d9e1f2a4b
jwt.expiration=86400000

# Ruta física para guardar las imágenes
upload.path=${user.dir}/uploads/profiles/
```

**Iniciar el Backend:**

```bash
cd backend
./mvnw spring-boot:run
```

El backend correrá en `http://localhost:8080`

### 4️⃣ Configurar Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend correrá en `http://localhost:5173`

---

## 🎯 Uso

Accede a la aplicación en tu navegador:

```
http://localhost:5173
```

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

---

<div align="center">

**Hecho con ❤️ para la gestión académica**

</div>