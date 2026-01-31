import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '@infrastructure/auth/role.guard';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@application/dto/user.dto';
import { IUserRepository } from '@domain/user.domain';
import { AuthService } from '@application/services/auth.service';
import { AuditService } from '@application/services/audit.service';
import { AuditAction, AuditEntity } from '@domain/audit.domain';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(
    private userRepository: IUserRepository,
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: any) {
    const user = await this.userRepository.findById(req.user.userId);
    return user;
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getAll() {
    return this.userRepository.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
    const hashedPassword = await this.authService.hashPassword(createUserDto.password);

    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      role: createUserDto.role === 'ADMIN' ? 'ADMIN' : 'OPERATOR',
    });

    // Log the creation
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.CREATE,
      AuditEntity.USER,
      user.id,
      {
        email: user.email,
        role: user.role,
      }
    );

    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Update user (Admin only)' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    const updatedUser = await this.userRepository.update(id, {
      ...existingUser,
      ...updateUserDto,
    });

    // Log the update
    await this.auditService.logAction(
      req.user.userId,
      AuditAction.UPDATE,
      AuditEntity.USER,
      id,
      updateUserDto
    );

    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  async delete(@Param('id') id: string, @Req() req: any) {
    await this.userRepository.delete(id);

    // Log the deletion
    await this.auditService.logAction(req.user.userId, AuditAction.DELETE, AuditEntity.USER, id);

    return { message: 'User deleted successfully' };
  }
}
