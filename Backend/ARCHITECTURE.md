# ElPatrón CRM Backend - Arquitectura

## 📐 Estructura: Clean Architecture / Hexagonal Architecture Ligera

```
Backend/
│
├── src/
│   │
│   ├── domain/                           # 🎯 CAPA DE DOMINIO (Lógica pura)
│   │   ├── user.domain.ts               # Interfaces y enums de Usuario
│   │   ├── operation.domain.ts          # Interfaces y enums de Operación
│   │   ├── audit.domain.ts              # Interfaces y enums de Auditoría
│   │   └── workspace.domain.ts          # Interfaces y enums de Workspace
│   │
│   ├── application/                      # 🔧 CAPA DE APLICACIÓN (Casos de uso)
│   │   ├── dto/                         # Data Transfer Objects (validación)
│   │   │   ├── user.dto.ts
│   │   │   ├── operation.dto.ts
│   │   │   ├── workspace.dto.ts
│   │   │   └── ...
│   │   └── services/                    # Lógica de negocio
│   │       ├── auth.service.ts          # Autenticación
│   │       ├── audit.service.ts         # Auditoría
│   │       └── ...
│   │
│   ├── infrastructure/                   # 🏗️ CAPA DE INFRAESTRUCTURA (Detalles técnicos)
│   │   ├── database/
│   │   │   └── repositories/            # Implementación de repositorios
│   │   │       ├── user.repository.ts
│   │   │       ├── operation.repository.ts
│   │   │       ├── audit.repository.ts
│   │   │       └── workspace.repository.ts
│   │   │
│   │   ├── auth/
│   │   │   ├── jwt.strategy.ts          # Estrategia JWT (Passport)
│   │   │   └── role.guard.ts            # Guards de autorización
│   │   │
│   │   ├── integrations/
│   │   │   └── n8n.service.ts           # Integración con n8n
│   │   │
│   │   └── http/
│   │       ├── controllers/             # HTTP Controllers (NestJS)
│   │       │   ├── auth.controller.ts
│   │       │   ├── users.controller.ts
│   │       │   ├── operations.controller.ts
│   │       │   ├── workspaces.controller.ts
│   │       │   └── audit-logs.controller.ts
│   │       │
│   │       └── modules/                 # NestJS Modules
│   │           ├── auth.module.ts
│   │           ├── users.module.ts
│   │           ├── operations.module.ts
│   │           ├── workspaces.module.ts
│   │           └── integration.module.ts
│   │
│   ├── main.ts                           # ⚙️ Punto de entrada de la aplicación
│   └── app.module.ts                    # Módulo raíz de NestJS
│
├── prisma/
│   ├── schema.prisma                    # 🗄️ Schema de base de datos
│   └── seed.ts                          # Datos iniciales
│
├── package.json                          # Dependencias
├── tsconfig.json                        # Configuración TypeScript
├── docker-compose.yml                   # 🐳 Orquestación de contenedores
├── Dockerfile                           # Imagen Docker
├── .env.example                         # Variables de entorno (ejemplo)
├── .prettierrc                          # Configuración de formato
├── .gitignore
│
├── README.md                            # Documentación principal
├── QUICK_START.md                       # Guía de inicio rápido
├── CURL_EXAMPLES.sh                     # Ejemplos de requests
└── ElPatron-API.postman_collection.json # Colección Postman
```

---

## 🔄 Flujo de datos: Request → Response

```
HTTP Request
    ↓
[Controller]                              # Recibe y valida
    ↓
[Service (Application)]                   # Lógica de negocio
    ↓
[Repository (Infrastructure)]             # Acceso a datos
    ↓
[Prisma/PostgreSQL]                      # Base de datos
    ↓
Repository                                # Retorna datos
    ↓
Service                                   # Procesa respuesta + Auditoría
    ↓
Controller                                # Formatea y retorna
    ↓
HTTP Response
```

---

## 🎯 Componentes clave

### 1. **Domain Layer** (src/domain/)

Define las entidades, interfaces y reglas de negocio.

**NO depende de nada** - es independiente.

```typescript
// user.domain.ts
export interface IUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface IUserRepository {
  create(data: ...): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
}
```

### 2. **Application Layer** (src/application/)

Contiene la lógica de casos de uso, DTOs y servicios.

Depende solo de **Domain**.

```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  async generateToken(userId: string, email: string, role: string) {
    // Lógica de generación de token
  }
}
```

### 3. **Infrastructure Layer** (src/infrastructure/)

Implementación técnica: BD, HTTP, autenticación.

Depende de **Domain** y **Application**.

