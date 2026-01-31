# EL PATRÓN - Sistema de Control Operativo Enterprise

<div align="center">

![ElPatrón](assets/logoColor.png)

**Tu negocio, bajo control**

Sistema enterprise de gobierno de la ejecución que integra gestión comercial, infraestructura, automatización y seguridad en un centro de mando unificado.

[Documentación](#-documentación) •
[Instalación](#-instalación-rápida) •
[Características](#-características) •
[Arquitectura](#-arquitectura)

</div>

---

## 🎯 Visión

**El Patrón** no es un CRM tradicional. Es un **centro de mando empresarial** donde:

- ✅ La tecnología **existe**, pero está **domada**
- ✅ El sistema **piensa**, evalúa y **decide**
- ✅ El usuario siente **control**, no complejidad
- ✅ Cada acción es **gobernada** y **auditada**

## 🚀 Características Principales

### 🎛️ Centro de Control Operativo

- Dashboard ejecutivo con métricas en tiempo real
- Visualización de decisiones automáticas del sistema
- Indicadores de gobierno y riesgo

### 🧠 Motor de Decisiones Inteligente

- Evaluación automática de riesgo
- Políticas de gobierno configurables
- Bloqueo automático de acciones de alto riesgo
- Validación asistida por sistema

### 📊 Gestión Integral

- **Operaciones**: Seguimiento de ejecución con contexto de gobierno
- **Leads**: CRM comercial con calificación automática
- **Tareas**: Kanban con priorización inteligente
- **VMs**: Gestión de infraestructura cloud
- **Seguridad**: Monitoreo y respuesta automática
- **N8N**: Automatización como motor de decisiones

### 🔒 Seguridad y Auditoría

- Autenticación Firebase + JWT
- Control de acceso basado en roles
- Auditoría completa de todas las acciones
- Decisiones del sistema trazables
- Bloqueo automático de amenazas

### 🎨 UX Enterprise

- Interfaz limpia y ejecutiva
- Lenguaje de negocio (no técnico)
- Componentes de gobierno visual
- Estados curados (no códigos HTTP)

## 📁 Estructura del Proyecto

```
el-patron/
├── frontend/              # React + TypeScript + Vite
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── enterprise/    # Componentes de gobierno
│   │   │   └── services/
│   │   └── firebase.ts
│   └── package.json
│
├── backend/               # Node.js + Express + MySQL
│   ├── src/
│   │   ├── controllers/   # Lógica de endpoints
│   │   ├── services/      # Decision Engine + Audit
│   │   ├── middleware/    # Auth + Error Handling
│   │   ├── database/      # Connection + Seed
│   │   └── routes/
│   └── package.json
│
└── database/
    └── schema.sql         # Schema MySQL completo
```

## 🛠️ Instalación Rápida

### Prerrequisitos

- Node.js 18+
- MySQL 8.0+
- Cuenta Firebase

### 1. Clonar y Setup

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/el-patron.git
cd el-patron

# Frontend
npm install

# Backend
cd backend
npm install
cp .env.example .env
```

### 2. Configurar Base de Datos

```bash
# Crear base de datos
mysql -u root -p
CREATE DATABASE el_patron CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# Importar schema
mysql -u root -p el_patron < ../database/schema.sql

# Poblar datos iniciales
npm run db:seed
```

### 3. Configurar Variables de Entorno

Editar `backend/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=el_patron

FIREBASE_PROJECT_ID=tu-proyecto
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."

JWT_SECRET=tu-secret-key
```

### 4. Iniciar Aplicación

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Servidor en http://localhost:3000

# Terminal 2 - Frontend
cd ..
npm run dev
# Frontend en http://localhost:5173
```

### 5. Acceder

```
URL: http://localhost:5173/login

Admin:
Email: admin@elpatron.com
Password: admin123

Operador:
Email: operator@elpatron.com
Password: operator123
```

## 🏗️ Arquitectura

### Frontend

- **React 18** + TypeScript
- **Vite** (build)
- **Tailwind CSS** (estilos)
- **Firebase Auth** (autenticación)
- **Radix UI** (componentes)

### Backend

- **Node.js** + Express
- **MySQL** (base de datos)
- **Firebase Admin SDK** (tokens)
- **Decision Engine** (IA de gobierno)
- **Audit Service** (trazabilidad)

### Base de Datos

- 13 tablas principales
- 3 vistas para reporting
- Índices optimizados
- Relaciones con integridad referencial

## 🧩 Componentes Enterprise

### StatusChip

```tsx
<StatusChip status="VALIDATED" />
<StatusChip status="BLOCKED" />
<StatusChip status="RESTRICTED" />
```

### ContextBadge

```tsx
<ContextBadge type="risk" value={85} />
<ContextBadge type="confidence" value={95} />
<ContextBadge type="governance" value="CONTROLLED" />
```

### SystemDecision

```tsx
<SystemDecision
  type="BLOCKED"
  title="Acción Bloqueada"
  message="Operación bloqueada por política de riesgo"
  policy="RISK_AUTO_BLOCK"
/>
```

### GovernanceIndicator

```tsx
<GovernanceIndicator level="HIGH" />
```

## 📊 Motor de Decisiones

El **Decision Engine** evalúa automáticamente cada acción:

1. **Analiza contexto**: usuario, workspace, historial
2. **Calcula riesgo**: 0-100 basado en múltiples factores
3. **Aplica políticas**: reglas de gobierno configurables
4. **Decide**: Aprobar, Validar o Bloquear
5. **Audita**: Registra decisión con justificación

### Ejemplo de Evaluación

```javascript
Operación: Crear VM crítica
Usuario: Operador (no Admin)
Workspace: Riesgo Alto

→ Decision Engine:
  - Factor usuario: +20 (no es Admin)
  - Factor operación: +90 (prioridad crítica)
  - Factor workspace: +25 (riesgo alto)

  Score Total: 85/100 → BLOQUEADO

→ Frontend muestra:
  "Operadores no pueden crear operaciones críticas"
  (No: "Error 403 - Forbidden")
```

## 🔐 Seguridad

- **Autenticación**: Firebase + JWT
- **Autorización**: Roles (ADMIN/OPERATOR/VIEWER)
- **Auditoría**: Todas las acciones registradas
- **Encriptación**: Passwords hasheados (bcrypt)
- **Rate Limiting**: Protección contra ataques
- **CORS**: Configurado para frontend específico

## 📈 Métricas del Sistema

El dashboard muestra:

- **Operaciones**: Total, en ejecución, completadas, bloqueadas
- **Riesgo**: Score promedio del sistema
- **Confianza**: Nivel de confianza en decisiones
- **Seguridad**: Eventos críticos, auto-bloqueados
- **Gobierno**: Nivel de restricción activo

## 🎨 Filosofía de Diseño

### ✅ Hacer

- Usar lenguaje de negocio
- Mostrar estados curados
- Explicar decisiones del sistema
- Visualizar gobierno activo
- Mantener UI limpia y ejecutiva

### ❌ No Hacer

- Exponer errores HTTP crudos
- Mostrar logs o JSON sin curar
- Usar términos técnicos (request, response, payload)
- Sobrecargar con datos innecesarios
- Romper la estética empresarial

## 📚 Documentación Completa

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para:

- Guía de instalación detallada
- Configuración de producción
- API endpoints completos
- Troubleshooting
- Variables de entorno

## 🤝 Contribuir

Este es un proyecto enterprise. Para contribuir:

1. Fork el repositorio
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre Pull Request

## 📝 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles

## 🎯 Criterio de Éxito

El sistema está bien implementado si al usarlo, piensas:

> "Aquí no solo trabajo.  
> Aquí el sistema me observa, me cuida y gobierna la ejecución."

---

<div align="center">

**EL PATRÓN** - Sistema de Control Operativo Enterprise

Diseñado originalmente en [Figma](https://www.figma.com/design/JJylIVWoM1MqV3bCwML5EL/Dise%C3%B1o-de-interfaz-CRM)

</div>
