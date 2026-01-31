import { auth as firebaseAuth } from "../config/firebase.js";
import { query } from "../database/connection.js";

// ============================================================================
// Authentication Middleware - Firebase Token Verification
// ============================================================================
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "UNAUTHORIZED",
        message: "Acceso denegado - Autenticación requerida",
        governed: true,
      });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token de Firebase
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    // Buscar o crear usuario en DB
    const user = await getOrCreateUser(decodedToken);

    if (user.status !== "ACTIVE") {
      return res.status(403).json({
        status: "RESTRICTED",
        message: "Cuenta suspendida por política de seguridad",
        governed: true,
      });
    }

    // Attach user to request
    req.user = user;
    req.firebaseUid = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "UNAUTHORIZED",
      message: "Token inválido o expirado",
      governed: true,
    });
  }
};

// ============================================================================
// Role-based Authorization
// ============================================================================
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "UNAUTHORIZED",
        message: "Autenticación requerida",
        governed: true,
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: "RESTRICTED",
        message: "Acción restringida por nivel de privilegios",
        governed: true,
        requiredRole: allowedRoles,
        currentRole: req.user.role,
      });
    }

    next();
  };
};

// ============================================================================
// Get or Create User Helper
// ============================================================================
async function getOrCreateUser(decodedToken) {
  const { uid, email, name } = decodedToken;

  // Buscar usuario existente
  let [users] = await query(
    "SELECT * FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1",
    [uid, email],
  );

  if (users && users.length > 0) {
    // Actualizar last_login
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [
      users[0].id,
    ]);
    return users[0];
  }

  // Crear nuevo usuario
  const role = email === "admin@elpatron.com" ? "ADMIN" : "OPERATOR";
  const userName = name || email.split("@")[0];

  const result = await query(
    `INSERT INTO users (firebase_uid, email, name, role, status, last_login) 
     VALUES (?, ?, ?, ?, 'ACTIVE', NOW())`,
    [uid, email, userName, role],
  );

  // Obtener usuario creado
  const [newUser] = await query("SELECT * FROM users WHERE id = ?", [
    result.insertId,
  ]);

  return newUser[0];
}
