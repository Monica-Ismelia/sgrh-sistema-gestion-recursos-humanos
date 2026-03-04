# 🧑‍💼 Sistema de Gestión de Recursos Humanos (SGRH)

Proyecto desarrollado como evidencia del programa **Análisis y Desarrollo de Software – SENA**.

El sistema permite la administración de empleados, cargos, departamentos y tipos de documento mediante una aplicación web con arquitectura cliente-servidor.

---

## 🚀 Tecnologías Utilizadas

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- Despliegue en GitHub Pages


### Backend
- Node.js
- NestJS
- TypeScript
- TypeORM
- Autenticación JWT
- Swagger (Documentación API)
- Despliegue en Render


### Base de Datos
- MySQL 8.0 (Railway)

---

## 🏗️ Arquitectura del Sistema

Frontend → Backend → Base de Datos

El frontend consume los servicios REST desarrollados en NestJS mediante peticiones HTTP en formato JSON.

---

## 📂 Estructura del Proyecto
GRH
├── backend-sgrh
├── frontend-sgrh
├── grh.sql
└── arquitectura.jpg

---

## ⚙️ Instalación Backend

```bash
cd backend-sgrh
npm install
npm run start:dev

Servidor:
http://localhost:3000

Swagger:
http://localhost:3000/api


🌐 Ejecución Frontend

Abrir el archivo:
index.html
O ejecutar con Live Server en Visual Studio Code.
🗄️ Base de Datos

Importar el archivo:
grh.sql

en MySQL Workbench o phpMyAdmin.

---

🌐 Enlaces del proyecto

🔗 Frontend (Interfaz del sistema):
https://monica-ismelia.github.io/sgrh-sistema-gestion-recursos-humanos/frontend-sgrh/

🔗 Backend (Servidor - despertar servicio):
https://sgrh-sistema-gestion-recursos-humanos.onrender.com/

🔗 Documentación API (Swagger):
https://sgrh-sistema-gestion-recursos-humanos.onrender.com/api

🔐 Autenticación y Roles

El sistema utiliza autenticación basada en JWT (JSON Web Token).

Roles disponibles:

user

admin

👑 Seeder automático de Administrador

El sistema implementa un seeder automático que crea el usuario administrador al iniciar el servidor.

Funcionamiento:

Verifica si ya existe un usuario con rol admin.

Si no existe, lo crea automáticamente.

Utiliza variables de entorno seguras:

ADMIN_EMAIL

ADMIN_PASSWORD

La contraseña se almacena encriptada usando bcrypt.

Esto evita configuraciones manuales en producción y mejora la seguridad del sistema.
👩‍💻 Autor

Mónica Ismelia Cañas Reyes
Aprendiz SENA – Análisis y Desarrollo de Software