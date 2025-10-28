import { SetMetadata } from '@nestjs/common';

/**
 * Public route decorator
 * Marks route as public (bypasses JWT authentication)
 *
 * @example
 * @Public()
 * @Get('public-data')
 * getPublicData() {}
 */
export const Public = () => SetMetadata('isPublic', true);
