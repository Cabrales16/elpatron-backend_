import { Module } from '@nestjs/common';
import { AuditLogsController, IntegrationsController } from '../controllers/audit-logs.controller';
import { N8NIntegrationService } from '@infrastructure/integrations/n8n.service';
import { AuditService } from '@application/services/audit.service';
import { IAuditLogRepository } from '@domain/audit.domain';
import { AuditLogRepository } from '@infrastructure/database/repositories/audit.repository';
import { PrismaClient } from '@prisma/client';
import { AuthModule } from './auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
    }),
  ],
  controllers: [AuditLogsController, IntegrationsController],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient(),
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
export class IntegrationModule {}
