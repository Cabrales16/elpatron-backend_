const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambiar-en-produccion';
const REQUIRE_AUTH = process.env.REQUIRE_AUTH === 'true';
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || 'http://localhost:5173,https://elpatron-946d7.web.app')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const DEFAULT_USER = { id: 1, email: 'admin@elpatron.com', role: 'ADMIN' };

// Base de datos simulada
const users = [
  {
    id: 1,
    email: 'admin@elpatron.com',
    password: hashPassword('admin123'),
    name: 'Admin User',
    role: 'ADMIN',
  },
  {
    id: 2,
    email: 'operator@elpatron.com',
    password: hashPassword('operator123'),
    name: 'Operator User',
    role: 'OPERATOR',
  },
];

const operations = [
  {
    id: 1,
    title: 'Operación 1',
    status: 'IN_PROGRESS',
    assigneeUserId: 1,
    createdAt: '2026-01-01',
  },
  { id: 2, title: 'Operación 2', status: 'DONE', assigneeUserId: 2, createdAt: '2026-01-01' },
  { id: 3, title: 'Operación 3', status: 'NEW', assigneeUserId: 1, createdAt: '2026-01-02' },
];

const workspaces = [
  { id: 1, name: 'Workspace Principal', state: 'ACTIVE', userId: 1 },
  { id: 2, name: 'Workspace Secundario', state: 'ACTIVE', userId: 2 },
];

