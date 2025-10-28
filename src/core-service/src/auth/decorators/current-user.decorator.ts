import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User decorator
 * Extracts current user from request
 * User is populated by JWT strategy after authentication
 *
 * @example
 * @Get('profile')
 * getProfile(@CurrentUser() user: any) {
 *   return user;
 * }
 *
 * @example
 * @Get('my-id')
 * getMyId(@CurrentUser('userId') userId: string) {
 *   return userId;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

/**
 * Type-safe user object interface for CurrentUser decorator
 */
export interface CurrentUserType {
  userId: string;
  email: string;
  role: string;
  isVerified: boolean;
}
