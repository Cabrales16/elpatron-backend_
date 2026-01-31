import { IsString, IsOptional, IsEnum } from 'class-validator';
import { OperationStatus } from '@domain/operation.domain';

export class CreateOperationDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  assigneeUserId: string;
}

export class UpdateOperationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assigneeUserId?: string;
}

export class UpdateOperationStatusDto {
  @IsEnum(OperationStatus)
  status: OperationStatus;
}

export class OperationResponseDto {
  id: string;
  title: string;
  description?: string;
  status: string;
  assigneeUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class OperationFilterDto {
  status?: OperationStatus;
  assigneeUserId?: string;
}
