import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IUserRepository, IUser, UserRole } from '@domain/user.domain';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(
    data: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> & { password: string }
  ): Promise<IUser> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role as UserRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<IUser>;
  }

  async findById(id: string): Promise<IUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<IUser | null>;
  }

  async findByEmail(email: string): Promise<(IUser & { password: string }) | null> {
    return this.prisma.user.findUnique({
      where: { email },
    }) as Promise<(IUser & { password: string }) | null>;
  }

  async findAll(): Promise<IUser[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<IUser[]>;
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser> {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as Promise<IUser>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
