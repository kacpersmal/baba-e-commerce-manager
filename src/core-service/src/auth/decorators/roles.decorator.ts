import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

/**
 * Roles decorator
 * Restricts route access to specific roles
 *
 * @example
 * @Roles(Role.ADMIN)
 * @Get('admin-only')
 * adminOnlyRoute() {}
 *
 * @example
 * @Roles(Role.ADMIN, Role.MODERATOR)
 * @Get('staff-only')
 * staffOnlyRoute() {}
 */
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
