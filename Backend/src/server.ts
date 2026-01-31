import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Docs redirect
app.get('/', (req, res) => {
  res.json({
    name: 'ElPatrón Backend',
    version: '1.0.0',
    description: 'Backend para ElPatrón CRM',
    endpoints: {
      health: 'GET /health',
      auth_login: 'POST /auth/login',
      auth_register: 'POST /auth/register',
      users: 'GET /users',
      operations: 'GET /operations',
      workspaces: 'GET /workspaces',
    },
    docs: 'Documentación disponible en http://localhost:' + PORT + '/api/docs',
  });
});

// Auth endpoints (simulado)
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@elpatron.com' && password === 'admin123') {
    res.json({
      access_token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        email: 'admin@elpatron.com',
        name: 'Admin User',
        role: 'ADMIN',
      },
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  res.json({
    id: Math.random(),
    email,
    name,
    role: 'OPERATOR',
    createdAt: new Date(),
  });
});

// Users endpoints (simulado)
app.get('/users', (req, res) => {
  res.json([
    {
      id: 1,
      email: 'admin@elpatron.com',
      name: 'Admin',
      role: 'ADMIN',
      createdAt: '2026-01-01',
    },
    {
      id: 2,
      email: 'operator@elpatron.com',
      name: 'Operator',
      role: 'OPERATOR',
      createdAt: '2026-01-01',
    },
  ]);
});

app.get('/me', (req, res) => {
  res.json({
    id: 1,
    email: 'admin@elpatron.com',
    name: 'Admin User',
    role: 'ADMIN',
  });
});

// Operations endpoints (simulado)
app.get('/operations', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Operation 1',
      status: 'IN_PROGRESS',
      createdAt: '2026-01-01',
    },
  ]);
});

// Workspaces endpoints (simulado)
app.get('/workspaces', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Workspace 1',
      state: 'ACTIVE',
    },
  ]);
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║    🚀 ElPatrón Backend Running      ║
║                                      ║
║  URL: http://localhost:${PORT}         ║
║  API: http://localhost:${PORT}/        ║
╚══════════════════════════════════════╝
  `);
});
