# 🐾 PetCare

Sistema integral para la gestión y cuidado de mascotas desarrollado con **Spring Boot**, **Angular** y **MySQL**.

PetCare centraliza la información de las mascotas y conecta a los dueños con profesionales del cuidado animal: permite administrar mascotas, reservar turnos, comprar productos y llevar historiales clínicos desde una única aplicación.

---

## 🚀 Funcionalidades

### 👤 Clientes (dueños de mascotas)
- Registro e inicio de sesión.
- Gestión de mascotas.
- Reserva de turnos con profesionales.
- Tienda de productos con carrito de compras.
- Gestión de tarjetas y métodos de pago.
- Historial de compras.

### 🩺 Profesionales (veterinario, paseador, peluquero, adiestrador, cuidador)
- Registro como postulante (queda pendiente hasta que lo aprueba un administrador).
- Turnos y pacientes asignados.
- Seguimiento de entrenamiento de mascotas.
- Perfil profesional.

### 🔑 Administrador
- Gestión de usuarios, mascotas, turnos y productos.
- Aprobación o rechazo de postulaciones de profesionales.
- Reportes de ventas y ganancias.

---

## 🏗️ Tecnologías

| Capa          | Tecnología                                                       |
| ------------- | ---------------------------------------------------------------- |
| Backend       | Java 21, Spring Boot 4, Spring Security, Spring Data JPA, Maven  |
| Autenticación | JWT (jjwt 0.12)                                                  |
| Frontend      | Angular 22 (componentes standalone + signals), TypeScript, CSS   |
| Base de datos | MySQL 8 (H2 en memoria para los tests)                           |
| Tests         | JUnit 5 + Mockito (backend), Jasmine + Karma (frontend)          |

---

## 📁 Estructura del proyecto

```
PetCare/
├── src/main/java/com/example/PetCare/
│   ├── config/        # Seguridad (SecurityConfiguration) y WebConfig
│   ├── security/      # JWT: JwtService, JwtAuthFilter, CustomUserDetailsService
│   ├── controller/    # Endpoints REST (/api/...)
│   ├── service/       # Lógica de negocio
│   ├── repository/    # Acceso a datos (Spring Data JPA)
│   ├── model/         # Entidades JPA
│   ├── dto/           # Objetos que entran y salen de la API
│   ├── enums/         # Roles, estados, métodos de pago
│   ├── exceptions/    # Excepciones propias + manejador global
│   └── utils/         # AuthUtils (usuario logueado)
├── src/test/          # Tests unitarios (Mockito) y de integración (H2)
└── frontend/src/app/
    ├── core/          # ApiService, AuthService, guard, interceptores, modelos
    ├── services/      # Un servicio por recurso de la API
    ├── layout/        # Layout del panel (navbar + router-outlet)
    ├── pages/
    │   ├── home/  login/  dashboard-home/  seguimiento/
    │   ├── cliente/       # mascotas, tienda, carrito, turnos, tarjetas...
    │   ├── profesional/   # inicio, mis turnos, mis pacientes, perfil...
    │   └── admin/         # usuarios, postulaciones, productos, reportes...
    └── testing/       # Helpers compartidos por los tests
```

Cada componente de Angular está en su propia carpeta con sus 4 archivos:

```
mascotas/
├── mascotas-page.component.ts       # lógica
├── mascotas-page.component.html     # template
├── mascotas-page.component.css      # estilos propios
└── mascotas-page.component.spec.ts  # tests
```

Los estilos que se repiten entre pantallas (márgenes, texto gris, botones chicos, etc.) están como clases utilitarias en `frontend/src/styles.css`.

### Formularios

En el proyecto usamos las dos formas de armar formularios que vimos en la cursada, cada una en pantallas distintas:

| Formularios | Cómo están hechos |
| ----------- | ----------------- |
| Login y registro | **Signal Forms** (`@angular/forms/signals`) |
| Todos los demás (mascotas, tarjetas, perfil, productos, filtros...) | **Reactive Forms** (`FormGroup`, `FormBuilder`, `Validators`) |

Reglas que seguimos:

- Un mismo componente nunca mezcla las dos formas.
- Las validaciones se declaran en el TypeScript y cada campo muestra su mensaje de error debajo, recién cuando el usuario lo tocó.
- Las validaciones propias (por ejemplo, que la fecha de nacimiento no sea futura) son funciones que devuelven `null` si el valor está bien, o un objeto con el nombre del error si está mal.