// JWT Helper Functions
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function createJWT(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payloadStr = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800,
    })
  ).toString('base64');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payloadStr}`)
    .digest('base64');
  return `${header}.${payloadStr}.${signature}`;
}

function verifyJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const verify = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64');

    if (verify !== signature) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;

    return decoded;
  } catch (e) {
    return null;
  }
}

function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return REQUIRE_AUTH ? null : DEFAULT_USER;

  const token = authHeader.replace('Bearer ', '');
  const verified = verifyJWT(token);
  if (!verified && !REQUIRE_AUTH) return DEFAULT_USER;
  return verified;
}

// Parse body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  const origin = req.headers.origin;
  if (origin && FRONTEND_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  try {
    // Health check
    if (pathname === '/health' && method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }

    // Root
    if (pathname === '/' && method === 'GET') {
      res.writeHead(200);
      res.end(
        JSON.stringify({
          name: 'ElPatrón Backend API',
          version: '1.0.0',
          description: 'Backend para ElPatrón CRM',
          status: '✅ Servidor operativo',
          endpoints: {
            auth: { login: 'POST /api/auth/login', register: 'POST /api/auth/register' },
            users: { list: 'GET /api/users', me: 'GET /api/me', create: 'POST /api/users' },
            operations: {
              list: 'GET /api/operations',
              create: 'POST /api/operations',
              update: 'PATCH /api/operations/:id',
            },
            workspaces: { list: 'GET /api/workspaces', me: 'GET /api/workspaces/me' },
          },
          credentials: { email: 'admin@elpatron.com', password: 'admin123' },
        })
      );
      return;
    }

    // ==================== AUTH ====================

    // Login
    if (pathname === '/api/auth/login' && method === 'POST') {
      const data = await parseBody(req);
      const user = users.find(
        (u) => u.email === data.email && u.password === hashPassword(data.password)
      );

      if (!user) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
        return;
      }

      const token = createJWT({ id: user.id, email: user.email, role: user.role });
      res.writeHead(200);
      res.end(
        JSON.stringify({
          access_token: token,
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
        })
      );
      return;
    }

    // Register
    if (pathname === '/api/auth/register' && method === 'POST') {
      const data = await parseBody(req);

      if (users.find((u) => u.email === data.email)) {
        res.writeHead(409);
        res.end(JSON.stringify({ message: 'Email already exists' }));
        return;
      }

      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        email: data.email,
        password: hashPassword(data.password),
        name: data.name,
        role: 'OPERATOR',
      };
      users.push(newUser);

      const token = createJWT({ id: newUser.id, email: newUser.email, role: newUser.role });
      res.writeHead(201);
      res.end(
        JSON.stringify({
          access_token: token,
          user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
        })
      );
      return;
    }

    // ==================== USERS ====================

    // Get me
    if (pathname === '/api/me' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      const user = users.find((u) => u.id === authUser.id);
      res.writeHead(200);
      res.end(JSON.stringify({ id: user.id, email: user.email, name: user.name, role: user.role }));
      return;
    }

    // Get users
    if (pathname === '/api/users' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'ADMIN') {
        res.writeHead(403);
        res.end(JSON.stringify({ message: 'Forbidden' }));
        return;
      }

      res.writeHead(200);
      res.end(
        JSON.stringify(users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role })))
      );
      return;
    }

    // Create user
    if (pathname === '/api/users' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'ADMIN') {
        res.writeHead(403);
        res.end(JSON.stringify({ message: 'Forbidden' }));
        return;
      }

      const data = await parseBody(req);
      const newUser = {
        id: Math.max(...users.map((u) => u.id), 0) + 1,
        email: data.email,
        password: hashPassword(data.password),
        name: data.name,
        role: data.role || 'OPERATOR',
      };
      users.push(newUser);

      res.writeHead(201);
      res.end(
        JSON.stringify({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        })
      );
      return;
    }

    // ==================== OPERATIONS ====================

    // Get operations
    if (pathname === '/api/operations' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      const userOps =
        authUser.role === 'ADMIN'
          ? operations
          : operations.filter((o) => o.assigneeUserId === authUser.id);
      res.writeHead(200);
      res.end(JSON.stringify(userOps));
      return;
    }

    // Create operation
    if (pathname === '/api/operations' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      const data = await parseBody(req);
      const newOp = {
        id: Math.max(...operations.map((o) => o.id), 0) + 1,
        title: data.title,
        status: 'NEW',
        assigneeUserId: authUser.id,
        createdAt: new Date().toISOString(),
      };
      operations.push(newOp);

      res.writeHead(201);
      res.end(JSON.stringify(newOp));
      return;
    }

    // Update operation status
    if (pathname.match(/^\/api\/operations\/\d+\/status$/) && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      const opId = parseInt(pathname.split('/')[3]);
      const op = operations.find((o) => o.id === opId);

      if (!op) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Operation not found' }));
        return;
      }

      const data = await parseBody(req);
      op.status = data.status;

      res.writeHead(200);
      res.end(JSON.stringify(op));
      return;
    }

    // ==================== WORKSPACES ====================

    // Get workspaces
    if (pathname === '/api/workspaces' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      res.writeHead(200);
      res.end(JSON.stringify(workspaces));
      return;
    }

    // Get my workspace
    if (pathname === '/api/workspaces/me' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser) {
        res.writeHead(401);
        res.end(JSON.stringify({ message: 'Unauthorized' }));
        return;
      }

      const workspace = workspaces.find((w) => w.userId === authUser.id);
      res.writeHead(200);
      res.end(JSON.stringify(workspace || null));
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ message: 'Not Found' }));
  } catch (error) {
    console.error('Error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    🚀 ElPatrón Backend Operativo      ║
║                                        ║
║  ✅ Servidor corriendo en puerto ${PORT}  ║
║                                        ║
║  🌐 http://localhost:${PORT}/            ║
║  💚 GET http://localhost:${PORT}/health   ║
║                                        ║
║  🔐 Credenciales:                      ║
║     Email: admin@elpatron.com          ║
║     Password: admin123                 ║
║                                        ║
║  👤 Email: operator@elpatron.com       ║
║     Password: operator123              ║
║                                        ║
║  📚 Documentación en /:               ║
║     GET http://localhost:${PORT}/       ║
║                                        ║
╚════════════════════════════════════════╝
  `);
});
