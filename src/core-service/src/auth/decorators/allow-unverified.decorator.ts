import { SetMetadata } from '@nestjs/common';

/**
 * Allow Unverified decorator
 * Allows unverified users to access route
 * Bypasses VerifiedGuard
 *
 * @example
 * @AllowUnverified()
 * @Get('unverified-allowed')
 * getDataForUnverified() {}
 */
export const AllowUnverified = () => SetMetadata('allowUnverified', true);
