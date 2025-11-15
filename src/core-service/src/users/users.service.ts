import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { UserQueryDto } from './dto/user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all users with pagination and filtering (ADMIN only)
   */
  async findAll(query: UserQueryDto): Promise<{
    data: UserResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { page = 1, limit = 20, search, role, isVerified } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isVerified !== undefined) {
      where.isVerified = isVerified;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count and data
    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    // Map to response DTOs with computed fields
    const data = users.map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get a user by ID (ADMIN only)
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  /**
   * Update user information (ADMIN only)
   */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    // If email is being changed, check uniqueness
    if (dto.email && dto.email !== existing.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (emailExists) {
        throw new ConflictException(`Email '${dto.email}' is already in use`);
      }
    }

    // Update user
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User ${user.email} updated by admin`);

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  /**
   * Change user role (ADMIN only)
   */
  async changeRole(id: string, dto: ChangeRoleDto): Promise<UserResponseDto> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    // Update role
    const user = await this.prisma.user.update({
      where: { id },
      data: { role: dto.role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User ${user.email} role changed to ${dto.role} by admin`);

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  /**
   * Verify a user (ADMIN only)
   */
  async verifyUser(id: string): Promise<UserResponseDto> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    if (existing.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    // Verify user
    const user = await this.prisma.user.update({
      where: { id },
      data: { isVerified: true },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User ${user.email} verified by admin`);

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  /**
   * Unverify a user (ADMIN only)
   */
  async unverifyUser(id: string): Promise<UserResponseDto> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    if (!existing.isVerified) {
      throw new BadRequestException('User is already unverified');
    }

    // Unverify user
    const user = await this.prisma.user.update({
      where: { id },
      data: { isVerified: false },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User ${user.email} unverified by admin`);

    return {
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }

  /**
   * Delete a user (ADMIN only)
   */
  async remove(id: string): Promise<{
    message: string;
    user: UserResponseDto;
  }> {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }

    // Delete user (cascade will delete refresh tokens)
    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User ${existing.email} deleted by admin`);

    return {
      message: 'User successfully deleted',
      user: {
        ...existing,
        fullName: `${existing.firstName} ${existing.lastName}`,
      },
    };
  }

  /**
   * Get user statistics (ADMIN only)
   */
  async getStats(): Promise<{
    total: number;
    verified: number;
    unverified: number;
    admins: number;
    users: number;
  }> {
    const [total, verified, unverified, admins, users] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isVerified: true } }),
      this.prisma.user.count({ where: { isVerified: false } }),
      this.prisma.user.count({ where: { role: Role.ADMIN } }),
      this.prisma.user.count({ where: { role: Role.USER } }),
    ]);

    return {
      total,
      verified,
      unverified,
      admins,
      users,
    };
  }
}
