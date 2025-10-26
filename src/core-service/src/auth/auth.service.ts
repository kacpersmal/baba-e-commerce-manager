import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { VerificationService, VerificationType } from './verification.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import {
  RequestPasswordResetDto,
  VerifyPasswordResetDto,
  RequestEmailVerificationDto,
  VerifyEmailDto,
} from './dto/verification.dto';
import { TokenPair } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly verificationService: VerificationService,
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
      user.isVerified,
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
    return this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      user.isVerified,
    );
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

  // Password Reset Flow
  async requestPasswordReset(
    dto: RequestPasswordResetDto,
  ): Promise<{ message: string; code: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Invalidate any existing password reset codes for this user
    await this.verificationService.invalidateAllUserCodes(
      user.id,
      VerificationType.PASSWORD_RESET,
    );

    // Generate new code
    const code = await this.verificationService.generateCode(
      user.id,
      VerificationType.PASSWORD_RESET,
    );

    // TODO: Send email with code (integrate email service later)
    return {
      message: 'Password reset code sent to email',
      code, // Remove this in production - only for development
    };
  }

  async verifyPasswordReset(
    dto: VerifyPasswordResetDto,
  ): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    // Verify code
    const isValid = await this.verificationService.verifyCode(
      user.id,
      dto.code,
      VerificationType.PASSWORD_RESET,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Update password
    const hashedPassword = await this.hashService.hash(dto.newPassword);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    // Invalidate the used code
    await this.verificationService.invalidateCode(
      user.id,
      dto.code,
      VerificationType.PASSWORD_RESET,
    );

    // Revoke all refresh tokens (logout from all devices for security)
    await this.tokenService.revokeAllUserTokens(user.id);

    return { message: 'Password reset successful' };
  }

  // Email Verification Flow
  async requestEmailVerification(
    dto: RequestEmailVerificationDto,
  ): Promise<{ message: string; code: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Invalidate any existing verification codes for this user
    await this.verificationService.invalidateAllUserCodes(
      user.id,
      VerificationType.ACCOUNT_VERIFICATION,
    );

    // Generate new code
    const code = await this.verificationService.generateCode(
      user.id,
      VerificationType.ACCOUNT_VERIFICATION,
    );

    // TODO: Send email with code (integrate email service later)
    return {
      message: 'Verification code sent to email',
      code, // Remove this in production - only for development
    };
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Verify code
    const isValid = await this.verificationService.verifyCode(
      user.id,
      dto.code,
      VerificationType.ACCOUNT_VERIFICATION,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    // Mark user as verified
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    // Invalidate the used code
    await this.verificationService.invalidateCode(
      user.id,
      dto.code,
      VerificationType.ACCOUNT_VERIFICATION,
    );

    // Generate new token pair with updated verification status
    return this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      true, // isVerified = true
    );
  }
}
