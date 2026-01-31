import { query } from "../database/connection.js";

// ============================================================================
// SECURITY CONTROLLER
// ============================================================================

export const getSecurityEvents = async (req, res) => {
  try {
    const { workspaceId, tipo, categoria, requiresReview } = req.query;

    let sql = `
      SELECT 
        se.*,
        w.name as workspace_name,
        u.name as user_name
      FROM security_events se
      JOIN workspaces w ON se.workspace_id = w.id
      LEFT JOIN users u ON se.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (workspaceId) {
      sql += " AND se.workspace_id = ?";
      params.push(workspaceId);
    }

    if (tipo) {
      sql += " AND se.tipo = ?";
      params.push(tipo);
    }

    if (categoria) {
      sql += " AND se.categoria = ?";
      params.push(categoria);
    }

    if (requiresReview) {
      sql += " AND se.requires_review = ?";
      params.push(requiresReview === "true");
    }

    sql += " ORDER BY se.timestamp DESC LIMIT 100";

    const events = await query(sql, params);

    res.json({
      status: "SUCCESS",
      data: events,
      count: events.length,
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching security events:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo eventos de seguridad",
      governed: true,
    });
  }
};

export const getSecurityMetrics = async (req, res) => {
  try {
    const { workspaceId } = req.query;

    const whereClause = workspaceId ? "WHERE workspace_id = ?" : "WHERE 1=1";
    const params = workspaceId ? [workspaceId] : [];

    const [metrics] = await query(
      `SELECT 
        COUNT(*) as total_events,
        SUM(CASE WHEN tipo = 'CRITICO' THEN 1 ELSE 0 END) as critical_events,
        SUM(CASE WHEN tipo = 'ADVERTENCIA' THEN 1 ELSE 0 END) as warning_events,
        SUM(CASE WHEN auto_blocked = 1 THEN 1 ELSE 0 END) as auto_blocked,
        SUM(CASE WHEN requires_review = 1 THEN 1 ELSE 0 END) as pending_review,
        AVG(severity_score) as avg_severity
      FROM security_events
      ${whereClause}
      AND timestamp >= DATE_SUB(NOW(), INTERVAL 7 DAY)`,
      params,
    );

    const data = metrics[0];

    res.json({
      status: "SUCCESS",
      data: {
        totalEvents: data.total_events || 0,
        criticalEvents: data.critical_events || 0,
        warningEvents: data.warning_events || 0,
        autoBlocked: data.auto_blocked || 0,
        pendingReview: data.pending_review || 0,
        avgSeverity: parseFloat(data.avg_severity || 0).toFixed(2),
        governanceLevel: data.auto_blocked > 0 ? "ACTIVE" : "MONITORING",
      },
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching security metrics:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo métricas de seguridad",
      governed: true,
    });
  }
};
