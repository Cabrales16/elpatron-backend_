import { Controller, Get, UseGuards, Req, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '@infrastructure/auth/role.guard';
import { AuditService } from '@application/services/audit.service';
import { N8NIntegrationService } from '@infrastructure/integrations/n8n.service';

@Controller('audit-logs')
@ApiTags('Audit Logs')
@ApiBearerAuth()
export class AuditLogsController {
  constructor(
    private auditService: AuditService,
    private n8nService: N8NIntegrationService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Get all audit logs (Admin only)' })
  async getAll() {
    return this.auditService.getAllAuditLogs();
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get audit logs for current user' })
  async getMyLogs(@Req() req: any) {
    return this.auditService.getUserAuditLogs(req.user.userId);
  }
}

@Controller('integrations')
@ApiTags('Integrations')
@ApiBearerAuth()
export class IntegrationsController {
  constructor(private n8nService: N8NIntegrationService) {}

  @Post('n8n/test')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Test n8n webhook integration (Admin only)' })
  @ApiResponse({ status: 200, description: 'Webhook test result' })
  async testN8NWebhook() {
    const result = await this.n8nService.testWebhook();
    return {
      success: result,
      message: result ? 'Webhook test successful' : 'Webhook test failed',
    };
  }
}
