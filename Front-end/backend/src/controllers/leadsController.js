import { query } from "../database/connection.js";
import { AuditService } from "../services/auditService.js";

// ============================================================================
// LEADS CONTROLLER
// ============================================================================

export const getLeads = async (req, res) => {
  try {
    const { workspaceId, estado, assigned_to } = req.query;

    let sql = `
      SELECT 
        l.*,
        w.name as workspace_name,
        assigned.name as assigned_to_name,
        creator.name as created_by_name
      FROM leads l
      JOIN workspaces w ON l.workspace_id = w.id
      LEFT JOIN users assigned ON l.assigned_to = assigned.id
      JOIN users creator ON l.created_by = creator.id
      WHERE 1=1
    `;
    const params = [];

    if (workspaceId) {
      sql += " AND l.workspace_id = ?";
      params.push(workspaceId);
    }

    if (estado) {
      sql += " AND l.estado = ?";
      params.push(estado);
    }

    if (assigned_to) {
      sql += " AND l.assigned_to = ?";
      params.push(assigned_to);
    }

    sql += " ORDER BY l.created_at DESC LIMIT 100";

    const leads = await query(sql, params);

    res.json({
      status: "SUCCESS",
      data: leads,
      count: leads.length,
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo leads",
      governed: true,
    });
  }
};

export const createLead = async (req, res) => {
  try {
    const {
      workspaceId,
      nombre,
      email,
      telefono,
      empresa,
      origen,
      valor_estimado,
    } = req.body;
    const userId = req.user.id;

    if (!nombre || !email || !workspaceId) {
      return res.status(400).json({
        status: "INVALID_REQUEST",
        message: "Nombre, email y workspace son requeridos",
        governed: true,
      });
    }

    // Calcular quality score básico
    let qualityScore = 50;
    if (telefono) qualityScore += 15;
    if (empresa) qualityScore += 15;
    if (origen) qualityScore += 10;
    if (valor_estimado > 0) qualityScore += 10;

    const result = await query(
      `INSERT INTO leads (workspace_id, nombre, email, telefono, empresa, origen, valor_estimado, quality_score, created_by, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'NUEVO')`,
      [
        workspaceId,
        nombre,
        email,
        telefono || null,
        empresa || null,
        origen || null,
        valor_estimado || 0,
        qualityScore,
        userId,
      ],
    );

    await AuditService.log({
      workspaceId,
      entityType: "lead",
      entityId: result.insertId,
      action: "created",
      decisionType: "USER",
      performedBy: userId,
      ipAddress: req.ip,
    });

    const [newLead] = await query("SELECT * FROM leads WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      status: "CREATED",
      data: newLead[0],
      governed: true,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error creando lead",
      governed: true,
    });
  }
};