```typescript
// user.repository.ts
@Injectable()
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

---

## 🔐 Seguridad

### Autenticación

- **JWT** via `@nestjs/jwt` y `passport-jwt`
- Tokens firmados con `JWT_SECRET`
- Expirables (por defecto 7 días)

### Autorización

- **Guards** por rol: `AdminGuard`, `OperatorGuard`
- Validación en cada endpoint

### Hashing de Contraseñas

- **bcrypt** para almacenar contraseñas
- Nunca se retornan en respuestas

### Validación de entrada

- **class-validator** en los DTOs
- Whitelist de campos permitidos

---

## 📊 Auditoría automática

Cada acción importante registra:

- **Quién**: `actorUserId`
- **Qué**: `action` (CREATE, UPDATE, DELETE, STATUS_CHANGE, LOGIN)
- **Dónde**: `entity` (USER, OPERATION, WORKSPACE)
- **Cuándo**: `createdAt`
- **Cómo**: `metadata` (cambios realizados)

```json
{
  "id": "audit-log-id",
  "actorUserId": "user-id",
  "action": "STATUS_CHANGE",
  "entity": "OPERATION",
  "entityId": "operation-id",
  "metadata": {
    "previousStatus": "NEW",
    "newStatus": "IN_PROGRESS"
  },
  "createdAt": "2024-01-31T10:00:00Z"
}
```

---

## 🔗 Integración con n8n

### Flujo

1. Evento ocurre en backend (e.g., crear operación)
2. Backend envía webhook a n8n con datos del evento
3. n8n procesa el evento (automaciones, notificaciones, etc.)

### Evento

```json
{
  "eventType": "OPERATION_STATUS_CHANGED",
  "actorUserId": "user-id",
  "operationId": "operation-id",
  "previousStatus": "NEW",
  "newStatus": "IN_PROGRESS",
  "timestamp": "2024-01-31T10:00:00Z",
  "metadata": { ... }
}
```

### Configuración

```env
N8N_WEBHOOK_URL=http://your-n8n:5678/webhook/elpatron
N8N_ENABLED=true
```

---

## 🗄️ Base de datos

### Tablas principales

| Tabla       | Descripción                    |
| ----------- | ------------------------------ |
| `user`      | Usuarios del sistema           |
| `operation` | Operaciones/Casos/Leads        |
| `audit_log` | Registro de auditoría          |
| `workspace` | Entorno de trabajo por usuario |

### Relaciones

```
User (1) ──→ (N) Operation [assignee]
User (1) ──→ (N) AuditLog [actor]
User (1) ──→ (1) Workspace
Operation (1) ←── (N) AuditLog
```

---

## 🚀 Escalabilidad

### Ahora (Prototipo)

- API monolítica en NestJS
- PostgreSQL single instance
- n8n optional

### Futuro (Producción)

- Microservicios (Auth, Operations, Integrations)
- Cache distribuido (Redis)
- Message Queue (RabbitMQ, Kafka)
- Base de datos replicada
- Monitoring y logging centralizado

---

## 🧪 Testing

```typescript
// Services: Unit tests (lógica pura)
// Controllers: Integration tests (con repositorio mock)
// E2E: Full stack tests (con DB real)

npm test              # Ejecutar tests
npm test:watch       # Watch mode
npm test:cov         # Coverage report
npm test:e2e         # E2E tests
```

---

## 📈 Flujo típico de una operación

```
1. User login                           → JWT token
2. Create operation                     → Stored in DB + Audit log created
3. Event → n8n webhook                 → Automation triggered
4. Change status                        → Audit log + Webhook
5. Admin checks audit logs              → Full history visible
6. Admin manages workspaces             → Control per user
```

---

## 🔧 Extensión futura

Para agregar un nuevo recurso (ej: "Clientes"):

1. **Domain**

   ```typescript
   // src/domain/customer.domain.ts
   export interface ICustomer { ... }
   ```

2. **Application**

   ```typescript
   // src/application/dto/customer.dto.ts
   // src/application/services/customer.service.ts
   ```

3. **Infrastructure**

   ```typescript
   // src/infrastructure/database/repositories/customer.repository.ts
   // src/infrastructure/http/controllers/customers.controller.ts
   // src/infrastructure/http/modules/customers.module.ts
   ```

4. **Database**

   ```prisma
   // prisma/schema.prisma
   model Customer { ... }
   ```

5. **App Module**
   ```typescript
   // src/app.module.ts
   import { CustomersModule } from '...';
   @Module({ imports: [..., CustomersModule] })
   ```

---

## 📚 Referencias

- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

Última actualización: 31 de enero de 2024
