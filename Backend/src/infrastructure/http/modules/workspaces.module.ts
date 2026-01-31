import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WorkspacesController } from '../controllers/workspaces.controller';
import { WorkspaceRepository } from '@infrastructure/database/repositories/workspace.repository';
import { AuditLogRepository } from '@infrastructure/database/repositories/audit.repository';
import { AuditService } from '@application/services/audit.service';
import { IWorkspaceRepository } from '@domain/workspace.domain';
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
  controllers: [WorkspacesController],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient(),
    },
    {
      provide: IWorkspaceRepository,
      useFactory: (prisma) => new WorkspaceRepository(prisma),
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
  ],
})
export class WorkspacesModule {}
