# Subsistema API Gateway — `puerta-enlace-segundo-parcial-sw2`

**Framework:** NestJS (Node.js / TypeScript)  
**Base de Datos:** Ninguna (stateless)  
**Protocolo Externo:** Punto de entrada único — federa GraphQL de `clinica` y `gestion-administrativa`  
**Proveedor Cloud:** Libre (punto de entrada único)  

---

## 1. Función del Subsistema

Es el **único componente que los clientes conocen**. Actúa como punto de entrada único del ERP, recibiendo todas las peticiones del frontend Angular y la app móvil React Native. No tiene base de datos propia — es puro enrutamiento y seguridad.

### Responsabilidades principales

- Recibir todas las peticiones entrantes de clientes (Angular, React Native)
- Validar el JWT en cada petición protegida
- Aplicar rate limiting para proteger los servicios internos
- Enrutar hacia el microservicio interno correspondiente
- **Autenticación centralizada:** consulta las credenciales al servicio `clinica` (donde residen los usuarios), emite el token JWT y lo devuelve
- Federar los esquemas GraphQL de `clinica` y `gestion-administrativa` en un único endpoint unificado para Angular
- Proxy de peticiones REST hacia `bi-automatizacion`
- No exponer directamente `ia-analisis-pose`, `blockchain-firmas` ni `ml-predictivo` — estos son invocados solo internamente

---

## 2. Estándares de Codificación Aplicables

### Código TypeScript (NestJS)

| Elemento | Convención | Ejemplo |
|---|---|---|
| Clases / Guards / Estrategias | `PascalCase`, plural, español | `EstrategiasJwt`, `GuardsAutenticacion` |
| Métodos (colección) | `camelCase`, verbo infinitivo, plural | `validarCredenciales()`, `federarEsquemas()` |
| Métodos (registro único) | `camelCase`, verbo infinitivo, singular | `emitirToken()`, `verificarToken()` |
| Variables (singular) | `camelCase` | `tokenActual`, `usuarioAutenticado` |
| Variables (colección) | `camelCase`, plural | `rurasProtegidas`, `serviciosRegistrados` |

### Documentación de Métodos

Todo método con lógica de negocio debe tener JSDoc explicando **qué hace**, **qué recibe** y **qué devuelve**.

### Estructura del Repositorio

```text
/ puerta-enlace-segundo-parcial-sw2
  ├── src/
  │   ├── auth/               # Login, emisión y validación de JWT
  │   ├── proxy/              # Enrutamiento hacia microservicios internos
  │   ├── guards/             # Guards de autenticación y autorización
  │   ├── graphql-gateway/    # Federación de esquemas GraphQL
  │   └── main.ts
  ├── .env.example
  ├── .env
  ├── Dockerfile
  ├── docker-compose.yml
  └── README.md
```

---

## 3. Entidades del Microservicio

**No tiene entidades propias.** Es un servicio stateless sin base de datos. Los datos de usuario los consulta al microservicio `clinica` mediante comunicación interna.

---

## 4. Módulos del Subsistema

| # | Módulo | Descripción |
|---|---|---|
| 1 | Autenticación (Auth) | Login con correo/contraseña, emisión de JWT, refresh tokens, logout |
| 2 | Proxy / Enrutamiento | Redirección de peticiones al microservicio correspondiente según la ruta |
| 3 | GraphQL Gateway | Federación de esquemas GraphQL de `clinica` y `gestion-administrativa` en un solo endpoint |
| 4 | Rate Limiting | Protección contra abuso de peticiones |
| 5 | Guards | Validación de JWT y verificación de roles en cada petición protegida |

---

## 5. Casos de Uso Involucrados

| ID | Caso de Uso | Actor Principal |
|---|---|---|
| CU-AUTH-01 | Iniciar sesión con correo y contraseña | Cualquier usuario |
| CU-AUTH-02 | Validar token JWT en cada petición protegida | Sistema |
| CU-AUTH-03 | Renovar token de acceso (refresh token) | Usuario autenticado |
| CU-AUTH-04 | Cerrar sesión e invalidar token | Usuario autenticado |
| CU-PROXY-01 | Enrutar petición GraphQL hacia `clinica` | Frontend Angular / App Móvil |
| CU-PROXY-02 | Enrutar petición GraphQL hacia `gestion-administrativa` | Frontend Angular |
| CU-PROXY-03 | Enrutar petición REST hacia `bi-automatizacion` | Frontend Angular |
| CU-PROXY-04 | Bloquear acceso directo a microservicios internos (IA, Blockchain, ML) | Sistema |

---

## 6. Historias de Usuario

**HU-GW-01** — Como **cualquier usuario del sistema**, quiero iniciar sesión con mi correo y contraseña en un único punto de acceso, para obtener un token JWT que me permita acceder a los módulos autorizados según mi rol.

**HU-GW-02** — Como **frontend Angular**, quiero consumir un único endpoint GraphQL que combine los esquemas de `clinica` y `gestion-administrativa`, para no tener que gestionar conexiones a múltiples backends.

**HU-GW-03** — Como **administrador del sistema**, quiero que el gateway aplique rate limiting a las peticiones entrantes, para proteger los microservicios internos contra abuso o ataques de denegación de servicio.

**HU-GW-04** — Como **usuario autenticado**, quiero que el sistema renueve mi token automáticamente antes de que expire, para no tener que iniciar sesión nuevamente durante mi sesión de trabajo.

**HU-GW-05** — Como **arquitecto del sistema**, quiero que los microservicios internos (`ia-analisis-pose`, `blockchain-firmas`, `ml-predictivo`) no sean accesibles desde fuera del gateway, para garantizar que toda comunicación pase por la capa de seguridad.

---

## 7. Integraciones con Otros Microservicios

| Microservicio | Tipo de Comunicación | Propósito |
|---|---|---|
| `clinica` | GraphQL (federado) + REST interno | Consulta de credenciales para login, federación del esquema clínico |
| `gestion-administrativa` | GraphQL (federado) | Federación del esquema administrativo |
| `bi-automatizacion` | REST (proxy) | Proxy de peticiones del frontend hacia BI |
| `ia-analisis-pose` | ❌ No accesible | Solo `clinica` lo invoca internamente |
| `blockchain-firmas` | ❌ No accesible | Solo `clinica` y `gestion-administrativa` lo invocan |
| `ml-predictivo` | ❌ No accesible | Solo `bi-automatizacion` lo invoca |

---

## 8. Variables de Entorno Requeridas

```env
# Servidor
PORT=4000
NODE_ENV=development

# JWT
JWT_SECRET=<secreto-seguro>
JWT_EXPIRATION=1h
JWT_REFRESH_EXPIRATION=7d

# URLs de Microservicios Internos
CLINICA_URL=http://localhost:3000/graphql
GESTION_ADMINISTRATIVA_URL=http://localhost:3001/graphql
BI_AUTOMATIZACION_URL=http://localhost:8000/api

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

---

*Documento elaborado para la asignatura INF 423 — Ingeniería de Software II*  
*Facultad de Ciencias de la Computación y Telecomunicaciones — UAGRM*
