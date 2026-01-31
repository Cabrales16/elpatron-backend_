import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IOperationRepository, IOperation, OperationStatus } from '@domain/operation.domain';

@Injectable()
export class OperationRepository implements IOperationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: Omit<IOperation, 'id' | 'createdAt' | 'updatedAt'>): Promise<IOperation> {
    return this.prisma.operation.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status as OperationStatus,
        assigneeUserId: data.assigneeUserId,
      },
    }) as Promise<IOperation>;
  }

  async findById(id: string): Promise<IOperation | null> {
    return this.prisma.operation.findUnique({
      where: { id },
    }) as Promise<IOperation | null>;
  }

  async findAll(filters?: {
    status?: OperationStatus;
    assigneeUserId?: string;
  }): Promise<IOperation[]> {
    return this.prisma.operation.findMany({
      where: {
        status: filters?.status,
        assigneeUserId: filters?.assigneeUserId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<IOperation[]>;
  }

  async update(id: string, data: Partial<IOperation>): Promise<IOperation> {
    return this.prisma.operation.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status as OperationStatus,
        assigneeUserId: data.assigneeUserId,
      },
    }) as Promise<IOperation>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.operation.delete({
      where: { id },
    });
  }
}
