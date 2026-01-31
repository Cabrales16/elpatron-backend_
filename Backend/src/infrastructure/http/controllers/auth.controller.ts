import { Controller, Post, Body, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from '@application/dto/user.dto';
import { IUserRepository } from '@domain/user.domain';
import { AuthService } from '@application/services/auth.service';
import { AuditService } from '@application/services/audit.service';
import { AuditAction, AuditEntity } from '@domain/audit.domain';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private userRepository: IUserRepository,
    private authService: AuthService,
    private auditService: AuditService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Admin only for now)' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      const existingUser = await this.userRepository.findByEmail(registerDto.email);
      if (existingUser) {
        throw new BadRequestException('Email already registered');
      }

      const hashedPassword = await this.authService.hashPassword(registerDto.password);

      const user = await this.userRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: 'OPERATOR', // Default role
      });

      const token = await this.authService.generateToken(user.id, user.email, user.role);

      return {
        message: 'User registered successfully',
        user,
        token,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUserPassword(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = await this.authService.generateToken(user.id, user.email, user.role);

    // Log the login action
    await this.auditService.logAction(user.id, AuditAction.LOGIN, AuditEntity.AUTH, user.id, {
      email: user.email,
    });

    return {
      message: 'Login successful',
      user,
      token,
    };
  }
}
