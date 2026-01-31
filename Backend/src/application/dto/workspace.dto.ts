import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkspaceState } from '@domain/workspace.domain';

export class UpdateWorkspaceStateDto {
  @IsEnum(WorkspaceState)
  state: WorkspaceState;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class WorkspaceResponseDto {
  id: string;
  userId: string;
  state: string;
  provider: string;
  lastCheckAt: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
