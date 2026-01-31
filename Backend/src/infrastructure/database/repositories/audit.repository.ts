import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IAuditLogRepository, IAuditLog, AuditAction, AuditEntity } from '@domain/audit.domain';

@Injectable()
export class AuditLogRepository implements IAuditLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<IAuditLog, 'id' | 'createdAt'>): Promise<IAuditLog> {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: data.actorUserId,
        action: data.action as AuditAction,
        entity: data.entity as AuditEntity,
        entityId: data.entityId,
        metadata: data.metadata,
      },
    }) as Promise<IAuditLog>;
  }

  async findByUserId(userId: string): Promise<IAuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { actorUserId: userId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<IAuditLog[]>;
  }

  async findAll(): Promise<IAuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
    }) as Promise<IAuditLog[]>;
  }

  async findByEntity(entity: AuditEntity, entityId: string): Promise<IAuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { entity: entity as AuditEntity, entityId },
      orderBy: { createdAt: 'desc' },
    }) as Promise<IAuditLog[]>;
  }
}
