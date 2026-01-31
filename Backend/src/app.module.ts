import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@infrastructure/http/modules/auth.module';
import { UsersModule } from '@infrastructure/http/modules/users.module';
import { OperationsModule } from '@infrastructure/http/modules/operations.module';
import { WorkspacesModule } from '@infrastructure/http/modules/workspaces.module';
import { IntegrationModule } from '@infrastructure/http/modules/integration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UsersModule,
    OperationsModule,
    WorkspacesModule,
    IntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
