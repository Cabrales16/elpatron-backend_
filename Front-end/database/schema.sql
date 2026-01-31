-- ============================================================================
-- EL PATRÓN - Database Schema
-- Sistema de Control Operativo Enterprise
-- ============================================================================

-- Drop existing tables
DROP TABLE IF EXISTS audit_events;
DROP TABLE IF EXISTS task_assignments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS workflow_executions;
DROP TABLE IF EXISTS workflows;
DROP TABLE IF EXISTS vm_resources;
DROP TABLE IF EXISTS virtual_machines;
DROP TABLE IF EXISTS security_events;
DROP TABLE IF EXISTS lead_activities;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS operation_history;
DROP TABLE IF EXISTS operations;
DROP TABLE IF EXISTS workspace_members;
DROP TABLE IF EXISTS workspaces;
DROP TABLE IF EXISTS users;

-- ============================================================================
-- USERS: Control de acceso y roles
-- ============================================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firebase_uid VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'OPERATOR', 'VIEWER') DEFAULT 'OPERATOR',
    status ENUM('ACTIVE', 'SUSPENDED', 'BLOCKED') DEFAULT 'ACTIVE',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_firebase_uid (firebase_uid),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- WORKSPACES: Contexto operativo
-- ============================================================================
CREATE TABLE workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    owner_id INT NOT NULL,
    status ENUM('ACTIVE', 'RESTRICTED', 'SUSPENDED') DEFAULT 'ACTIVE',
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'LOW',
    governance_mode ENUM('PERMISSIVE', 'CONTROLLED', 'RESTRICTED') DEFAULT 'CONTROLLED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner (owner_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE workspace_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('OWNER', 'ADMIN', 'MEMBER', 'VIEWER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_workspace_user (workspace_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- OPERATIONS: Unidad central de control
-- ============================================================================
CREATE TABLE operations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type ENUM('LEAD', 'INFRASTRUCTURE', 'SECURITY', 'AUTOMATION', 'CUSTOM') DEFAULT 'CUSTOM',
    status ENUM('NEW', 'VALIDATED', 'IN_PROGRESS', 'RESTRICTED', 'BLOCKED', 'COMPLETED', 'CANCELLED') DEFAULT 'NEW',
    priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    confidence_level DECIMAL(5,2) DEFAULT 100.00,
    -- Campos de gobierno
    validated_by INT NULL,
    validated_at TIMESTAMP NULL,
    validation_reason TEXT,
    blocked_by VARCHAR(255) NULL COMMENT 'Policy or Rule ID',
    blocked_reason TEXT,
    -- Tracking
    created_by INT NOT NULL,
    assigned_to INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (validated_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_type (type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE operation_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operation_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    reason TEXT,
    performed_by INT NOT NULL,
    system_decision BOOLEAN DEFAULT FALSE,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_operation (operation_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- LEADS: Gestión comercial
-- ============================================================================
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    operation_id INT NULL,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    empresa VARCHAR(255),
    estado ENUM('NUEVO', 'CONTACTADO', 'CALIFICADO', 'CONVERTIDO', 'PERDIDO') DEFAULT 'NUEVO',
    origen VARCHAR(100),
    valor_estimado DECIMAL(15,2) DEFAULT 0.00,
    -- Control de calidad
    quality_score DECIMAL(5,2) DEFAULT 0.00,
    validated BOOLEAN DEFAULT FALSE,
    validation_reason TEXT,
    -- Tracking
    assigned_to INT NULL,
    created_by INT NOT NULL,
    converted_at TIMESTAMP NULL,
    last_contact TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_estado (estado),
    INDEX idx_email (email),
    INDEX idx_assigned_to (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lead_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lead_id INT NOT NULL,
    activity_type ENUM('CALL', 'EMAIL', 'MEETING', 'NOTE', 'STATUS_CHANGE') NOT NULL,
    description TEXT,
    performed_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_lead (lead_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TASKS: Control de ejecución
-- ============================================================================
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    operation_id INT NULL,
    titulo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') DEFAULT 'MEDIA',
    estado ENUM('POR_HACER', 'EN_PROGRESO', 'EN_REVISION', 'BLOQUEADA', 'COMPLETADA', 'CANCELADA') DEFAULT 'POR_HACER',
    -- Control de riesgo
    requires_validation BOOLEAN DEFAULT FALSE,
    validated BOOLEAN DEFAULT FALSE,
    validated_by INT NULL,
    blocked_reason TEXT,
    -- Tracking
    created_by INT NOT NULL,
    assigned_to INT NULL,
    fecha_vencimiento TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (validated_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_estado (estado),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE task_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_by INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (assigned_by) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- VIRTUAL MACHINES: Infraestructura
-- ============================================================================
CREATE TABLE virtual_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    operation_id INT NULL,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    cliente VARCHAR(255),
    sistema_operativo VARCHAR(100),
    estado ENUM('ACTIVA', 'DETENIDA', 'MANTENIMIENTO', 'ERROR', 'PROVISIONANDO') DEFAULT 'PROVISIONANDO',
    -- Recursos
    cpu_vcpus INT DEFAULT 2,
    ram_gb INT DEFAULT 4,
    disco_gb INT DEFAULT 50,
    tipo_disco ENUM('SSD', 'HDD', 'NVME') DEFAULT 'SSD',
    ip_address VARCHAR(45),
    -- Seguridad y control
    security_level ENUM('STANDARD', 'ENHANCED', 'CRITICAL') DEFAULT 'STANDARD',
    auto_backup BOOLEAN DEFAULT TRUE,
    monitoring_enabled BOOLEAN DEFAULT TRUE,
    -- Tracking
    created_by INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL,
    uptime_seconds BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (operation_id) REFERENCES operations(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_estado (estado),
    INDEX idx_cliente (cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vm_resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vm_id INT NOT NULL,
    cpu_usage DECIMAL(5,2),
    ram_usage DECIMAL(5,2),
    disk_usage DECIMAL(5,2),
    network_in_mbps DECIMAL(10,2),
    network_out_mbps DECIMAL(10,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vm_id) REFERENCES virtual_machines(id) ON DELETE CASCADE,
    INDEX idx_vm (vm_id),
    INDEX idx_recorded_at (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- WORKFLOWS: Motor de automatización (N8N)
-- ============================================================================
CREATE TABLE workflows (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    n8n_workflow_id VARCHAR(255) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    estado ENUM('ACTIVO', 'PAUSADO', 'ERROR', 'DESHABILITADO') DEFAULT 'PAUSADO',
    trigger_type VARCHAR(100),
    -- Métricas
    total_executions INT DEFAULT 0,
    successful_executions INT DEFAULT 0,
    failed_executions INT DEFAULT 0,
    avg_execution_time_ms INT DEFAULT 0,
    -- Control
    requires_approval BOOLEAN DEFAULT FALSE,
    risk_level ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
    created_by INT NOT NULL,
    last_execution TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE workflow_executions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workflow_id INT NOT NULL,
    status ENUM('SUCCESS', 'FAILED', 'RUNNING', 'CANCELLED') NOT NULL,
    execution_time_ms INT,
    trigger_data JSON,
    result_summary TEXT,
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL,
    FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE,
    INDEX idx_workflow (workflow_id),
    INDEX idx_status (status),
    INDEX idx_started_at (started_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SECURITY EVENTS: Monitoreo de seguridad
-- ============================================================================
CREATE TABLE security_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    tipo ENUM('CRITICO', 'ADVERTENCIA', 'INFO', 'EXITO') NOT NULL,
    categoria ENUM('ACCESS', 'AUTHENTICATION', 'AUTHORIZATION', 'DATA', 'SYSTEM', 'NETWORK') DEFAULT 'SYSTEM',
    titulo VARCHAR(500) NOT NULL,
    descripcion TEXT,
    origen VARCHAR(255),
    ip_address VARCHAR(45),
    user_id INT NULL,
    -- Respuesta automática
    auto_blocked BOOLEAN DEFAULT FALSE,
    action_taken TEXT,
    requires_review BOOLEAN DEFAULT FALSE,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    severity_score DECIMAL(5,2) DEFAULT 0.00,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_tipo (tipo),
    INDEX idx_categoria (categoria),
    INDEX idx_timestamp (timestamp),
    INDEX idx_requires_review (requires_review)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- AUDIT EVENTS: Trazabilidad completa
-- ============================================================================
CREATE TABLE audit_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workspace_id INT NOT NULL,
    entity_type VARCHAR(100) NOT NULL COMMENT 'operation, task, lead, vm, etc',
    entity_id INT NOT NULL,
    action VARCHAR(100) NOT NULL COMMENT 'created, updated, deleted, validated, blocked',
    -- Contexto de decisión
    decision_type ENUM('USER', 'SYSTEM', 'POLICY', 'AUTOMATION') DEFAULT 'USER',
    decision_reason TEXT,
    policy_applied VARCHAR(255),
    risk_evaluated BOOLEAN DEFAULT FALSE,
    risk_score DECIMAL(5,2),
    -- Datos
    old_value JSON,
    new_value JSON,
    metadata JSON,
    -- Quién
    performed_by INT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_workspace (workspace_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_decision_type (decision_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- Views para reporting
-- ============================================================================

-- Vista: Operaciones con contexto completo
CREATE VIEW v_operations_dashboard AS
SELECT 
    o.id,
    o.title,
    o.type,
    o.status,
    o.priority,
    o.risk_score,
    o.confidence_level,
    w.name as workspace_name,
    w.governance_mode,
    creator.name as created_by_name,
    assigned.name as assigned_to_name,
    validator.name as validated_by_name,
    o.created_at,
    o.updated_at
FROM operations o
JOIN workspaces w ON o.workspace_id = w.id
JOIN users creator ON o.created_by = creator.id
LEFT JOIN users assigned ON o.assigned_to = assigned.id
LEFT JOIN users validator ON o.validated_by = validator.id;

-- Vista: Métricas de seguridad
CREATE VIEW v_security_metrics AS
SELECT 
    workspace_id,
    DATE(timestamp) as event_date,
    tipo,
    categoria,
    COUNT(*) as event_count,
    SUM(CASE WHEN auto_blocked THEN 1 ELSE 0 END) as auto_blocked_count,
    SUM(CASE WHEN requires_review THEN 1 ELSE 0 END) as pending_review_count,
    AVG(severity_score) as avg_severity
FROM security_events
GROUP BY workspace_id, DATE(timestamp), tipo, categoria;

-- Vista: Performance de workflows
CREATE VIEW v_workflow_performance AS
SELECT 
    w.id,
    w.nombre,
    w.estado,
    w.total_executions,
    w.successful_executions,
    w.failed_executions,
    ROUND((w.successful_executions / NULLIF(w.total_executions, 0)) * 100, 2) as success_rate,
    w.avg_execution_time_ms,
    w.last_execution,
    ws.name as workspace_name
FROM workflows w
JOIN workspaces ws ON w.workspace_id = ws.id;
