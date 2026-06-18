# 🐾 PetCare

Sistema integral para la gestión y cuidado de mascotas desarrollado con Spring Boot, React y MySQL.

## 📋 Descripción

PetCare es una aplicación web diseñada para centralizar la información de las mascotas y facilitar la interacción entre dueños y profesionales del cuidado animal.

La plataforma permite administrar mascotas, reservar turnos, contratar servicios profesionales, realizar compras de productos y gestionar historiales clínicos desde una única aplicación.

---

## 🚀 Funcionalidades Principales

### 👤 Dueños de Mascotas

* Registro e inicio de sesión.
* Gestión de mascotas.
* Reserva de turnos con profesionales.
* Consulta de turnos activos.
* Compra de productos para mascotas.
* Gestión de tarjetas y métodos de pago.
* Carrito de compras integrado.

### 🩺 Profesionales

* Registro de postulaciones.
* Aprobación por parte del administrador.
* Gestión de pacientes asignados.
* Consulta de turnos.
* Perfil profesional.
* Seguimiento de mascotas.

### 🔑 Administrador

* Gestión de usuarios.
* Gestión de profesionales y postulaciones.
* Gestión de mascotas registradas.
* Gestión de turnos.
* Gestión de productos.
* Visualización de reportes y estadísticas.

---

## 🏗️ Arquitectura

### Backend

* Java 21
* Spring Boot 4
* Spring Security
* Spring Data JPA
* Hibernate
* Maven

### Frontend

* React
* React Router
* JavaScript
* CSS

### Base de Datos

* MySQL 8

---

## 🗄️ Modelo de Datos

Principales entidades:

* Usuario
* Profesional
* Mascota
* Turno
* Historial Clínico
* Vacuna
* Medicamento
* Producto
* Carrito
* Tarjeta
* Recordatorio
* Seguimiento de Entrenamiento

---

## 🔒 Seguridad

La aplicación implementa:

* Autenticación mediante Spring Security.
* Control de acceso por roles.
* Gestión de sesiones.
* Protección de endpoints según permisos.

Roles disponibles:

* ADMIN
* DUEÑO
* VETERINARIO
* PASEADOR
* PELUQUERO
* ADIESTRADOR
* CUIDADOR

---

## 📦 Instalación

### Clonar repositorio

```bash
git clone <url-del-repositorio>
```

### Configurar base de datos

Crear una base de datos MySQL:

```sql
CREATE DATABASE veterinaria;
```

Configurar credenciales en:

```properties
src/main/resources/application.properties
```

### Ejecutar Backend

```bash
./mvnw spring-boot:run
```

o en Windows:

```bash
mvnw.cmd spring-boot:run
```

### Ejecutar Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Tecnologías Utilizadas

| Tecnología      | Uso                     |
| --------------- | ----------------------- |
| Java 21         | Backend                 |
| Spring Boot     | API REST                |
| Spring Security | Seguridad               |
| Spring Data JPA | Persistencia            |
| Hibernate       | ORM                     |
| MySQL           | Base de datos           |
| React           | Frontend                |
| Maven           | Gestión de dependencias |
| Git / GitHub    | Control de versiones    |

---

## 👥 Autores

* Matías Zwicker
* Matías Godoy
* Matias Felissia
* Tiziana Ponce

Proyecto desarrollado para la carrera de Programación – UTN.
