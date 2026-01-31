export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export enum AuditEntity {
  USER = 'USER',
  OPERATION = 'OPERATION',
  WORKSPACE = 'WORKSPACE',
  AUTH = 'AUTH',
}

export interface IAuditLog {
  id: string;
  actorUserId: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IAuditLogRepository {
  create(data: Omit<IAuditLog, 'id' | 'createdAt'>): Promise<IAuditLog>;
  findByUserId(userId: string): Promise<IAuditLog[]>;
  findAll(): Promise<IAuditLog[]>;
  findByEntity(entity: AuditEntity, entityId: string): Promise<IAuditLog[]>;
}
