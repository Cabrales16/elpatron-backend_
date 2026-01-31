import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || "/api";

// ============================================================================
// Middleware Stack
// ============================================================================

// Security
app.use(
  helmet({
    contentSecurityPolicy: false, // Ajustar según necesidades del frontend
  }),
);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ============================================================================
// Health Check
// ============================================================================
app.get("/health", (req, res) => {
  res.json({
    status: "OPERATIONAL",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    governance: "ACTIVE",
  });
});

// ============================================================================
// API Routes
// ============================================================================
app.use(API_PREFIX, routes);

// ============================================================================
// Error Handling
// ============================================================================
app.use(notFound);
app.use(errorHandler);

// ============================================================================
// Start Server
// ============================================================================
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚀 EL PATRÓN - Sistema de Control Operativo Enterprise");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📍 Environment:  ${process.env.NODE_ENV}`);
  console.log(`🔌 Server:       http://localhost:${PORT}`);
  console.log(`🛡️  API:          http://localhost:${PORT}${API_PREFIX}`);
  console.log(`✅ Status:       OPERATIONAL`);
  console.log(`🎯 Governance:   ACTIVE`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

export default app;
