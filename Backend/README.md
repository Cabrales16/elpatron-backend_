# ElPatrón CRM Backend

Backend API for ElPatrón - Operational Control Layer for CRM/ERP systems.

## Características

✅ Autenticación JWT  
✅ Control de acceso por roles (Admin/Operator)  
✅ Gestión de operaciones (Lead/Caso/Operación)  
✅ Auditoría automática de todas las acciones  
✅ Integración con n8n mediante webhooks  
✅ Control de "Entorno de Trabajo" por usuario  
✅ API documentada con Swagger  
✅ Clean Architecture (Domain, Application, Infrastructure)

## Requisitos previos

- Node.js 20+
- Docker y Docker Compose (opcional pero recomendado)
- PostgreSQL 16 (si no usas Docker)

## Instalación rápida (Docker Compose)

### 1. Clonar y configurar

```bash
cd Backend
cp .env.example .env
```

### 2. Levantar servicios

```bash
docker-compose up -d
```

Esto levantará:

- PostgreSQL en `localhost:5432`
- Backend en `localhost:3000`

### 3. Ejecutar migraciones y seed

```bash
docker-compose exec backend npm run prisma:migrate
docker-compose exec backend npm run prisma:seed
```

### 4. Acceder a la aplicación

- **API**: http://localhost:3000
- **Documentación Swagger**: http://localhost:3000/api/docs
- **Base de datos**: pgAdmin (si lo necesitas)

---

## Instalación local (sin Docker)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
# Editar .env con tus valores
```

### 3. Ejecutar migraciones

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Iniciar el servidor

```bash
npm run start:dev
```

---

## Credenciales de prueba (seed)

Después de ejecutar `prisma:seed`, tendrás:

| Email                 | Contraseña  | Rol      |
| --------------------- | ----------- | -------- |
| admin@elpatron.com    | admin123    | ADMIN    |
| operator@elpatron.com | operator123 | OPERATOR |

---

## Endpoints principales

### Autenticación

```http
POST /auth/register
POST /auth/login
GET /me
```

### Usuarios (Admin only)

```http
GET /users
POST /users
PATCH /users/:id
DELETE /users/:id
```

### Operaciones

```http
GET /operations
POST /operations
GET /operations/:id
PATCH /operations/:id
PATCH /operations/:id/status
DELETE /operations/:id
```

### Workspace

```http
GET /workspaces/me
GET /workspaces (Admin)
PATCH /workspaces/:userId/state (Admin)
```

### Auditoría

```http
GET /audit-logs (Admin)
GET /audit-logs/me
```

### Integraciones

```http
POST /integrations/n8n/test (Admin)
```

---

## Ejemplo de flujo completo

### 1. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@elpatron.com",
    "password": "operator123"
  }'
```

Respuesta:

```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid...",
    "email": "operator@elpatron.com",
    "name": "Operator User",
    "role": "OPERATOR"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 2. Crear operación

```bash
curl -X POST http://localhost:3000/operations \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Seguimiento de lead importante",
    "description": "Contactar con el cliente para confirmar interés",
    "assigneeUserId": "uuid..."
  }'
```

### 3. Cambiar estado

```bash
curl -X PATCH http://localhost:3000/operations/:operationId/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS"
  }'
```

### 4. Ver auditoría

```bash
curl http://localhost:3000/audit-logs/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Verificar workspace

```bash
curl http://localhost:3000/workspaces/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Integración con n8n

### Configurar webhook

1. En tu instancia de n8n, crea un webhook trigger
2. Copia la URL del webhook
3. Configura `N8N_WEBHOOK_URL` en `.env`:

```env
N8N_WEBHOOK_URL=http://your-n8n-instance:5678/webhook/elpatron
N8N_ENABLED=true
```

### Eventos enviados

El backend envía eventos a n8n automáticamente:

```json
{
  "eventType": "OPERATION_CREATED",
  "actorUserId": "user-id",
  "operationId": "operation-id",
  "newStatus": "NEW",
  "timestamp": "2024-01-31T10:00:00Z",
  "metadata": {
    "title": "Operation title"
  }
}
```

### Probar webhook

```bash
curl -X POST http://localhost:3000/integrations/n8n/test \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Estructura del proyecto

```
Backend/
├── src/
│   ├── domain/                    # Entidades y interfaces
│   │   ├── user.domain.ts
│   │   ├── operation.domain.ts
│   │   ├── audit.domain.ts
│   │   └── workspace.domain.ts
│   ├── application/               # Lógica de negocio
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── audit.service.ts
│   │   └── dto/
│   ├── infrastructure/            # Implementación técnica
│   │   ├── database/
│   │   │   └── repositories/
│   │   ├── auth/
│   │   │   ├── jwt.strategy.ts
│   │   │   └── role.guard.ts
│   │   ├── integrations/
│   │   │   └── n8n.service.ts
│   │   └── http/
│   │       ├── controllers/
│   │       └── modules/
│   ├── main.ts
│   └── app.module.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Mantenimiento

### Generar Prisma Client

```bash
npm run prisma:generate
```

### Ver base de datos (Prisma Studio)

```bash
npm run prisma:studio
```

### Crear nueva migración

```bash
npm run prisma:migrate
```

### Tests

```bash
npm test
npm test:watch
npm test:cov
```

---

## Variables de entorno

Ver `.env.example` para referencia completa.

| Variable        | Descripción             | Default               |
| --------------- | ----------------------- | --------------------- |
| NODE_ENV        | Entorno                 | development           |
| PORT            | Puerto del servidor     | 3000                  |
| DATABASE_URL    | Conexión PostgreSQL     | -                     |
| JWT_SECRET      | Clave JWT               | -                     |
| JWT_EXPIRATION  | Expiración del token    | 7d                    |
| N8N_WEBHOOK_URL | URL webhook n8n         | -                     |
| N8N_ENABLED     | Activar integración n8n | true                  |
| CORS_ORIGIN     | Origen CORS permitido   | http://localhost:5173 |
| LOG_LEVEL       | Nivel de logs           | debug                 |

---

## Troubleshooting

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

PostgreSQL no está corriendo. Ejecuta:

```bash
docker-compose up -d postgres
```

### Error: "Prisma Client not generated"

Ejecuta:

```bash
npm run prisma:generate
```

### Error: "Migration pending"

Ejecuta:

```bash
npm run prisma:migrate
```

---

## Próximos pasos

1. Conectar el frontend React para consumir la API
2. Expandir la integración con n8n
3. Agregar más validaciones y manejo de errores
4. Implementar pruebas e2e completas
5. Setup de CI/CD (GitHub Actions/GitLab CI)
6. Deploying a producción (AWS, Azure, etc.)

---

## Licencia

MIT