---

## 🔒 Seguridad: cómo funciona el login con JWT

1. El usuario hace `POST /api/auth/login` con email y contraseña.
2. Si son correctos, el backend devuelve un **token JWT** firmado con una clave secreta. El token guarda el email y el rol del usuario, y vence a las 8 horas.
3. El frontend guarda el token en `localStorage`. El `authInterceptor` lo manda en cada request:
   `Authorization: Bearer <token>`.
4. En el backend, `JwtAuthFilter` valida la firma y el vencimiento del token y carga el usuario. Con eso funcionan los `@PreAuthorize("hasRole(...)")` de los controllers.
5. El backend **no guarda sesiones** (`STATELESS`). Si el token falta, está vencido o fue modificado, responde `401` y el front vuelve al login.
6. Cerrar sesión es borrar el token del navegador.

Roles: `ADMIN`, `CLIENTE`, `VETERINARIO`, `PASEADOR`, `PELUQUERO`, `ADIESTRADOR`, `CUIDADOR`.

---

## 📦 Cómo levantarlo

### Requisitos
- Java 21
- Node 18 o superior
- MySQL 8

### Backend

```bash
cd PetCare
./mvnw spring-boot:run        # en Windows: mvnw.cmd spring-boot:run
```

Por defecto se conecta a `jdbc:mysql://localhost:3306/PetCare` con usuario `root` / `root`, y crea la base si no existe. Para usar otros datos se pueden definir estas variables de entorno:

| Variable            | Para qué                                  | Valor por defecto                         |
| ------------------- | ----------------------------------------- | ----------------------------------------- |
| `DB_URL`            | URL de MySQL                              | `jdbc:mysql://localhost:3306/PetCare?...` |
| `DB_USERNAME`       | Usuario de MySQL                          | `root`                                    |
| `DB_PASSWORD`       | Contraseña de MySQL                       | `root`                                    |
| `JWT_SECRET`        | Clave para firmar los tokens (Base64)     | clave de desarrollo                       |
| `JWT_EXPIRATION_MS` | Duración del token en milisegundos        | `28800000` (8 horas)                      |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma | `http://localhost:4200,http://localhost:8080` |

### Frontend

```bash
cd PetCare/frontend
npm install
npm start
```

La app queda en `http://localhost:4200`. Las llamadas a `/api` se redirigen al backend (`http://localhost:8080`) mediante `proxy.conf.json`.

Para generar el build de producción (`frontend/dist/`, que también sirve Spring Boot en el puerto 8080):

```bash                                   |
| `JWT_SECRET`        | Clave para firmar los tokens (Base64)     | clave de desarrollo                       |
| `JWT_EXPIRATION_MS` | Duración del token en milisegundos        | `28800000` (8 horas)                      |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos, separados por coma | `http://localhost:4200,http://localhost:8080` |

### Frontend

```bash
cd PetCare/frontend
npm install
npm start
```

La app queda en `http://localhost:4200`. Las llamadas a `/api` se redirigen al backend (`http://localhost:8080`) mediante `proxy.conf.json`.

Para generar el build de producción (`frontend/dist/`, que también sirve Spring Boot en el puerto 8080):

```bash
npm run build
```

---

## 🧪 Tests

### Backend (no hace falta MySQL: usa H2 en memoria)

```bash
cd PetCare
./mvnw test
```

- `JwtServiceTest`: generación y validación de tokens (modificados, vencidos, de otra clave).
- `AuthIntegra
### Frontend

```bash
cd PetCare/frontend
npm test            # abre Chrome y queda escuchando cambios
npm run test:ci     # una sola corrida, sin ventana (Chrome headless)
```

Cada componente tiene su `.spec.ts`. Además hay tests del login con JWT: `AuthService`, `authInterceptor`, `authGuard` y `errorInterceptor`.

---

## 👥 Autores

- Matías Zwicker
- Matías Godoy
- Matias Felissia
- Tiziana Ponce

Proyecto desarrollado para la carrera de Programación – UTN.

Al copiar, arrancá desde # 🐾 PetCare y terminá en la última línea, "Proyecto desarrollado...". Las líneas de cuatro comillas invertidas (````) del principio y del final no van: solo marcan dónde empieza y termina el archivo.

---

## 👥 Autores

- Matías Zwicker
- Matias Felissia
- Tiziana Ponce

Proyecto desarrollado para la carrera de Programación – UTN.go