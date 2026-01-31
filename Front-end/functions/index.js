const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion";

// Datos simulados
const users = [
  {
    id: 1,
    email: "admin@elpatron.com",
    password: hashPassword("admin123"),
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: 2,
    email: "operator@elpatron.com",
    password: hashPassword("operator123"),
    name: "Operator User",
    role: "OPERATOR",
  },
];

const operations = [
  {
    id: 1,
    title: "Operación 1",
    status: "IN_PROGRESS",
    assigneeUserId: 1,
    createdAt: "2026-01-01",
  },
  { id: 2, title: "Operación 2", status: "DONE", assigneeUserId: 2, createdAt: "2026-01-01" },
  { id: 3, title: "Operación 3", status: "NEW", assigneeUserId: 1, createdAt: "2026-01-02" },
];

const workspaces = [
  { id: 1, name: "Workspace Principal", state: "ACTIVE", userId: 1 },
  { id: 2, name: "Workspace Secundario", state: "ACTIVE", userId: 2 },
];

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function createJWT(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
  const payloadStr = Buffer.from(
    JSON.stringify({
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 604800,
    })
  ).toString("base64");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${header}.${payloadStr}`)
    .digest("base64");
  return `${header}.${payloadStr}.${signature}`;
}

async function getAuthUser(req) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return {
      id: decoded.uid,
      email: decoded.email || "",
      role: decoded.email === "admin@elpatron.com" ? "ADMIN" : "OPERATOR",
    };
  } catch (err) {
    return null;
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api", (req, res) => {
  res.json({
    name: "ElPatrón Backend API",
    version: "1.0.0",
    description: "Backend para ElPatrón CRM",
    status: "✅ Servidor operativo",
    endpoints: {
      auth: { login: "POST /api/auth/login", register: "POST /api/auth/register" },
      users: { list: "GET /api/users", me: "GET /api/me", create: "POST /api/users" },
      operations: {
        list: "GET /api/operations",
        create: "POST /api/operations",
        update: "PATCH /api/operations/:id",
      },
      workspaces: { list: "GET /api/workspaces", me: "GET /api/workspaces/me" },
    },
  });
});

// Auth (compatibilidad)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    (u) => u.email === email && u.password === hashPassword(password)
  );

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = createJWT({ id: user.id, email: user.email, role: user.role });
  res.json({
    access_token: token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body || {};
  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: "Email already exists" });
    return;
  }

  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    email,
    password: hashPassword(password),
    name,
    role: "OPERATOR",
  };
  users.push(newUser);

  const token = createJWT({ id: newUser.id, email: newUser.email, role: newUser.role });
  res.status(201).json({
    access_token: token,
    user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
  });
});

// Users
app.get("/api/me", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = users.find((u) => u.email === authUser.email) || {
    id: authUser.id,
    email: authUser.email,
    name: authUser.email.split("@")[0],
    role: authUser.role,
  };

  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

app.get("/api/users", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser || authUser.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.json(users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role })));
});

app.post("/api/users", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser || authUser.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const { email, password, name, role } = req.body || {};
  if (users.find((u) => u.email === email)) {
    res.status(409).json({ message: "Email already exists" });
    return;
  }

  const newUser = {
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    email,
    password: hashPassword(password),
    name,
    role: role || "OPERATOR",
  };
  users.push(newUser);

  res.status(201).json({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role });
});

// Operations
app.get("/api/operations", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const result =
    authUser.role === "ADMIN"
      ? operations
      : operations.filter((op) => op.assigneeUserId === 2 || op.assigneeUserId === 1);

  res.json(result);
});

app.post("/api/operations", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const { title } = req.body || {};
  const newOperation = {
    id: Math.max(...operations.map((o) => o.id), 0) + 1,
    title,
    status: "NEW",
    assigneeUserId: 1,
    createdAt: new Date().toISOString(),
  };
  operations.push(newOperation);
  res.status(201).json(newOperation);
});

app.patch("/api/operations/:id", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const operationId = Number(req.params.id);
  const operation = operations.find((o) => o.id === operationId);
  if (!operation) {
    res.status(404).json({ message: "Operation not found" });
    return;
  }

  if (req.body?.status) operation.status = req.body.status;
  if (req.body?.title) operation.title = req.body.title;

  res.json(operation);
});

// Workspaces
app.get("/api/workspaces", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser || authUser.role !== "ADMIN") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.json(workspaces);
});

app.get("/api/workspaces/me", async (req, res) => {
  const authUser = await getAuthUser(req);
  if (!authUser) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const workspace = workspaces.find((w) => w.userId === 1) || workspaces[0];
  res.json(workspace);
});

exports.api = functions.https.onRequest(app);
