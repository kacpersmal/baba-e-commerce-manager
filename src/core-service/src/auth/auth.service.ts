import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../shared/prisma';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { TokenPair } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
  ) {}

  async createUser(userData: CreateUserDto) {
    const hashedPassword = await this.hashService.hash(userData.password);
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: hashedPassword,
      },
    });
    const tokenPair = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
    );

    return { id: user.id, tokenPair };
  }

  async login(userData: LoginUserDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      userData.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.tokenService.generateTokenPair(user.id, user.email, user.role);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    return this.tokenService.refreshTokenPair(refreshTokenDto.refreshToken);
  }

  async logout(logoutDto: LogoutDto): Promise<{ message: string }> {
    await this.tokenService.revokeRefreshToken(logoutDto.refreshToken);
    return { message: 'Logged out successfully' };
  }

  async logoutAll(userId: string): Promise<{ message: string }> {
    await this.tokenService.revokeAllUserTokens(userId);
    return { message: 'Logged out from all devices successfully' };
  }

  async getSessions(
    userId: string,
    currentRefreshToken?: string,
  ): Promise<any[]> {
    return this.tokenService.getUserSessions(userId, currentRefreshToken);
  }

  async revokeSession(
    userId: string,
    sessionId: number,
  ): Promise<{ message: string }> {
    // Find the session and verify it belongs to the user
    const session = await this.prisma.refreshToken.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new UnauthorizedException(
        'Session not found or does not belong to user',
      );
    }

    await this.tokenService.revokeRefreshToken(session.token);
    return { message: 'Session revoked successfully' };
  }
}
