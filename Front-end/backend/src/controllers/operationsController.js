import { query } from "../database/connection.js";
import { DecisionEngine } from "../services/decisionEngine.js";
import { AuditService } from "../services/auditService.js";

// ============================================================================
// OPERATIONS CONTROLLER
// ============================================================================

/**
 * GET /api/operations
 * Listar operaciones con contexto de gobierno
 */
export const getOperations = async (req, res) => {
  try {
    const { workspaceId, status, type, priority } = req.query;

    let sql = `
      SELECT 
        o.*,
        w.name as workspace_name,
        w.governance_mode,
        w.risk_level as workspace_risk_level,
        creator.name as created_by_name,
        assigned.name as assigned_to_name,
        validator.name as validated_by_name
      FROM operations o
      JOIN workspaces w ON o.workspace_id = w.id
      JOIN users creator ON o.created_by = creator.id
      LEFT JOIN users assigned ON o.assigned_to = assigned.id
      LEFT JOIN users validator ON o.validated_by = validator.id
      WHERE 1=1
    `;
    const params = [];

    if (workspaceId) {
      sql += " AND o.workspace_id = ?";
      params.push(workspaceId);
    }

    if (status) {
      sql += " AND o.status = ?";
      params.push(status);
    }

    if (type) {
      sql += " AND o.type = ?";
      params.push(type);
    }

    if (priority) {
      sql += " AND o.priority = ?";
      params.push(priority);
    }

    sql += " ORDER BY o.created_at DESC LIMIT 100";

    const operations = await query(sql, params);

    // Enriquecer con contexto de gobierno
    const enrichedOperations = operations.map((op) => ({
      ...op,
      statusLabel: DecisionEngine.translateStatus(op.status),
      riskLevel: DecisionEngine.getRiskLevel(op.risk_score),
      confidence: DecisionEngine.calculateConfidence(op),
      governed: true,
      governanceContext: {
        mode: op.governance_mode,
        workspaceRisk: op.workspace_risk_level,
      },
    }));

    res.json({
      status: "SUCCESS",
      data: enrichedOperations,
      count: enrichedOperations.length,
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching operations:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo operaciones",
      governed: true,
    });
  }
};

/**
 * GET /api/operations/:id
 * Obtener operación específica con historial
 */
export const getOperationById = async (req, res) => {
  try {
    const { id } = req.params;

    const [operations] = await query(
      `SELECT 
        o.*,
        w.name as workspace_name,
        w.governance_mode,
        creator.name as created_by_name,
        assigned.name as assigned_to_name
      FROM operations o
      JOIN workspaces w ON o.workspace_id = w.id
      JOIN users creator ON o.created_by = creator.id
      LEFT JOIN users assigned ON o.assigned_to = assigned.id
      WHERE o.id = ?`,
      [id],
    );

    if (!operations || operations.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Operación no encontrada",
        governed: true,
      });
    }

    const operation = operations[0];

    // Obtener historial
    const history = await query(
      `SELECT oh.*, u.name as performed_by_name
       FROM operation_history oh
       JOIN users u ON oh.performed_by = u.id
       WHERE oh.operation_id = ?
       ORDER BY oh.created_at DESC`,
      [id],
    );

    res.json({
      status: "SUCCESS",
      data: {
        ...operation,
        statusLabel: DecisionEngine.translateStatus(operation.status),
        riskLevel: DecisionEngine.getRiskLevel(operation.risk_score),
        confidence: DecisionEngine.calculateConfidence(operation),
        governed: true,
        history,
      },
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching operation:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo operación",
      governed: true,
    });
  }
};

/**
 * POST /api/operations
 * Crear operación con evaluación automática
 */
