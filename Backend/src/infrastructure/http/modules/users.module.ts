import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UsersController } from '../controllers/users.controller';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { AuditLogRepository } from '@infrastructure/database/repositories/audit.repository';
import { AuthService } from '@application/services/auth.service';
import { AuditService } from '@application/services/audit.service';
import { IUserRepository } from '@domain/user.domain';
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
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaClient',
      useValue: new PrismaClient(),
    },
    {
      provide: IUserRepository,
      useFactory: (prisma) => new UserRepository(prisma),
      inject: ['PrismaClient'],
    },
    {
      provide: IAuditLogRepository,
      useFactory: (prisma) => new AuditLogRepository(prisma),
      inject: ['PrismaClient'],
    },
  ],
})
export class UsersModule {}
