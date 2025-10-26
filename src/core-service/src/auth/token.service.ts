import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../shared/prisma';
import { AppConfigService } from '../shared/config';
import { AuthJwtPayload, TokenPair, DecodedToken } from './dto/jwt-payload.dto';
import { Role } from '@prisma/client';

interface JwtDecodedPayload extends AuthJwtPayload {
  iat: number;
  exp: number;
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: AppConfigService,
  ) {}

  /**
   * Generate both access and refresh tokens for a user
   */
  async generateTokenPair(
    userId: string,
    email: string,
    role: Role,
    isVerified: boolean,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<TokenPair> {
    const payload: AuthJwtPayload = {
      sub: userId,
      email,
      role,
      isVerified,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    // Store refresh token in database
    await this.storeRefreshToken(userId, refreshToken, deviceInfo);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Generate access token with short expiration
   */
  private async generateAccessToken(payload: AuthJwtPayload): Promise<string> {
    const jwtConfig = this.configService.auth.jwt;

    return this.jwtService.signAsync(
      payload as any,
      {
        secret: jwtConfig.accessSecret,
        expiresIn: jwtConfig.accessExpiration,
      } as any,
    );
  }

  /**
   * Generate refresh token with long expiration
   */
  private async generateRefreshToken(payload: AuthJwtPayload): Promise<string> {
    const jwtConfig = this.configService.auth.jwt;

    return this.jwtService.signAsync(
      payload as any,
      {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshExpiration,
      } as any,
    );
  }

  /**
   * Verify and decode access token
   */
  async verifyAccessToken(token: string): Promise<DecodedToken> {
    try {
      const jwtConfig = this.configService.auth.jwt;
      const payload = await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
        secret: jwtConfig.accessSecret,
      });

      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        isVerified: payload.isVerified,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Verify and decode refresh token
   */
  async verifyRefreshToken(token: string): Promise<DecodedToken> {
    try {
      const jwtConfig = this.configService.auth.jwt;
      const payload = await this.jwtService.verifyAsync<AuthJwtPayload>(token, {
        secret: jwtConfig.refreshSecret,
      });

      // Check if token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      if (storedToken.expiresAt < new Date()) {
        // Clean up expired token
        await this.prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      return {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        isVerified: payload.isVerified,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Store refresh token in database
   */
  private async storeRefreshToken(
    userId: string,
    token: string,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<void> {
    try {
      const jwtConfig = this.configService.auth.jwt;
      const decoded = await this.jwtService.verifyAsync<JwtDecodedPayload>(
        token,
        {
          secret: jwtConfig.refreshSecret,
        },
      );

      const expiresAt = new Date(decoded.exp * 1000);

      await this.prisma.refreshToken.create({
        data: {
          token,
          userId,
          expiresAt,
          userAgent: deviceInfo?.userAgent,
          ipAddress: deviceInfo?.ipAddress,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to store refresh token');
    }
  }

  /**
   * Revoke a specific refresh token
   */
  async revokeRefreshToken(token: string): Promise<void> {
    try {
      await this.prisma.refreshToken.delete({
        where: { token },
      });
    } catch (error) {
      // Token might not exist, which is fine
      return;
    }
  }

  /**
   * Revoke all refresh tokens for a user
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  /**
   * Refresh token pair using a valid refresh token
   */
  async refreshTokenPair(refreshToken: string): Promise<TokenPair> {
    const decoded = await this.verifyRefreshToken(refreshToken);

    // Get fresh user data
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke old refresh token
    await this.revokeRefreshToken(refreshToken);

    // Generate new token pair
    return this.generateTokenPair(
      user.id,
      user.email,
      user.role,
      user.isVerified,
    );
  }

  /**
   * Clean up expired refresh tokens (can be called by a cron job)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }

  /**
   * Get all active sessions for a user
   */
  async getUserSessions(
    userId: string,
    currentRefreshToken?: string,
  ): Promise<any[]> {
    const sessions = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastUsedAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
        userAgent: true,
        ipAddress: true,
        token: true,
      },
    });

    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      userAgent: session.userAgent,
      ipAddress: session.ipAddress,
      isCurrentSession: currentRefreshToken === session.token,
    }));
  }

  /**
   * Update last used timestamp for a refresh token
   */
  async updateTokenLastUsed(token: string): Promise<void> {
    try {
      await this.prisma.refreshToken.update({
        where: { token },
        data: { lastUsedAt: new Date() },
      });
    } catch (error) {
      // Token might not exist, which is fine
      return;
    }
  }
}