export const createOperation = async (req, res) => {
  try {
    const { title, description, type, priority, workspaceId } = req.body;
    const userId = req.user.id;

    // Validaciones básicas
    if (!title || !workspaceId) {
      return res.status(400).json({
        status: "INVALID_REQUEST",
        message: "Título y workspace son requeridos",
        governed: true,
      });
    }

    // Obtener workspace para contexto
    const [workspaces] = await query("SELECT * FROM workspaces WHERE id = ?", [
      workspaceId,
    ]);

    if (!workspaces || workspaces.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Workspace no encontrado",
        governed: true,
      });
    }

    const workspace = workspaces[0];

    // Preparar operación para evaluación
    const operationData = {
      title,
      description,
      type: type || "CUSTOM",
      priority: priority || "MEDIUM",
      workspace_id: workspaceId,
      created_by: userId,
    };

    // DECISIÓN AUTOMÁTICA: Evaluar riesgo
    const riskEvaluation = await DecisionEngine.evaluateOperationRisk(
      operationData,
      { workspace, user: req.user },
    );

    // DECISIÓN AUTOMÁTICA: Verificar si debe bloquearse
    const blockDecision = await DecisionEngine.shouldBlockAction(
      "CREATE_OPERATION",
      operationData,
      { workspace, user: req.user },
    );

    // Determinar estado inicial
    let status = "NEW";
    let blocked_reason = null;
    let blocked_by = null;

    if (blockDecision.blocked) {
      status = "BLOCKED";
      blocked_reason = blockDecision.reason;
      blocked_by = blockDecision.policy;
    } else if (blockDecision.requiresValidation) {
      status = "NEW"; // Requiere validación manual
    } else {
      status = "VALIDATED"; // Auto-aprobada
    }

    // Crear operación
    const result = await query(
      `INSERT INTO operations (
        workspace_id, title, description, type, priority, status,
        risk_score, confidence_level, blocked_reason, blocked_by, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        title,
        description || null,
        type || "CUSTOM",
        priority || "MEDIUM",
        status,
        riskEvaluation.riskScore,
        DecisionEngine.calculateConfidence({
          risk_score: riskEvaluation.riskScore,
        }),
        blocked_reason,
        blocked_by,
        userId,
      ],
    );

    const operationId = result.insertId;

    // AUDITORÍA
    await AuditService.log({
      workspaceId,
      entityType: "operation",
      entityId: operationId,
      action: "created",
      decisionType: blockDecision.blocked ? "SYSTEM" : "USER",
      decisionReason: blockDecision.blocked ? blockDecision.reason : null,
      policyApplied: blocked_by,
      riskEvaluated: true,
      riskScore: riskEvaluation.riskScore,
      newValue: operationData,
      performedBy: userId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // Obtener operación creada
    const [newOperation] = await query(
      "SELECT * FROM operations WHERE id = ?",
      [operationId],
    );

    const governanceMessage =
      DecisionEngine.getGovernanceMessage(blockDecision);

    res.status(201).json({
      status: "CREATED",
      data: {
        ...newOperation[0],
        statusLabel: DecisionEngine.translateStatus(status),
        riskLevel: riskEvaluation.riskLevel,
        governed: true,
      },
      governance: governanceMessage,
      governed: true,
    });
  } catch (error) {
    console.error("Error creating operation:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error creando operación",
      governed: true,
    });
  }
};

/**
 * PATCH /api/operations/:id/status
 * Cambiar estado con evaluación automática
 */
export const updateOperationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const userId = req.user.id;

    // Obtener operación actual
    const [operations] = await query(
      `SELECT o.*, w.* 
       FROM operations o
       JOIN workspaces w ON o.workspace_id = w.id
       WHERE o.id = ?`,
      [id],
    );

    if (!operations || operations.length === 0) {
      return res.status(404).json({
        status: "NOT_FOUND",
        message: "Operación no encontrada",
        governed: true,
      });
    }

    const operation = operations[0];
    const oldStatus = operation.status;

    // DECISIÓN AUTOMÁTICA: Evaluar cambio de estado
    const blockDecision = await DecisionEngine.shouldBlockAction(
      "UPDATE_OPERATION_STATUS",
      { ...operation, new_status: status },
      { workspace: operation, user: req.user },
    );

    if (blockDecision.blocked) {
      return res.status(403).json({
        status: "RESTRICTED",
        message: blockDecision.reason,
        policy: blockDecision.policy,
        governed: true,
      });
    }

    // Actualizar operación
    await query(
      `UPDATE operations 
       SET status = ?, updated_at = NOW()
       WHERE id = ?`,
      [status, id],
    );

    // Registrar en historial
    await query(
      `INSERT INTO operation_history (operation_id, action, old_status, new_status, reason, performed_by, system_decision)
       VALUES (?, 'status_changed', ?, ?, ?, ?, ?)`,
      [
        id,
        oldStatus,
        status,
        reason || null,
        userId,
        blockDecision.requiresValidation,
      ],
    );

    // AUDITORÍA
    await AuditService.log({
      workspaceId: operation.workspace_id,
      entityType: "operation",
      entityId: id,
      action: "status_changed",
      decisionType: "USER",
      oldValue: { status: oldStatus },
      newValue: { status },
      performedBy: userId,
      ipAddress: req.ip,
    });

    res.json({
      status: "SUCCESS",
      message: "Estado actualizado correctamente",
      data: {
        id,
        oldStatus,
        newStatus: status,
        statusLabel: DecisionEngine.translateStatus(status),
      },
      governed: true,
    });
  } catch (error) {
    console.error("Error updating operation status:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error actualizando estado",
      governed: true,
    });
  }
};

/**
 * GET /api/operations/dashboard/metrics
 * Métricas del dashboard con contexto de gobierno
 */
export const getDashboardMetrics = async (req, res) => {
  try {
    const { workspaceId } = req.query;

    let whereClause = "1=1";
    const params = [];

    if (workspaceId) {
      whereClause = "workspace_id = ?";
      params.push(workspaceId);
    }

    // Métricas básicas
    const [metrics] = await query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'NEW' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'BLOCKED' THEN 1 ELSE 0 END) as blocked,
        SUM(CASE WHEN status = 'RESTRICTED' THEN 1 ELSE 0 END) as restricted,
        AVG(risk_score) as avg_risk_score,
        AVG(confidence_level) as avg_confidence
      FROM operations
      WHERE ${whereClause}`,
      params,
    );

    const data = metrics[0];

    res.json({
      status: "SUCCESS",
      data: {
        total: data.total || 0,
        new: data.new || 0,
        inProgress: data.in_progress || 0,
        completed: data.completed || 0,
        blocked: data.blocked || 0,
        restricted: data.restricted || 0,
        avgRiskScore: parseFloat(data.avg_risk_score || 0).toFixed(2),
        avgConfidence: parseFloat(data.avg_confidence || 0).toFixed(2),
        governanceLevel:
          data.blocked + data.restricted > 0 ? "ACTIVE" : "PERMISSIVE",
      },
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo métricas",
      governed: true,
    });
  }
};
