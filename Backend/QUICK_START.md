# 🚀 Guía de Inicio Rápido - ElPatrón Backend

## Requisitos

- Node.js 20+
- Docker y Docker Compose (recomendado)
- Git

## Opción 1: Inicio rápido con Docker (Recomendado)

### Paso 1: Configurar

```bash
cd Backend
cp .env.example .env
```

### Paso 2: Levantar servicios

```bash
docker-compose up -d
```

**Esto levanta:**

- PostgreSQL en `localhost:5432`
- Backend en `localhost:3000`

### Paso 3: Esperar a que PostgreSQL esté listo (5-10 segundos)

```bash
docker-compose logs -f postgres
# Busca el mensaje: "database system is ready to accept connections"
```

### Paso 4: Ejecutar migraciones y seed

```bash
docker-compose exec backend npm run prisma:migrate:prod
docker-compose exec backend npm run prisma:seed
```

### Paso 5: ¡Listo! 🎉

Accede a:

- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Base de datos**: postgresql://elpatron:elpatron123@localhost:5432/elpatron_db

---

## Opción 2: Inicio local (sin Docker)

### Paso 1: Instalar dependencias

```bash
npm install
```

### Paso 2: Configurar variables de entorno

```bash
cp .env.example .env
```

Edita `.env` y asegúrate de tener PostgreSQL corriendo:

```env
DATABASE_URL=postgresql://elpatron:elpatron123@localhost:5432/elpatron_db
```

### Paso 3: Preparar base de datos

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### Paso 4: Iniciar servidor

```bash
npm run start:dev
```

Verás:

```
✅ ElPatrón Backend running on http://localhost:3000
📚 API Documentation: http://localhost:3000/api/docs
```

---

## 🔐 Credenciales de prueba

Tras ejecutar `prisma:seed`, tienes acceso con:

| Rol      | Email                 | Contraseña  |
| -------- | --------------------- | ----------- |
| Admin    | admin@elpatron.com    | admin123    |
| Operator | operator@elpatron.com | operator123 |

---

## 📋 Flujo de prueba rápido (5 minutos)

### 1️⃣ Abre Swagger UI

Navega a: http://localhost:3000/api/docs

### 2️⃣ Login

1. Haz clic en `POST /auth/login`
2. Haz clic en "Try it out"
3. Reemplaza el body con:
   ```json
   {
     "email": "operator@elpatron.com",
     "password": "operator123"
   }
   ```
4. Haz clic en "Execute"
5. **Copia el `token` de la respuesta**

### 3️⃣ Autorizar en Swagger

1. Haz clic en el botón "Authorize" (arriba a la derecha)
2. Pega el token en el campo: `Bearer [tu-token]`
3. Haz clic en "Authorize"

### 4️⃣ Crear una operación

1. Navega a `POST /operations`
2. Haz clic en "Try it out"
3. Reemplaza el body:
   ```json
   {
     "title": "Mi primera operación",
     "description": "Seguimiento de cliente importante",
     "assigneeUserId": "[userId del login]"
   }
   ```
4. Haz clic en "Execute"
5. **Copia el `id` de la respuesta**

### 5️⃣ Cambiar estado de operación

1. Navega a `PATCH /operations/{id}/status`
2. Haz clic en "Try it out"
3. Pega el operation ID en el campo `id`
4. Reemplaza el body:
   ```json
   {
     "status": "IN_PROGRESS"
   }
   ```
5. Haz clic en "Execute"

### 6️⃣ Ver auditoría

1. Navega a `GET /audit-logs/me`
2. Haz clic en "Execute"
3. ¡Verás el registro de todas tus acciones!

### 7️⃣ Verificar workspace

1. Navega a `GET /workspaces/me`
2. Haz clic en "Execute"
3. Verás el estado de tu entorno de trabajo

---

## 🧪 Alternativa: Usar CURL

```bash
# 1. Login
TOKEN=$(curl -s http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@elpatron.com",
    "password": "operator123"
  }' | jq -r '.token')

# 2. Crear operación
curl -s http://localhost:3000/operations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Seguimiento",
    "description": "Llamar cliente",
    "assigneeUserId": "operation-assignee-id"
  }' | jq '.'
```

Ver más ejemplos en `CURL_EXAMPLES.sh`

---

## 📮 Postman

1. Abre Postman
2. Importa: `ElPatron-API.postman_collection.json`
3. Configura variables:
   - `base_url`: `http://localhost:3000`
4. Ejecuta las requests

---

## 🛠️ Comandos útiles

```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Entrar a la consola del backend
docker-compose exec backend bash

# Entrar a PostgreSQL
docker-compose exec postgres psql -U elpatron -d elpatron_db

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart

# Ver estado de Prisma
npm run prisma:studio

# Crear nueva migración
npm run prisma:migrate
```

---

## 🧪 Verificar integración n8n

Si configuraste n8n:

```bash
curl -X POST http://localhost:3000/integrations/n8n/test \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Deberías ver:

```json
{
  "success": true,
  "message": "Webhook test successful"
}
```

---

## ❌ Troubleshooting

### Error: "Connection refused"

```bash
# Asegúrate que Docker está corriendo
docker ps

# Levanta los servicios
docker-compose up -d
```

### Error: "Prisma Client not generated"

```bash
npm run prisma:generate
```

### Error: "Migration pending"

```bash
npm run prisma:migrate:prod
```

### Puerto 3000 ya en uso

```bash
# Cambia en .env
PORT=3001

# O mata el proceso
lsof -i :3000
kill -9 <PID>
```

### Base de datos no se conecta

```bash
# Reinicia PostgreSQL
docker-compose restart postgres

# Verifica credenciales en .env
# DATABASE_URL debe estar correcta
```

---

## 📞 Soporte

- Documentación: Swagger en http://localhost:3000/api/docs
- Logs: `docker-compose logs -f`
- Prisma Studio: `npm run prisma:studio`

---

## 🎯 Próximos pasos

1. ✅ Backend funcionando
2. ➡️ Conectar frontend (React)
3. ➡️ Configurar n8n con webhooks
4. ➡️ Agregar más funcionalidades
5. ➡️ Deploy a producción

¡Diviértete! 🎉
