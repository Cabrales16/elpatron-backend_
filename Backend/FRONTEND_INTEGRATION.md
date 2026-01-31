# 🔗 Integración Frontend-Backend

Guía para conectar tu frontend React con el backend de ElPatrón.

## 📡 Configuración base

### 1. Instalar cliente HTTP (ya probable que lo tengas)

```bash
# En el Frontend/
npm install axios
```

### 2. Crear archivo de configuración de API

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Configurar variable de entorno

```env
# .env o .env.local (en Frontend/)
VITE_API_URL=http://localhost:3000
```

## 🔐 Servicio de autenticación

```typescript
// src/services/authService.ts
import apiClient from './api';

export const authService = {
  login: (email: string, password: string) => apiClient.post('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),

  getCurrentUser: () => apiClient.get('/me'),

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },
};
```

## 📋 Servicio de operaciones

```typescript
// src/services/operationsService.ts
import apiClient from './api';

export const operationsService = {
  getAll: (status?: string, assigneeId?: string) =>
    apiClient.get('/operations', {
      params: { status, assigneeUserId: assigneeId },
    }),

  create: (title: string, description?: string, assigneeUserId?: string) =>
    apiClient.post('/operations', { title, description, assigneeUserId }),

  getById: (id: string) => apiClient.get(`/operations/${id}`),

  update: (id: string, data: any) => apiClient.patch(`/operations/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/operations/${id}/status`, { status }),

  delete: (id: string) => apiClient.delete(`/operations/${id}`),
};
```

## 🏢 Servicio de workspace

```typescript
// src/services/workspaceService.ts
import apiClient from './api';

export const workspaceService = {
  getMyWorkspace: () => apiClient.get('/workspaces/me'),

  getAll: () => apiClient.get('/workspaces'),

  updateState: (userId: string, state: string, notes?: string) =>
    apiClient.patch(`/workspaces/${userId}/state`, { state, notes }),
};
```

## 📝 Ejemplo: Usar en componentes

### Login Component

```typescript
// src/app/components/Login.tsx
import { authService } from '@services/authService';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;

      // Guardar token
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Email o contraseña incorrectos');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
      />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Operations Page

```typescript
// src/app/components/OperationsPage.tsx
import { operationsService } from '@services/operationsService';
import { useEffect, useState } from 'react';

export function OperationsPage() {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    try {
      const response = await operationsService.getAll();
      setOperations(response.data);
    } catch (error) {
      console.error('Failed to load operations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (operationId: string, newStatus: string) => {
    try {
      await operationsService.updateStatus(operationId, newStatus);
      loadOperations(); // Recargar lista
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      {operations.map((op: any) => (
        <div key={op.id}>
          <h3>{op.title}</h3>
          <p>{op.description}</p>
          <select
            value={op.status}
            onChange={(e) => handleStatusChange(op.id, e.target.value)}
          >
            <option value="NEW">Nuevo</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="DONE">Completado</option>
            <option value="BLOCKED">Bloqueado</option>
          </select>
        </div>
      ))}
    </div>
  );
}
```

### Workspace Status Banner

```typescript
// src/app/components/WorkspaceStatusBanner.tsx
import { workspaceService } from '@services/workspaceService';
import { useEffect, useState } from 'react';

export function WorkspaceStatusBanner() {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    workspaceService.getMyWorkspace().then((res) => {
      setWorkspace(res.data);
    });
  }, []);

  if (!workspace) return null;

  const stateColor = {
    ACTIVE: 'bg-green-500',
    RESTRICTED: 'bg-yellow-500',
    BLOCKED: 'bg-red-500',
  };

  return (
    <div className={`${stateColor[workspace.state]} p-4 text-white rounded`}>
      <strong>Entorno:</strong> {workspace.state}
      {workspace.notes && <p className="text-sm mt-2">{workspace.notes}</p>}
    </div>
  );
}
```

## 🎯 Flujo de autenticación

```
Login (email + password)
    ↓
Backend valida y retorna JWT token
    ↓
Frontend guarda token en localStorage
    ↓
Cada request agrega header: "Authorization: Bearer {token}"
    ↓
Backend valida JWT y retorna datos
    ↓
Si token expira → Frontend limpia localStorage y redirige a login
```

## 🚨 Manejo de errores

```typescript
// src/utils/errorHandler.ts
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    // No autorizado - redirigir a login
    localStorage.removeItem('auth_token');
    return 'Sesión expirada. Por favor inicia sesión nuevamente.';
  }

  if (error.response?.status === 403) {
    // Acceso denegado
    return 'No tienes permisos para realizar esta acción.';
  }

  if (error.response?.status === 400) {
    // Bad request - problemas con datos
    return error.response.data?.message || 'Datos inválidos.';
  }

  if (error.response?.status === 500) {
    // Error del servidor
    return 'Error del servidor. Por favor intenta más tarde.';
  }

  return error.message || 'Ocurrió un error desconocido.';
};
```

## 📊 Integración con contexto global (opcional)

```typescript
// src/context/AuthContext.tsx
import { createContext, useContext, useState } from 'react';
import { authService } from '@services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password);
    const { token, user: userData } = response.data;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

## 🔄 CORS en el backend

Ya está configurado. El backend permite requests desde `http://localhost:5173` (puerto por defecto de Vite).

Para cambiar, edita `.env` en el Backend:

```env
CORS_ORIGIN=http://localhost:5173
```

## ✅ Checklist de integración

- [ ] Backend está corriendo en `http://localhost:3000`
- [ ] Frontend tiene `VITE_API_URL` configurado
- [ ] `apiClient` con interceptors configurado
- [ ] Servicios de API creados (auth, operations, workspace)
- [ ] Componentes conectados a servicios
- [ ] Token JWT guardado/eliminado correctamente
- [ ] Rutas protegidas redirigen a login si no hay token
- [ ] Workspace banner muestra en dashboard
- [ ] Cambios de estado envían eventos a n8n

---

## 🐛 Troubleshooting

### "CORS error"

- Verifica que backend está corriendo
- Checa `CORS_ORIGIN` en backend `.env`
- Usa `http://` no `https://`

### "401 Unauthorized"

- Token expiró - hace login de nuevo
- Token no se guardó - verifica localStorage

### "404 Not Found"

- Verifica que la URL de API es correcta
- Backend puede estar caído

### Requests lentos

- Checa logs del backend: `docker-compose logs -f backend`
- Puede haber problema con n8n webhook (pero continúa funcionando)

---

Ahora tu frontend está listo para consumir el backend! 🎉
