# EL PATRÓN - Sistema de Control Operativo Enterprise

## 🎯 Visión General

**El Patrón** es una plataforma enterprise de gobierno de la ejecución que integra frontend y backend para proporcionar un **centro de mando empresarial** donde la tecnología existe, pero está domada, gobernada y contextualizada.

### Principio Rector

> El sistema no debe verse como un CRM ni como una herramienta técnica cruda.
> Debe verse como un **centro de mando empresarial** donde lo técnico existe, pero está gobernado.

## 🏗️ Arquitectura

### Stack Tecnológico

**Frontend:**

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS
- Firebase Authentication
- Radix UI Components

**Backend:**

- Node.js + Express
- MySQL 8.0
- Firebase Admin SDK
- JWT Authentication
- Event-driven Decision Engine

### Estructura de Directorios

```
el-patron/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── enterprise/
│   │   │   │   │   └── GovernanceComponents.tsx
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── LeadsPage.tsx
│   │   │   │   ├── TasksPage.tsx
│   │   │   │   ├── N8NPage.tsx
│   │   │   │   ├── VirtualMachinesPage.tsx
│   │   │   │   └── SecurityPage.tsx
│   │   │   └── services/
│   │   │       ├── api.ts
│   │   │       └── auth.ts
│   │   └── firebase.ts
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── operationsController.js
│   │   │   ├── leadsController.js
│   │   │   ├── tasksController.js
│   │   │   ├── vmsController.js
│   │   │   └── securityController.js
│   │   ├── services/
│   │   │   ├── auditService.js
│   │   │   └── decisionEngine.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   └── seed.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   └── server.js
│   └── package.json
│
└── database/
    └── schema.sql
```

## 🚀 Instalación y Setup

### 1. Prerrequisitos

- Node.js 18+
- MySQL 8.0+
- Cuenta Firebase (para autenticación)

### 2. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE el_patron CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Importar schema
mysql -u root -p el_patron < database/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales:
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
# - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
# - JWT_SECRET

# Ejecutar seed (poblar datos iniciales)
npm run db:seed

# Iniciar servidor
npm run dev
# Servidor corriendo en http://localhost:3000
```

### 4. Frontend Setup

```bash
cd .. # volver a raíz

# Instalar dependencias
npm install

# Iniciar frontend
npm run dev
# Frontend corriendo en http://localhost:5173
```

### 5. Credenciales de Prueba

```
Administrador:
Email: admin@elpatron.com
Password: admin123

Operador:
Email: operator@elpatron.com
Password: operator123
```

## 🎨 Componentes Enterprise

El sistema incluye componentes especializados para mostrar **gobierno y control** sin exponer complejidad técnica:

### StatusChip

Muestra estados curados del sistema (nunca códigos técnicos).

```tsx
<StatusChip status="VALIDATED" />
<StatusChip status="BLOCKED" />
<StatusChip status="RESTRICTED" />
```

### ContextBadge

Muestra contexto de riesgo, confianza o gobierno.

```tsx
<ContextBadge type="risk" value={75} />
<ContextBadge type="confidence" value={90} />
<ContextBadge type="governance" value="CONTROLLED" />
```

### SystemDecision

Muestra decisiones automáticas del sistema en lenguaje de negocio.

```tsx
<SystemDecision
  type="BLOCKED"
  title="Acción Bloqueada"
  message="Operación bloqueada por política de riesgo"
  policy="RISK_AUTO_BLOCK"
/>
```

### GovernanceIndicator

Indicador visual del nivel de gobierno activo.

```tsx
<GovernanceIndicator level="HIGH" />
```

## 🧠 Motor de Decisiones

El backend incluye un **Decision Engine** que:

1. **Evalúa riesgo** de cada operación
2. **Aplica políticas** de gobierno
3. **Bloquea o valida** automáticamente
4. **Audita** todas las decisiones

### Ejemplo de Flujo

```
Usuario intenta crear operación crítica
    ↓
Decision Engine evalúa contexto:
- Rol del usuario
- Riesgo del workspace
- Prioridad de operación
- Historial del usuario
    ↓
Decisión automática:
- BLOQUEADO (si riesgo > 90)
- REQUIERE VALIDACIÓN (si riesgo > 75)
- APROBADO (si riesgo < 75)
    ↓
