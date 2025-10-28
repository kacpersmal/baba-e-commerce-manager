import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Verified Guard
 * Ensures user has verified their email
 * Can be bypassed with @AllowUnverified() decorator
 * Automatically allows public routes
 */
@Injectable()
export class VerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check if route is public - skip verification check
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const allowUnverified = this.reflector.getAllAndOverride<boolean>(
      'allowUnverified',
      [context.getHandler(), context.getClass()],
    );

    if (allowUnverified) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    if (!user.isVerified) {
      throw new ForbiddenException(
        'Email verification required to access this resource',
      );
    }

    return true;
  }
}
