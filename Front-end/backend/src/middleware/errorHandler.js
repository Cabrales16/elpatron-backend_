export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;

  // Formato enterprise: estados curados, no errores crudos
  const response = {
    status: getStatusFromError(err),
    message: sanitizeErrorMessage(err.message),
    governed: true,
    timestamp: new Date().toISOString(),
  };

  // En desarrollo, agregar detalles técnicos
  if (process.env.NODE_ENV === "development") {
    response.technical = {
      originalError: err.message,
      stack: err.stack,
    };
  }

  res.status(statusCode).json(response);
};

// ============================================================================
// Helpers
// ============================================================================

function getStatusFromError(err) {
  if (err.statusCode === 401) return "UNAUTHORIZED";
  if (err.statusCode === 403) return "RESTRICTED";
  if (err.statusCode === 404) return "NOT_FOUND";
  if (err.statusCode === 429) return "RATE_LIMITED";
  if (err.statusCode >= 400 && err.statusCode < 500) return "INVALID_REQUEST";
  return "SYSTEM_ERROR";
}

function sanitizeErrorMessage(message) {
  // Convertir errores técnicos en mensajes de negocio
  const messageMap = {
    ER_DUP_ENTRY: "Este registro ya existe en el sistema",
    ER_NO_REFERENCED_ROW: "Referencia inválida detectada",
    ECONNREFUSED: "El sistema no está disponible temporalmente",
    Unauthorized: "Acceso denegado por política de seguridad",
    Forbidden: "Acción restringida por gobierno operativo",
    "Not found": "Recurso no encontrado en el sistema",
  };

  for (const [key, value] of Object.entries(messageMap)) {
    if (message.includes(key)) return value;
  }

  return message || "Error procesando la solicitud";
}
