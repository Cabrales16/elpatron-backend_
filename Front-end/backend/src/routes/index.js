import express from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import * as operationsController from "../controllers/operationsController.js";
import * as leadsController from "../controllers/leadsController.js";
import * as tasksController from "../controllers/tasksController.js";
import * as vmsController from "../controllers/vmsController.js";
import * as securityController from "../controllers/securityController.js";

const router = express.Router();

// ============================================================================
// Public Routes
// ============================================================================
router.get("/health", (req, res) => {
  res.json({ status: "OPERATIONAL", governed: true });
});

// ============================================================================
// Operations Routes
// ============================================================================
router.get("/operations", authenticate, operationsController.getOperations);
router.get(
  "/operations/dashboard/metrics",
  authenticate,
  operationsController.getDashboardMetrics,
);
router.get(
  "/operations/:id",
  authenticate,
  operationsController.getOperationById,
);
router.post("/operations", authenticate, operationsController.createOperation);
router.patch(
  "/operations/:id/status",
  authenticate,
  operationsController.updateOperationStatus,
);

// ============================================================================
// Leads Routes
// ============================================================================
router.get("/leads", authenticate, leadsController.getLeads);
router.post("/leads", authenticate, leadsController.createLead);

// ============================================================================
// Tasks Routes
// ============================================================================
router.get("/tasks", authenticate, tasksController.getTasks);
router.post("/tasks", authenticate, tasksController.createTask);

// ============================================================================
// Virtual Machines Routes
// ============================================================================
router.get("/vms", authenticate, vmsController.getVirtualMachines);
router.post(
  "/vms",
  authenticate,
  authorize("ADMIN"),
  vmsController.createVirtualMachine,
);

// ============================================================================
// Security Routes
// ============================================================================
router.get(
  "/security/events",
  authenticate,
  securityController.getSecurityEvents,
);
router.get(
  "/security/metrics",
  authenticate,
  securityController.getSecurityMetrics,
);

// ============================================================================
// User & Auth Routes
// ============================================================================
router.get("/me", authenticate, (req, res) => {
  res.json({
    status: "SUCCESS",
    data: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      status: req.user.status,
    },
    governed: true,
  });
});

export default router;
