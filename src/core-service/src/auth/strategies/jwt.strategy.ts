import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from '../../shared/config';
import type { AuthJwtPayload } from '../dto/jwt-payload.dto';

/**
 * JWT Strategy for Passport
 * Validates JWT tokens and extracts user information
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.auth.jwt.accessSecret,
    });
  }

  /**
   * Validate JWT payload and return user object
   * This will be attached to request.user
   */
  async validate(payload: AuthJwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      isVerified: payload.isVerified,
    };
  }
}
