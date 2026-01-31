import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IWorkspaceRepository, IWorkspace, WorkspaceState } from '@domain/workspace.domain';

@Injectable()
export class WorkspaceRepository implements IWorkspaceRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<IWorkspace, 'id' | 'createdAt' | 'updatedAt'>): Promise<IWorkspace> {
    return this.prisma.workspace.create({
      data: {
        userId: data.userId,
        state: data.state as WorkspaceState,
        provider: data.provider,
        lastCheckAt: data.lastCheckAt,
        notes: data.notes,
      },
    }) as Promise<IWorkspace>;
  }

  async findById(id: string): Promise<IWorkspace | null> {
    return this.prisma.workspace.findUnique({
      where: { id },
    }) as Promise<IWorkspace | null>;
  }

  async findByUserId(userId: string): Promise<IWorkspace | null> {
    return this.prisma.workspace.findUnique({
      where: { userId },
    }) as Promise<IWorkspace | null>;
  }

  async findAll(): Promise<IWorkspace[]> {
    return this.prisma.workspace.findMany({
      orderBy: { createdAt: 'desc' },
    }) as Promise<IWorkspace[]>;
  }

  async update(id: string, data: Partial<IWorkspace>): Promise<IWorkspace> {
    return this.prisma.workspace.update({
      where: { id },
      data: {
        state: data.state as WorkspaceState,
        notes: data.notes,
        lastCheckAt: data.lastCheckAt,
      },
    }) as Promise<IWorkspace>;
  }

  async updateState(userId: string, state: WorkspaceState): Promise<IWorkspace> {
    return this.prisma.workspace.update({
      where: { userId },
      data: {
        state: state as WorkspaceState,
        lastCheckAt: new Date(),
      },
    }) as Promise<IWorkspace>;
  }
}
