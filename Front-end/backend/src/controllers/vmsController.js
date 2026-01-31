import { query } from "../database/connection.js";

// ============================================================================
// VIRTUAL MACHINES CONTROLLER
// ============================================================================

export const getVirtualMachines = async (req, res) => {
  try {
    const { workspaceId, estado, cliente } = req.query;

    let sql = `
      SELECT 
        vm.*,
        w.name as workspace_name,
        creator.name as created_by_name
      FROM virtual_machines vm
      JOIN workspaces w ON vm.workspace_id = w.id
      JOIN users creator ON vm.created_by = creator.id
      WHERE 1=1
    `;
    const params = [];

    if (workspaceId) {
      sql += " AND vm.workspace_id = ?";
      params.push(workspaceId);
    }

    if (estado) {
      sql += " AND vm.estado = ?";
      params.push(estado);
    }

    if (cliente) {
      sql += " AND vm.cliente LIKE ?";
      params.push(`%${cliente}%`);
    }

    sql += " ORDER BY vm.created_at DESC LIMIT 100";

    const vms = await query(sql, params);

    res.json({
      status: "SUCCESS",
      data: vms,
      count: vms.length,
      governed: true,
    });
  } catch (error) {
    console.error("Error fetching VMs:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error obteniendo máquinas virtuales",
      governed: true,
    });
  }
};

export const createVirtualMachine = async (req, res) => {
  try {
    const {
      workspaceId,
      nombre,
      cliente,
      sistema_operativo,
      cpu_vcpus,
      ram_gb,
      disco_gb,
      tipo_disco,
    } = req.body;
    const userId = req.user.id;

    if (!nombre || !workspaceId) {
      return res.status(400).json({
        status: "INVALID_REQUEST",
        message: "Nombre y workspace son requeridos",
        governed: true,
      });
    }

    const result = await query(
      `INSERT INTO virtual_machines (workspace_id, nombre, cliente, sistema_operativo, estado, cpu_vcpus, ram_gb, disco_gb, tipo_disco, created_by)
       VALUES (?, ?, ?, ?, 'PROVISIONANDO', ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        nombre,
        cliente || null,
        sistema_operativo || "Ubuntu Server 22.04 LTS",
        cpu_vcpus || 2,
        ram_gb || 4,
        disco_gb || 50,
        tipo_disco || "SSD",
        userId,
      ],
    );

    const [newVM] = await query("SELECT * FROM virtual_machines WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      status: "CREATED",
      data: newVM[0],
      governance: {
        type: "APPROVED",
        message:
          "VM en proceso de provisionamiento bajo supervisión del sistema",
      },
      governed: true,
    });
  } catch (error) {
    console.error("Error creating VM:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Error creando máquina virtual",
      governed: true,
    });
  }
};
