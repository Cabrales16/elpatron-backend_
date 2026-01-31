import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard, OperatorGuard } from '@infrastructure/auth/role.guard';
import {
  CreateOperationDto,
  UpdateOperationDto,
  UpdateOperationStatusDto,
  OperationFilterDto,
} from '@application/dto/operation.dto';
import { IOperationRepository } from '@domain/operation.domain';
import { OperationStatus } from '@domain/operation.domain';
import { AuditService } from '@application/services/audit.service';
import { AuditAction, AuditEntity } from '@domain/audit.domain';
import { N8NIntegrationService, N8NEvent } from '@infrastructure/integrations/n8n.service';

@Controller('operations')
@ApiTags('Operations')
@ApiBearerAuth()
export class OperationsController {
  constructor(
    private operationRepository: IOperationRepository,
    private auditService: AuditService,
    private n8nService: N8NIntegrationService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), OperatorGuard)
  @ApiOperation({ summary: 'Get all operations with optional filters' })
  async getAll(@Query() filters: OperationFilterDto, @Req() req: any) {
    // Operators can only see their assigned operations
    if (req.user.role === 'OPERATOR') {
      return this.operationRepository.findAll({
        assigneeUserId: req.user.userId,
      });
    }

    // Admins can see all or filtered
    return this.operationRepository.findAll(filters);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), OperatorGuard)
  @ApiOperation({ summary: 'Create new operation' })
  @ApiResponse({ status: 201, description: 'Operation created successfully' })
  async create(@Body() createOperationDto: CreateOperationDto, @Req() req: any) {
    const operation = await this.operationRepository.create({
      title: createOperationDto.title,
      description: createOperationDto.description,
      status: OperationStatus.NEW,
      assigneeUserId: createOperationDto.assigneeUserId,
    });

    // Log the creation
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.CREATE,
      AuditEntity.OPERATION,
      operation.id,
      {
        title: operation.title,
        assignee: operation.assigneeUserId,
      }
    );

    // Send event to n8n
    await this.n8nService.sendEvent({
      eventType: 'OPERATION_CREATED',
      actorUserId: req.user.userId,
      operationId: operation.id,
      newStatus: operation.status,
      timestamp: new Date(),
      metadata: {
        title: operation.title,
      },
    });

    return operation;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), OperatorGuard)
  @ApiOperation({ summary: 'Get operation by ID' })
  async getById(@Param('id') id: string) {
    const operation = await this.operationRepository.findById(id);
    if (!operation) {
      throw new Error('Operation not found');
    }
    return operation;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OperatorGuard)
  @ApiOperation({ summary: 'Update operation details' })
  async update(
    @Param('id') id: string,
    @Body() updateOperationDto: UpdateOperationDto,
    @Req() req: any
  ) {
    const existingOperation = await this.operationRepository.findById(id);
    if (!existingOperation) {
      throw new Error('Operation not found');
    }

    const updatedOperation = await this.operationRepository.update(id, {
      ...existingOperation,
      ...updateOperationDto,
    });

    // Log the update
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.UPDATE,
      AuditEntity.OPERATION,
      id,
      updateOperationDto
    );

    return updatedOperation;
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), OperatorGuard)
  @ApiOperation({ summary: 'Change operation status' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOperationStatusDto,
    @Req() req: any
  ) {
    const existingOperation = await this.operationRepository.findById(id);
    if (!existingOperation) {
      throw new Error('Operation not found');
    }

    const previousStatus = existingOperation.status;
    const updatedOperation = await this.operationRepository.update(id, {
      ...existingOperation,
      status: updateStatusDto.status,
    });

    // Log the status change
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.STATUS_CHANGE,
      AuditEntity.OPERATION,
      id,
      {
        previousStatus,
        newStatus: updateStatusDto.status,
      }
    );

    // Send event to n8n
    await this.n8nService.sendEvent({
      eventType: 'OPERATION_STATUS_CHANGED',
      actorUserId: req.user.userId,
      operationId: id,
      previousStatus,
      newStatus: updateStatusDto.status,
      timestamp: new Date(),
      metadata: {
        title: existingOperation.title,
      },
    });

    return updatedOperation;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Delete operation (Admin only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.operationRepository.delete(id);

    // Log the deletion
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.DELETE,
      AuditEntity.OPERATION,
      id
    );

    return { message: 'Operation deleted successfully' };
  }
}
