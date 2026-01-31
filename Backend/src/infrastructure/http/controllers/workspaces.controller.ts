import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '@infrastructure/auth/role.guard';
import { UpdateWorkspaceStateDto } from '@application/dto/workspace.dto';
import { IWorkspaceRepository } from '@domain/workspace.domain';
import { AuditService } from '@application/services/audit.service';
import { AuditAction, AuditEntity } from '@domain/audit.domain';

@Controller('workspaces')
@ApiTags('Workspaces')
@ApiBearerAuth()
export class WorkspacesController {
  constructor(
    private workspaceRepository: IWorkspaceRepository,
    private auditService: AuditService
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user workspace' })
  async getMyWorkspace(@Req() req: any) {
    const workspace = await this.workspaceRepository.findByUserId(req.user.userId);
    if (!workspace) {
      throw new Error('Workspace not found');
    }
    return workspace;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Get all workspaces (Admin only)' })
  async getAll() {
    return this.workspaceRepository.findAll();
  }

  @Patch(':userId/state')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Update workspace state (Admin only)' })
  @ApiResponse({ status: 200, description: 'Workspace state updated' })
  async updateState(
    @Param('userId') userId: string,
    @Body() updateStateDto: UpdateWorkspaceStateDto,
    @Req() req: any
  ) {
    const updatedWorkspace = await this.workspaceRepository.updateState(
      userId,
      updateStateDto.state
    );

    // Log the state change
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.UPDATE,
      AuditEntity.WORKSPACE,
      updatedWorkspace.id,
      {
        state: updateStateDto.state,
        notes: updateStateDto.notes,
      }
    );

    return updatedWorkspace;
  }
}
