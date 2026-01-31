# 🚀 SETUP INICIAL - EL PATRÓN

Sigue estos pasos para configurar el sistema por primera vez.

## ✅ Checklist de Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [ ] Node.js 18 o superior (`node --version`)
- [ ] MySQL 8.0 o superior (`mysql --version`)
- [ ] npm o yarn (`npm --version`)
- [ ] Git (`git --version`)

## 📋 Pasos de Configuración

### 1. Instalar Dependencias

```bash
# En la raíz del proyecto (frontend)
npm install

# En el backend
cd backend
npm install
cd ..
```

### 2. Configurar MySQL

```bash
# Iniciar MySQL
sudo systemctl start mysql  # Linux
# o
brew services start mysql   # macOS

# Crear base de datos
mysql -u root -p
```

En el prompt de MySQL:

```sql
CREATE DATABASE el_patron CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON el_patron.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Importar Schema

```bash
mysql -u root -p el_patron < database/schema.sql
```

### 4. Configurar Backend

```bash
cd backend

# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tu editor favorito
nano .env
# o
code .env
```

**Configuración mínima requerida en `.env`:**

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=el_patron
DB_USER=root
DB_PASSWORD=TU_PASSWORD_MYSQL_AQUI

# JWT Secret (genera uno random)
JWT_SECRET=genera_un_string_aleatorio_aqui_de_al_menos_32_caracteres

# Firebase (IMPORTANTE - ver paso 5)
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n"
```

### 5. Configurar Firebase

#### 5.1 Crear proyecto Firebase

1. Ve a https://console.firebase.google.com/
2. Click en "Agregar proyecto"
3. Nombre: `el-patron-dev` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Click "Crear proyecto"

#### 5.2 Habilitar Authentication

1. En tu proyecto, ve a "Authentication"
2. Click "Comenzar"
3. Habilita "Email/Password"
4. Guarda cambios

#### 5.3 Obtener credenciales Frontend

1. En Project Settings (⚙️) → General
2. En "Tus apps" → Web app (</>)
3. Copia el `firebaseConfig`
4. Actualiza `src/firebase.ts` con estos valores

#### 5.4 Obtener credenciales Backend (Service Account)

1. En Project Settings (⚙️) → Service Accounts
2. Click "Generate new private key"
3. Se descarga un archivo JSON
4. Extrae estos valores del JSON:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (incluye los \n)

**IMPORTANTE**: El `private_key` debe mantener los saltos de línea como `\n`:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----\n"
```

#### 5.5 Crear usuarios de prueba en Firebase

```bash
# Usa la consola de Firebase o estos scripts:

# Opción 1: Consola Firebase
# Authentication → Users → Add user
# Email: admin@elpatron.com
# Password: admin123

# Email: operator@elpatron.com
# Password: operator123

# Opción 2: Mediante código (después de configurar Firebase)
```

### 6. Poblar Base de Datos

```bash
cd backend
npm run db:seed
```

Esto creará:

- 4 usuarios
- 1 workspace
- 4 operaciones de ejemplo
- 5 leads
- 5 tareas
- 4 máquinas virtuales
- 6 eventos de seguridad
- 3 workflows

### 7. Verificar Configuración

```bash
# Test conexión a DB
cd backend
node -e "import('./src/database/connection.js').then(() => console.log('✅ DB OK'))"

# Test Firebase
node -e "import('./src/config/firebase.js').then(() => console.log('✅ Firebase OK'))"
```

### 8. Iniciar Sistema

Opción A - Script automático:

```bash
chmod +x start.sh
./start.sh
```

Opción B - Manual:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

### 9. Acceder al Sistema

1. Abre navegador en: http://localhost:5173
2. Login con:
   - **Admin**: `admin@elpatron.com` / `admin123`
   - **Operador**: `operator@elpatron.com` / `operator123`

## 🎉 ¡Listo!

Si todo funcionó, deberías ver:

✅ Dashboard con métricas reales
✅ Operaciones cargadas desde MySQL
✅ Componentes de gobierno funcionando
✅ Sistema de decisiones automáticas activo

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar que MySQL está corriendo
sudo systemctl status mysql

# Verificar credenciales
mysql -u root -p

# Si no puedes conectar, resetea password:
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nuevo_password';
FLUSH PRIVILEGES;
EXIT;
```

### Error: "Firebase authentication failed"

```bash
# Verificar formato de FIREBASE_PRIVATE_KEY
# Debe incluir \n como string literal, no saltos de línea reales

# Correcto:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# Incorrecto:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIE...
-----END PRIVATE KEY-----"
```

### Error: "Port 3000 already in use"

```bash
# Encontrar proceso usando el puerto
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O cambiar puerto en backend/.env
PORT=3001
```

### Error: Frontend no carga datos

```bash
# Verificar que backend esté corriendo
curl http://localhost:3000/health

# Verificar CORS en backend/.env
FRONTEND_URL=http://localhost:5173

# Verificar token Firebase en frontend
# Abrir DevTools → Application → Local Storage
# Debe haber 'auth_token' con valor
```

## 📚 Próximos Pasos

- Lee [DEPLOYMENT.md](DEPLOYMENT.md) para arquitectura completa
- Explora [backend/README.md](backend/README.md) para API docs
- Revisa componentes enterprise en `src/app/components/enterprise/`

## 🆘 Ayuda

Si encuentras problemas:

1. Revisa logs: `tail -f backend.log` y `tail -f frontend.log`
2. Verifica `.env` tiene todos los campos
3. Asegura que puertos 3000 y 5173 estén libres
4. Revisa que Firebase esté configurado correctamente

---

**¡Bienvenido a El Patrón!** 🎯
