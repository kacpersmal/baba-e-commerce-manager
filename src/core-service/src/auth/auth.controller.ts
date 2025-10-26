import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { TokenPair } from './dto/jwt-payload.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto, LogoutAllDto } from './dto/logout.dto';
import {
  RequestPasswordResetDto,
  VerifyPasswordResetDto,
  RequestEmailVerificationDto,
  VerifyEmailDto,
} from './dto/verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto): Promise<TokenPair> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refresh(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    return this.authService.logout(logoutDto);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Body() logoutAllDto: LogoutAllDto,
  ): Promise<{ message: string }> {
    return this.authService.logoutAll(logoutAllDto.userId);
  }

  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  async getSessions(
    @Query('userId') userId: string,
    @Query('currentRefreshToken') currentRefreshToken?: string,
  ): Promise<any[]> {
    return this.authService.getSessions(userId, currentRefreshToken);
  }

  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Query('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.revokeSession(userId, sessionId);
  }

  // Password Reset Endpoints
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string; code: string }> {
    return this.authService.requestPasswordReset(dto);
  }

  @Post('password-reset/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordReset(
    @Body() dto: VerifyPasswordResetDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyPasswordReset(dto);
  }

  // Email Verification Endpoints
  @Post('email-verification/request')
  @HttpCode(HttpStatus.OK)
  async requestEmailVerification(
    @Body() dto: RequestEmailVerificationDto,
  ): Promise<{ message: string; code: string }> {
    return this.authService.requestEmailVerification(dto);
  }

  @Post('email-verification/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<TokenPair> {
    return this.authService.verifyEmail(dto);
  }
}