Frontend muestra resultado curado:
"Acción bloqueada por política de seguridad"
(No: "Error 403 - Forbidden")
```

## 📊 Base de Datos

### Tablas Principales

- **users**: Control de acceso y roles
- **workspaces**: Contexto operativo
- **operations**: Unidad central de control
- **leads**: Gestión comercial
- **tasks**: Control de ejecución
- **virtual_machines**: Infraestructura
- **workflows**: Motor de automatización
- **security_events**: Monitoreo de seguridad
- **audit_events**: Trazabilidad completa

### Vistas

- `v_operations_dashboard`: Operaciones con contexto completo
- `v_security_metrics`: Métricas de seguridad agregadas
- `v_workflow_performance`: Performance de workflows

## 🔒 Seguridad

### Autenticación

- Firebase Authentication (frontend)
- Firebase Admin SDK (backend)
- JWT tokens para API

### Autorización

- Roles: ADMIN, OPERATOR, VIEWER
- Middleware de autorización en rutas sensibles
- Políticas de gobierno en Decision Engine

### Auditoría

Todas las acciones relevantes se registran en `audit_events` con:

- Quién realizó la acción
- Qué cambió
- Por qué se tomó la decisión
- Si fue decisión del sistema o usuario

## 📈 Métricas y KPIs

El dashboard muestra:

- **Operaciones**: Total, nuevas, en progreso, completadas, bloqueadas
- **Riesgo**: Score promedio, distribución por nivel
- **Confianza**: Nivel de confianza del sistema
- **Seguridad**: Eventos críticos, auto-bloqueados, pendientes
- **Gobierno**: Nivel de restricción activo

## 🔄 Integración con N8N (Conceptual)

El sistema está diseñado para integrarse con N8N:

- **Workflows** son registrados en la DB
- **Ejecuciones** se tracean
- **Métricas** de éxito/falla se calculan
- Frontend muestra automación como **"Motor de Decisiones"**, no como herramienta técnica

## 🎯 Lenguaje de Negocio

### ✅ Usar

- "Validado automáticamente"
- "Controlado por política"
- "Bloqueado por riesgo"
- "Gobernado por el sistema"
- "Decisión automática aplicada"

### ❌ No Usar

- "Request procesado"
- "Response 200"
- "Workflow ejecutado"
- "Nodo falló"
- "Error 403"

## 📝 API Endpoints

### Operations

```
GET    /api/operations
POST   /api/operations
GET    /api/operations/:id
PATCH  /api/operations/:id/status
GET    /api/operations/dashboard/metrics
```

### Leads

```
GET    /api/leads
POST   /api/leads
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
```

### Virtual Machines

```
GET    /api/vms
POST   /api/vms
```

### Security

```
GET    /api/security/events
GET    /api/security/metrics
```

## 🔧 Variables de Entorno

### Backend (.env)

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=el_patron
DB_USER=root
DB_PASSWORD=your_password

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

JWT_SECRET=your-secret-key
RISK_THRESHOLD_HIGH=75
RISK_THRESHOLD_CRITICAL=90
AUTO_BLOCK_ENABLED=true
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:3000
```

## 🎨 Estilo de Código

### Frontend

- Componentes funcionales con TypeScript
- Hooks para estado y efectos
- Tailwind CSS para estilos
- Componentes enterprise para gobierno

### Backend

- ES Modules (import/export)
- Async/await para operaciones asíncronas
- Servicios separados para lógica de negocio
- Middleware para cross-cutting concerns

## 🐛 Troubleshooting

### Error: Cannot connect to MySQL

```bash
# Verificar que MySQL esté corriendo
sudo systemctl status mysql

# Verificar credenciales en .env
mysql -u root -p
```

### Error: Firebase authentication failed

- Verificar que Firebase Admin SDK esté configurado correctamente
- Verificar formato de FIREBASE_PRIVATE_KEY (debe incluir \n)
- Verificar que el proyecto Firebase esté activo

### Error: CORS

- Verificar FRONTEND_URL en backend/.env
- Verificar que frontend esté en puerto 5173

## 📚 Recursos

- [Documentación Firebase](https://firebase.google.com/docs)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🎯 Criterio de Éxito

El sistema está correctamente implementado si:

✅ Frontend se siente limpio y ejecutivo
✅ Backend se siente poderoso e inteligente
✅ Automatización se siente como decisiones, no como código
✅ El usuario siente **control**, no complejidad
✅ Las decisiones del sistema son visibles pero no técnicas
✅ La auditoría es completa pero transparente

---

**El Patrón** - Tu negocio, bajo control.
