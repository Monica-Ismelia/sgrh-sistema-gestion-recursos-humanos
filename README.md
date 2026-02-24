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

### Backend
- Node.js
- NestJS
- TypeScript
- TypeORM

### Base de Datos
- MySQL 8.0

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

👩‍💻 Autor

Mónica Ismelia Cañas Reyes
Aprendiz SENA – Análisis y Desarrollo de Software