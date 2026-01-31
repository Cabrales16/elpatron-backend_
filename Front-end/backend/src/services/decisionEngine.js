import { query } from "../database/connection.js";
import { AuditService } from "./auditService.js";

// ============================================================================
// Decision Engine - Cerebro del sistema
// ============================================================================
export class DecisionEngine {
  /**
   * Evaluar riesgo de operación
   */
  static async evaluateOperationRisk(operation, context = {}) {
    let riskScore = 0;
    const reasons = [];

    // Factor 1: Prioridad
    const priorityScores = {
      LOW: 10,
      MEDIUM: 30,
      HIGH: 60,
      CRITICAL: 90,
    };
    riskScore += priorityScores[operation.priority] || 0;

    // Factor 2: Tipo de operación
    const typeScores = {
      SECURITY: 40,
      INFRASTRUCTURE: 30,
      AUTOMATION: 20,
      LEAD: 10,
      CUSTOM: 15,
    };
    riskScore += typeScores[operation.type] || 0;

    // Factor 3: Workspace governance mode
    if (context.workspace) {
      if (context.workspace.governance_mode === "RESTRICTED") {
        riskScore += 30;
        reasons.push("Workspace en modo restringido");
      }
      if (context.workspace.risk_level === "HIGH") {
        riskScore += 25;
        reasons.push("Workspace con riesgo alto");
      }
      if (context.workspace.risk_level === "CRITICAL") {
        riskScore += 40;
        reasons.push("Workspace con riesgo crítico");
      }
    }

    // Factor 4: Historial del usuario
    if (context.user) {
      const userHistory = await this.getUserRiskHistory(context.user.id);
      if (userHistory.recentBlocks > 3) {
        riskScore += 20;
        reasons.push("Historial de acciones bloqueadas");
      }
    }

    // Normalizar score a 0-100
    riskScore = Math.min(Math.round(riskScore), 100);

    return {
      riskScore,
      riskLevel: this.getRiskLevel(riskScore),
      reasons,
      shouldBlock:
        riskScore >= parseInt(process.env.RISK_THRESHOLD_CRITICAL || 90),
      requiresValidation:
        riskScore >= parseInt(process.env.RISK_THRESHOLD_HIGH || 75),
    };
  }

  /**
   * Decidir si una acción debe ser bloqueada
   */
  static async shouldBlockAction(action, entity, context = {}) {
    const evaluation = await this.evaluateOperationRisk(entity, context);

    // Auto-block si está habilitado y el riesgo es muy alto
    if (process.env.AUTO_BLOCK_ENABLED === "true" && evaluation.shouldBlock) {
      return {
        blocked: true,
        reason: "Acción bloqueada automáticamente por política de riesgo",
        riskScore: evaluation.riskScore,
        policy: "RISK_AUTO_BLOCK",
        details: evaluation.reasons,
      };
    }

    // Verificar políticas específicas
    const policyCheck = await this.checkPolicies(action, entity, context);
    if (policyCheck.blocked) {
      return policyCheck;
    }

    return {
      blocked: false,
      requiresValidation: evaluation.requiresValidation,
      riskScore: evaluation.riskScore,
    };
  }

  /**
   * Verificar políticas de gobierno
   */
  static async checkPolicies(action, entity, context) {
    // Política 1: OPERATORS no pueden crear operaciones CRITICAL
    if (
      action === "CREATE_OPERATION" &&
      entity.priority === "CRITICAL" &&
      context.user?.role === "OPERATOR"
    ) {
      return {
        blocked: true,
        reason: "Operadores no pueden crear operaciones críticas",
        policy: "ROLE_PRIORITY_RESTRICTION",
        requiredRole: "ADMIN",
      };
    }

    // Política 2: Workspace suspendido
    if (context.workspace?.status === "SUSPENDED") {
      return {
        blocked: true,
        reason: "Workspace suspendido por incumplimiento de políticas",
        policy: "WORKSPACE_SUSPENDED",
      };
    }

    // Política 3: Usuario bloqueado
    if (context.user?.status === "BLOCKED") {
      return {
        blocked: true,
        reason: "Usuario bloqueado por política de seguridad",
        policy: "USER_BLOCKED",
      };
    }

    return { blocked: false };
  }

  /**
   * Calcular nivel de confianza
   */
  static calculateConfidence(operation, context = {}) {
    let confidence = 100;

    // Reducir confianza según riesgo
    if (operation.risk_score) {
      confidence -= operation.risk_score * 0.5;
    }

    // Aumentar confianza si fue validada
    if (operation.validated_by) {
      confidence = Math.min(confidence + 20, 100);
    }

    // Reducir si hay flags
    if (operation.blocked_reason) {
      confidence = 0;
    }

    return Math.max(Math.round(confidence), 0);
  }

  /**
   * Obtener historial de riesgo del usuario
   */
  static async getUserRiskHistory(userId) {
    const [result] = await query(
      `SELECT 
        COUNT(*) as total_actions,
        SUM(CASE WHEN decision_type = 'SYSTEM' THEN 1 ELSE 0 END) as system_decisions,
        SUM(CASE WHEN decision_reason LIKE '%bloqueada%' THEN 1 ELSE 0 END) as blocks
      FROM audit_events
      WHERE performed_by = ?
      AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
      [userId],
    );

    return {
      recentActions: result[0]?.total_actions || 0,
      systemDecisions: result[0]?.system_decisions || 0,
      recentBlocks: result[0]?.blocks || 0,
    };
  }

  /**
   * Helper: Convertir score a nivel
   */
  static getRiskLevel(score) {
    if (score >= 90) return "CRITICAL";
    if (score >= 75) return "HIGH";
    if (score >= 50) return "MEDIUM";
    return "LOW";
  }

  /**
   * Traducir estado técnico a lenguaje de negocio
   */
  static translateStatus(status) {
    const translations = {
      NEW: "NUEVA",
      VALIDATED: "VALIDADA",
      IN_PROGRESS: "EN EJECUCIÓN",
      RESTRICTED: "CONTROLADA",
      BLOCKED: "BLOQUEADA",
      COMPLETED: "COMPLETADA",
      CANCELLED: "CANCELADA",
    };
    return translations[status] || status;
  }

  /**
   * Obtener mensaje de gobierno para el usuario
   */
  static getGovernanceMessage(decision) {
    if (decision.blocked) {
      return {
        type: "BLOCKED",
        title: "Acción Bloqueada",
        message: decision.reason,
        governed: true,
        policy: decision.policy,
      };
    }

    if (decision.requiresValidation) {
      return {
        type: "REQUIRES_VALIDATION",
        title: "Validación Requerida",
        message: "Esta acción requiere aprobación de un administrador",
        governed: true,
        riskScore: decision.riskScore,
      };
    }

    return {
      type: "APPROVED",
      title: "Acción Validada",
      message: "La acción ha sido validada automáticamente",
      governed: true,
    };
  }
}
