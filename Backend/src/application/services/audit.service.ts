import { Injectable } from '@nestjs/common';
import { IAuditLogRepository, AuditAction, AuditEntity } from '@domain/audit.domain';

@Injectable()
export class AuditService {
  constructor(private auditRepository: IAuditLogRepository) {}

  async logAction(
    actorUserId: string,
    action: AuditAction,
    entity: AuditEntity,
    entityId: string,
    metadata?: Record<string, any>
  ) {
    return this.auditRepository.create({
      actorUserId,
      action,
      entity,
      entityId,
      metadata,
    });
  }

  async getUserAuditLogs(userId: string) {
    return this.auditRepository.findByUserId(userId);
  }

  async getAllAuditLogs() {
    return this.auditRepository.findAll();
  }

  async getEntityAuditLogs(entity: AuditEntity, entityId: string) {
    return this.auditRepository.findByEntity(entity, entityId);
  }
}
