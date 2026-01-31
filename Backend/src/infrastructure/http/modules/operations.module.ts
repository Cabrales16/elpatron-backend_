import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { OperationsController } from '../controllers/operations.controller';
import { OperationRepository } from '@infrastructure/database/repositories/operation.repository';
import { AuditLogRepository } from '@infrastructure/database/repositories/audit.repository';
import { AuditService } from '@application/services/audit.service';
import { N8NIntegrationService } from '@infrastructure/integrations/n8n.service';
import { IOperationRepository } from '@domain/operation.domain';
import { IAuditLogRepository } from '@domain/audit.domain';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
    }),
  ],
  controllers: [OperationsController],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient(),
    },
    {
      provide: IOperationRepository,
      useFactory: (prisma) => new OperationRepository(prisma),
      inject: ['PrismaClient'],
    },
    {
      provide: IAuditLogRepository,
      useFactory: (prisma) => new AuditLogRepository(prisma),
      inject: ['PrismaClient'],
    },
    {
      provide: AuditService,
      useFactory: (auditRepo) => new AuditService(auditRepo),
      inject: [IAuditLogRepository],
    },
    N8NIntegrationService,
  ],
})
export class OperationsModule {}
