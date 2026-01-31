import { query } from "../database/connection.js";

// ============================================================================
// TASKS CONTROLLER
// ============================================================================

export const getTasks = async (req, res) => {
  try {
    const { workspaceId, estado, assigned_to, prioridad } = req.query;

    let sql = `
      SELECT 
        t.*,
        w.name as workspace_name,
        assigned.name as assigned_to_name,
        creator.name as created_by_name
      FROM tasks t
      JOIN workspaces w ON t.workspace_id = w.id
      LEFT JOIN users assigned ON t.assigned_to = assigned.id
      JOIN users creator ON t.created_by = creator.id
      WHERE 1=1
    `;
    const params = [];

    if (workspaceId) {
      sql += " AND t.workspace_id = ?";
      params.push(workspaceId);
    }

    if (estado) {
      sql += " AND t.estado = ?";
      params.push(estado);
    }

    if (assigned_to) {
      sql += " AND t.assigned_to = ?";
      params.push(assigned_to);
    }

    if (prioridad) {
      sql += " AND t.prioridad = ?";
      params.push(prioridad);
    }

    sql += " ORDER BY t.created_at DESC LIMIT 100";

    const tasks = await query(sql, params);

    res.json({
      status: "SUCCESS",
      data: tasks,
      count: tasks.length,
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo tareas",
      governed: true,
    });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      workspaceId,
      titulo,
      descripcion,
      prioridad,
      assigned_to,
      fecha_vencimiento,
      operation_id,
    } = req.body;
    const userId = req.user.id;

    if (!titulo || !workspaceId) {
      return res.status(400).json({
        status: "INVALID_REQUEST",
        message: "Título y workspace son requeridos",
        governed: true,
      });
    }

    const result = await query(
      `INSERT INTO tasks (workspace_id, operation_id, titulo, descripcion, prioridad, created_by, assigned_to, fecha_vencimiento, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'POR_HACER')`,
      [
        workspaceId,
        operation_id || null,
        titulo,
        descripcion || null,
        prioridad || "MEDIA",
        userId,
        assigned_to || null,
        fecha_vencimiento || null,
      ],
    );

    const [newTask] = await query("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      status: "CREATED",
      data: newTask[0],
      governed: true,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error creando tarea",
      governed: true,
    });
  }
};
