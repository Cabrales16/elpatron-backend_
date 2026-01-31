import pool from "./connection.js";
import bcrypt from "bcryptjs";

// ============================================================================
// SEED DATA para El Patrón
// ============================================================================

async function seed() {
  const connection = await pool.getConnection();

  try {
    console.log("🌱 Iniciando seed de base de datos...\n");

    // ========================================================================
    // 1. USERS
    // ========================================================================
    console.log("👥 Creando usuarios...");

    const users = [
      {
        firebase_uid: "admin-001",
        email: "admin@elpatron.com",
        name: "Administrador",
        role: "ADMIN",
      },
      {
        firebase_uid: "op-001",
        email: "operator@elpatron.com",
        name: "Carlos Mendoza",
        role: "OPERATOR",
      },
      {
        firebase_uid: "op-002",
        email: "ana.garcia@elpatron.com",
        name: "Ana García",
        role: "OPERATOR",
      },
      {
        firebase_uid: "op-003",
        email: "laura.fernandez@elpatron.com",
        name: "Laura Fernández",
        role: "OPERATOR",
      },
    ];

    for (const user of users) {
      await connection.execute(
        `INSERT INTO users (firebase_uid, email, name, role, status) 
         VALUES (?, ?, ?, ?, 'ACTIVE')
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [user.firebase_uid, user.email, user.name, user.role],
      );
    }
    console.log(`✅ ${users.length} usuarios creados\n`);

    // ========================================================================
    // 2. WORKSPACES
    // ========================================================================
    console.log("🏢 Creando workspaces...");

    await connection.execute(
      `INSERT INTO workspaces (id, name, owner_id, status, risk_level, governance_mode)
       VALUES (1, 'El Patrón - Producción', 1, 'ACTIVE', 'LOW', 'CONTROLLED')
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
    );
    console.log("✅ Workspace principal creado\n");

    // Agregar miembros al workspace
    await connection.execute(
      `INSERT IGNORE INTO workspace_members (workspace_id, user_id, role) VALUES
      (1, 1, 'OWNER'),
      (1, 2, 'MEMBER'),
      (1, 3, 'MEMBER'),
      (1, 4, 'MEMBER')`,
    );

    // ========================================================================
    // 3. OPERATIONS
    // ========================================================================
    console.log("⚙️  Creando operaciones...");

    const operations = [
      {
        workspace_id: 1,
        title: "Implementar sistema de backup automático",
        description:
          "Configurar respaldos automáticos para todas las VMs críticas",
        type: "INFRASTRUCTURE",
        status: "IN_PROGRESS",
        priority: "HIGH",
        risk_score: 65.0,
        confidence_level: 85.0,
        created_by: 2,
        assigned_to: 4,
      },
      {
        workspace_id: 1,
        title: "Auditoría de seguridad mensual",
        description: "Revisión completa de logs y eventos de seguridad del mes",
        type: "SECURITY",
        status: "NEW",
        priority: "CRITICAL",
        risk_score: 85.0,
        confidence_level: 70.0,
        created_by: 1,
        assigned_to: 4,
      },
      {
        workspace_id: 1,
        title: "Onboarding cliente TechCorp",
        description: "Proceso completo de integración de nuevo cliente",
        type: "LEAD",
        status: "VALIDATED",
        priority: "MEDIUM",
        risk_score: 35.0,
        confidence_level: 95.0,
        created_by: 3,
        assigned_to: 2,
        validated_by: 1,
        validated_at: new Date(),
      },
      {
        workspace_id: 1,
        title: "Optimizar workflows de N8N",
        description: "Mejorar performance de automatizaciones existentes",
        type: "AUTOMATION",
        status: "COMPLETED",
        priority: "MEDIUM",
        risk_score: 25.0,
        confidence_level: 100.0,
        created_by: 2,
        assigned_to: 2,
        completed_at: new Date(),
      },
    ];

    for (const op of operations) {
      await connection.execute(
        `INSERT INTO operations (workspace_id, title, description, type, status, priority, risk_score, confidence_level, created_by, assigned_to, validated_by, validated_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          op.workspace_id,
          op.title,
          op.description,
          op.type,
          op.status,
          op.priority,
          op.risk_score,
          op.confidence_level,
          op.created_by,
          op.assigned_to || null,
          op.validated_by || null,
          op.validated_at || null,
          op.completed_at || null,
        ],
      );
    }
    console.log(`✅ ${operations.length} operaciones creadas\n`);

    // ========================================================================
    // 4. LEADS
    // ========================================================================
    console.log("🎯 Creando leads...");

    const leads = [
      {
        workspace_id: 1,
        nombre: "Ana García",
        email: "ana.garcia@techcorp.com",
        telefono: "+34 612 345 678",
        empresa: "TechCorp Solutions",
        estado: "CALIFICADO",
        origen: "Web",
        valor_estimado: 45000,
        quality_score: 95,
        created_by: 3,
      },
      {
        workspace_id: 1,
        nombre: "Roberto Martínez",
        email: "r.martinez@innovatech.com",
        telefono: "+34 623 456 789",
        empresa: "InnovaTech",
        estado: "CONTACTADO",
        origen: "Referido",
        valor_estimado: 32000,
        quality_score: 85,
        created_by: 2,
      },
      {
        workspace_id: 1,
        nombre: "Laura Fernández",
        email: "laura.f@dataservices.com",
        telefono: "+34 634 567 890",
        empresa: "Data Services SA",
        estado: "NUEVO",
        origen: "LinkedIn",
        valor_estimado: 58000,
        quality_score: 90,
        created_by: 3,
      },
      {
        workspace_id: 1,
        nombre: "Carlos Ruiz",
        email: "carlos.ruiz@cloudsys.com",
        telefono: "+34 645 678 901",
        empresa: "CloudSys Inc",
        estado: "CALIFICADO",
        origen: "Web",
        valor_estimado: 67000,
        quality_score: 95,
        created_by: 3,
      },
      {
        workspace_id: 1,
        nombre: "María López",
        email: "m.lopez@securenet.com",
        telefono: "+34 656 789 012",
        empresa: "SecureNet",
        estado: "NUEVO",
        origen: "Evento",
        valor_estimado: 41000,
        quality_score: 85,
        created_by: 2,
      },
    ];

    for (const lead of leads) {
      await connection.execute(
        `INSERT INTO leads (workspace_id, nombre, email, telefono, empresa, estado, origen, valor_estimado, quality_score, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lead.workspace_id,
          lead.nombre,
          lead.email,
          lead.telefono,
          lead.empresa,
          lead.estado,
          lead.origen,
          lead.valor_estimado,
          lead.quality_score,
          lead.created_by,
        ],
      );
    }
    console.log(`✅ ${leads.length} leads creados\n`);

    // ========================================================================
    // 5. TASKS
    // ========================================================================
    console.log("📋 Creando tareas...");

    const tasks = [
      {
        workspace_id: 1,
        titulo: "Configurar VM para cliente Acme Corp",
        descripcion:
          "Crear y configurar máquina virtual con especificaciones de seguridad enterprise",
        prioridad: "ALTA",
        estado: "EN_PROGRESO",
        created_by: 3,
        assigned_to: 2,
        fecha_vencimiento: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        workspace_id: 1,
        titulo: "Revisar logs de seguridad del último mes",
        descripcion:
          "Análisis completo de eventos de seguridad y accesos no autorizados",
        prioridad: "CRITICA",
        estado: "POR_HACER",
        created_by: 2,
        assigned_to: 4,
        fecha_vencimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        workspace_id: 1,
        titulo: "Actualizar documentación de workflows N8N",
        descripcion:
          "Documentar los nuevos flujos de automatización implementados",
        prioridad: "MEDIA",
        estado: "EN_REVISION",
        created_by: 2,
        assigned_to: 2,
        fecha_vencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        workspace_id: 1,
        titulo: "Seguimiento lead TechCorp Solutions",
        descripcion: "Llamada de seguimiento y envío de propuesta comercial",
        prioridad: "ALTA",
        estado: "POR_HACER",
        created_by: 2,
        assigned_to: 3,
        fecha_vencimiento: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        workspace_id: 1,
        titulo: "Optimizar backup automático de VMs",
        descripcion:
          "Mejorar el proceso de backup para reducir tiempo de ejecución",
        prioridad: "MEDIA",
        estado: "COMPLETADA",
        created_by: 2,
        assigned_to: 4,
        completed_at: new Date(),
      },
    ];

    for (const task of tasks) {
      await connection.execute(
        `INSERT INTO tasks (workspace_id, titulo, descripcion, prioridad, estado, created_by, assigned_to, fecha_vencimiento, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          task.workspace_id,
          task.titulo,
          task.descripcion,
          task.prioridad,
          task.estado,
          task.created_by,
          task.assigned_to,
          task.fecha_vencimiento || null,
          task.completed_at || null,
        ],
      );
    }
    console.log(`✅ ${tasks.length} tareas creadas\n`);

    // ========================================================================
    // 6. VIRTUAL MACHINES
    // ========================================================================
    console.log("🖥️  Creando máquinas virtuales...");

    const vms = [
      {
        workspace_id: 1,
        nombre: "vm-acme-prod-01",
        cliente: "Acme Corporation",
        sistema_operativo: "Ubuntu Server 22.04 LTS",
        estado: "ACTIVA",
        cpu_vcpus: 8,
        ram_gb: 32,
        disco_gb: 500,
        tipo_disco: "SSD",
        ip_address: "10.0.1.15",
        security_level: "ENHANCED",
        created_by: 2,
        uptime_seconds: 3888000,
      },
      {
        workspace_id: 1,
        nombre: "vm-techcorp-dev-01",
        cliente: "TechCorp Solutions",
        sistema_operativo: "Windows Server 2022",
        estado: "ACTIVA",
        cpu_vcpus: 4,
        ram_gb: 16,
        disco_gb: 250,
        tipo_disco: "SSD",
        ip_address: "10.0.1.23",
        security_level: "STANDARD",
        created_by: 2,
        uptime_seconds: 1814400,
      },
      {
        workspace_id: 1,
        nombre: "vm-dataservices-backup",
        cliente: "Data Services SA",
        sistema_operativo: "CentOS 8",
        estado: "DETENIDA",
        cpu_vcpus: 2,
        ram_gb: 8,
        disco_gb: 1000,
        tipo_disco: "HDD",
        ip_address: "10.0.1.47",
        security_level: "STANDARD",
        created_by: 4,
        uptime_seconds: 0,
      },
      {
        workspace_id: 1,
        nombre: "vm-cloudsys-staging",
        cliente: "CloudSys Inc",
        sistema_operativo: "Ubuntu Server 22.04 LTS",
        estado: "ACTIVA",
        cpu_vcpus: 16,
        ram_gb: 64,
        disco_gb: 1000,
        tipo_disco: "NVME",
        ip_address: "10.0.1.89",
        security_level: "CRITICAL",
        created_by: 2,
        uptime_seconds: 2246400,
      },
    ];

    for (const vm of vms) {
      await connection.execute(
        `INSERT INTO virtual_machines (workspace_id, nombre, cliente, sistema_operativo, estado, cpu_vcpus, ram_gb, disco_gb, tipo_disco, ip_address, security_level, created_by, uptime_seconds)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vm.workspace_id,
          vm.nombre,
          vm.cliente,
          vm.sistema_operativo,
          vm.estado,
          vm.cpu_vcpus,
          vm.ram_gb,
          vm.disco_gb,
          vm.tipo_disco,
          vm.ip_address,
          vm.security_level,
          vm.created_by,
          vm.uptime_seconds,
        ],
      );
    }
    console.log(`✅ ${vms.length} máquinas virtuales creadas\n`);

    // ========================================================================
    // 7. SECURITY EVENTS
    // ========================================================================
    console.log("🔒 Creando eventos de seguridad...");

    const securityEvents = [
      {
        workspace_id: 1,
        tipo: "CRITICO",
        categoria: "ACCESS",
        titulo: "Intento de acceso no autorizado detectado",
        descripcion:
          "Múltiples intentos fallidos de login desde IP 185.220.101.45",
        origen: "Sistema de Autenticación",
        ip_address: "185.220.101.45",
        auto_blocked: true,
        action_taken: "IP bloqueada por 24h",
        severity_score: 95.0,
      },
      {
        workspace_id: 1,
        tipo: "ADVERTENCIA",
        categoria: "SYSTEM",
        titulo: "Certificado SSL próximo a vencer",
        descripcion:
          "El certificado SSL para vm-acme-prod-01 vencerá en 15 días",
        origen: "Monitor de Certificados",
        action_taken: "Renovación programada",
        severity_score: 45.0,
      },
      {
        workspace_id: 1,
        tipo: "EXITO",
        categoria: "DATA",
        titulo: "Backup completado exitosamente",
        descripcion:
          "Backup automático de todas las VMs finalizado sin errores",
        origen: "Sistema de Backup",
        severity_score: 0.0,
      },
      {
        workspace_id: 1,
        tipo: "INFO",
        categoria: "AUTHORIZATION",
        titulo: "Nuevo usuario añadido",
        descripcion:
          "Usuario ana.garcia@empresa.com agregado con rol de Operador",
        origen: "Gestión de Usuarios",
        user_id: 3,
        severity_score: 10.0,
      },
      {
        workspace_id: 1,
        tipo: "ADVERTENCIA",
        categoria: "SYSTEM",
        titulo: "Uso de CPU elevado en VM",
        descripcion:
          "vm-techcorp-dev-01 ha superado el 85% de uso de CPU durante 30 minutos",
        origen: "Monitor de Recursos",
        severity_score: 60.0,
      },
      {
        workspace_id: 1,
        tipo: "CRITICO",
        categoria: "DATA",
        titulo: "Actividad sospechosa detectada",
        descripcion:
          "Patrón anómalo de consultas a la base de datos desde vm-cloudsys-staging",
        origen: "Sistema de Detección de Anomalías",
        requires_review: true,
        severity_score: 85.0,
      },
    ];

    for (const event of securityEvents) {
      await connection.execute(
        `INSERT INTO security_events (workspace_id, tipo, categoria, titulo, descripcion, origen, ip_address, user_id, auto_blocked, action_taken, requires_review, severity_score)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.workspace_id,
          event.tipo,
          event.categoria,
          event.titulo,
          event.descripcion,
          event.origen,
          event.ip_address || null,
          event.user_id || null,
          event.auto_blocked || false,
          event.action_taken || null,
          event.requires_review || false,
          event.severity_score,
        ],
      );
    }
    console.log(`✅ ${securityEvents.length} eventos de seguridad creados\n`);

    // ========================================================================
    // 8. WORKFLOWS
    // ========================================================================
    console.log("⚡ Creando workflows...");

    const workflows = [
      {
        workspace_id: 1,
        nombre: "Lead → Validación → VM → Notificación",
        descripcion:
          "Automatización completa del proceso de onboarding de nuevos leads",
        estado: "ACTIVO",
        total_executions: 1247,
        successful_executions: 1198,
        failed_executions: 49,
        avg_execution_time_ms: 3500,
        created_by: 2,
      },
      {
        workspace_id: 1,
        nombre: "Auditoría de Seguridad Diaria",
        descripcion:
          "Escaneo automático de logs y eventos de seguridad cada 24h",
        estado: "ACTIVO",
        total_executions: 892,
        successful_executions: 889,
        failed_executions: 3,
        avg_execution_time_ms: 8200,
        created_by: 1,
      },
      {
        workspace_id: 1,
        nombre: "Backup Automático de VMs",
        descripcion:
          "Respaldo programado de todas las máquinas virtuales activas",
        estado: "ACTIVO",
        total_executions: 456,
        successful_executions: 452,
        failed_executions: 4,
        avg_execution_time_ms: 15000,
        created_by: 4,
      },
    ];

    for (const workflow of workflows) {
      await connection.execute(
        `INSERT INTO workflows (workspace_id, nombre, descripcion, estado, total_executions, successful_executions, failed_executions, avg_execution_time_ms, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          workflow.workspace_id,
          workflow.nombre,
          workflow.descripcion,
          workflow.estado,
          workflow.total_executions,
          workflow.successful_executions,
          workflow.failed_executions,
          workflow.avg_execution_time_ms,
          workflow.created_by,
        ],
      );
    }
    console.log(`✅ ${workflows.length} workflows creados\n`);

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Seed completado exitosamente");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } catch (error) {
    console.error("❌ Error en seed:", error);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

// Ejecutar seed
seed().catch(console.error);
