import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '@application/services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '@infrastructure/auth/jwt.strategy';
import { UserRepository } from '@infrastructure/database/repositories/user.repository';
import { AuditLogRepository } from '@infrastructure/database/repositories/audit.repository';
import { AuditService } from '@application/services/audit.service';
import { IUserRepository } from '@domain/user.domain';
import { IAuditLogRepository } from '@domain/audit.domain';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: process.env.JWT_EXPIRATION || '7d' },
    }),
  ],
  controllers: [AuthController],
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
    {
      provide: AuthService,
      useFactory: (userRepo, jwtService) => new AuthService(userRepo, jwtService),
      inject: [IUserRepository, JwtModule],
    },
    {
      provide: AuditService,
      useFactory: (auditRepo) => new AuditService(auditRepo),
      inject: [IAuditLogRepository],
    },
    JwtStrategy,
  ],
  exports: [AuthService, AuditService, IUserRepository, IAuditLogRepository],
})
export class AuthModule {}
