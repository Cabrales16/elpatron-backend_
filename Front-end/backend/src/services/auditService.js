import { query } from "../database/connection.js";

// ============================================================================
// Audit Service - Sistema de trazabilidad enterprise
// ============================================================================
export class AuditService {
  /**
   * Registrar evento de auditoría
   */
  static async log({
    workspaceId,
    entityType,
    entityId,
    action,
    decisionType = "USER",
    decisionReason = null,
    policyApplied = null,
    riskEvaluated = false,
    riskScore = null,
    oldValue = null,
    newValue = null,
    metadata = null,
    performedBy = null,
    ipAddress = null,
    userAgent = null,
  }) {
    try {
      await query(
        `INSERT INTO audit_events (
          workspace_id, entity_type, entity_id, action,
          decision_type, decision_reason, policy_applied,
          risk_evaluated, risk_score,
          old_value, new_value, metadata,
          performed_by, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          workspaceId,
          entityType,
          entityId,
          action,
          decisionType,
          decisionReason,
          policyApplied,
          riskEvaluated,
          riskScore,
          oldValue ? JSON.stringify(oldValue) : null,
          newValue ? JSON.stringify(newValue) : null,
          metadata ? JSON.stringify(metadata) : null,
          performedBy,
          ipAddress,
          userAgent,
        ],
      );
    } catch (error) {
      console.error("Audit log error:", error);
      // No lanzar error para no interrumpir operación principal
    }
  }

  /**
   * Obtener historial de auditoría
   */
  static async getHistory(filters = {}) {
    let sql = `
      SELECT 
        ae.*,
        u.name as performed_by_name,
        u.email as performed_by_email
      FROM audit_events ae
      LEFT JOIN users u ON ae.performed_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.workspaceId) {
      sql += " AND ae.workspace_id = ?";
      params.push(filters.workspaceId);
    }

    if (filters.entityType) {
      sql += " AND ae.entity_type = ?";
      params.push(filters.entityType);
    }

    if (filters.entityId) {
      sql += " AND ae.entity_id = ?";
      params.push(filters.entityId);
    }

    if (filters.decisionType) {
      sql += " AND ae.decision_type = ?";
      params.push(filters.decisionType);
    }

    sql += " ORDER BY ae.created_at DESC LIMIT 100";

    const events = await query(sql, params);

    // Parsear JSON fields
    return events.map((event) => ({
      ...event,
      old_value: event.old_value ? JSON.parse(event.old_value) : null,
      new_value: event.new_value ? JSON.parse(event.new_value) : null,
      metadata: event.metadata ? JSON.parse(event.metadata) : null,
    }));
  }
}
