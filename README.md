# puerta-enlace-segundo-parcial-sw2

API Gateway del ERP Fisioterapia — punto de entrada único para clientes Angular y React Native.

**Framework:** NestJS (Node.js / TypeScript)  
**Puerto:** 4000  
**Asignatura:** INF 423 — Ingeniería de Software II — UAGRM

---

## Arranque

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env y completar JWT_SECRET con un valor seguro

# Modo desarrollo (hot-reload)
pnpm run start:dev

# Compilar para producción
pnpm run build
pnpm run start:prod
```

---

## Variables de entorno (`.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto del gateway | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `JWT_SECRET` | Secreto para firmar JWT | `cambiar-en-produccion` |
| `JWT_EXPIRATION` | Expiración del token de acceso | `1h` |
| `JWT_REFRESH_EXPIRATION` | Expiración del refresh token | `7d` |
| `CLINICA_URL` | Base URL REST del microservicio clínica | `http://localhost:3000/api` |
| `GESTION_ADMINISTRATIVA_URL` | URL GraphQL de gestión administrativa | `http://localhost:3001/graphql` |
| `BI_AUTOMATIZACION_URL` | Base URL REST del microservicio BI | `http://localhost:8000/api` |
| `RATE_LIMIT_TTL` | Ventana de rate limiting (segundos) | `60` |
| `RATE_LIMIT_MAX` | Máximo de peticiones por ventana | `100` |

---

## Endpoints REST de autenticación

Todos bajo el prefijo `/api`.

### `POST /api/auth/login`

Inicia sesión. Consulta credenciales al microservicio `clinica` y emite JWT.

**Body:**
```json
{
  "correo": "juan.perez@correo.com",
  "contrasena": "mi_contrasena"
}
```

**Respuesta 200:**
```json
{
  "tokenAcceso": "<jwt>",
  "tokenRefresco": "<jwt-refresh>",
  "usuario": {
    "id": "<uuid>",
    "correo": "juan.perez@correo.com",
    "roles": ["paciente"],
    "estado": "activo",
    "persona": {
      "id": "<uuid>",
      "nombre": "Juan",
      "apellido": "Pérez",
      "ci": "8765432",
      "telefono": "78945612"
    }
  }
}
```

### `POST /api/auth/refresh`

Renueva el token de acceso con un refresh token válido.

**Body:**
```json
{ "tokenRefresco": "<jwt-refresh>" }
```

**Respuesta 200:**
```json
{ "tokenAcceso": "<nuevo-jwt>" }
```

### `POST /api/auth/logout`

Cierra sesión (stateless — el cliente descarta los tokens).

**Respuesta 200:**
```json
{ "mensaje": "Sesión cerrada correctamente" }
```

---

## Contrato con el microservicio `clinica`

El gateway espera que `clinica` exponga:

```
POST {CLINICA_URL}/usuarios/validar-credenciales
Body: { "correo": string, "contrasena": string }
```

Respuesta exitosa: datos del usuario (incluyendo `roles` y `persona`).  
Respuesta de credenciales inválidas: HTTP 401.

---

## Uso de guards en otros módulos

```typescript
import { GuardsAutenticacion } from '../guards/guard-autenticacion';
import { GuardsRoles } from '../guards/guard-roles';
import { Roles } from '../guards/decoradores/roles.decorator';

@UseGuards(GuardsAutenticacion, GuardsRoles)
@Roles('admin', 'medico')
@Get('recurso-protegido')
obtenerRecurso() { ... }
```

---

## Estructura del proyecto

```
src/
├── auth/               # Login, emisión y validación de JWT
├── guards/             # GuardsAutenticacion, GuardsRoles, decoradores
├── proxy/              # Enrutamiento hacia microservicios (pendiente)
├── graphql-gateway/    # Federación GraphQL clinica + gestion-administrativa (pendiente)
├── configuracion/      # ConfigModule global
├── app.module.ts
└── main.ts
```
