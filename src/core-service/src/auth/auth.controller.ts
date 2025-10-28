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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
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
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { CurrentUserType } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  async getMe(@CurrentUser() user: CurrentUserType) {
    return this.authService.getUserProfile(user.userId);
  }

  @Public()
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.authService.createUser(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto): Promise<TokenPair> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refresh(refreshTokenDto);
  }

  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() logoutDto: LogoutDto,
    @CurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.logout(logoutDto);
  }

  @ApiBearerAuth()
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.logoutAll(userId);
  }

  @ApiBearerAuth()
  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  async getSessions(
    @CurrentUser('userId') userId: string,
    @Query('currentRefreshToken') currentRefreshToken?: string,
  ): Promise<any[]> {
    return this.authService.getSessions(userId, currentRefreshToken);
  }

  @ApiBearerAuth()
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @CurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.revokeSession(userId, sessionId);
  }

  // Password Reset Endpoints
  @Public()
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    return this.authService.requestPasswordReset(dto);
  }

  @Public()
  @Post('password-reset/verify')
  @HttpCode(HttpStatus.OK)
  async verifyPasswordReset(
    @Body() dto: VerifyPasswordResetDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyPasswordReset(dto);
  }

  // Email Verification Endpoints
  @ApiBearerAuth()
  @Post('email-verification/request')
  @HttpCode(HttpStatus.OK)
  async requestEmailVerification(
    @CurrentUser('userId') userId: string,
  ): Promise<{ message: string }> {
    return this.authService.requestEmailVerification({ userId });
  }

  @Public()
  @Post('email-verification/verify')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<TokenPair> {
    return this.authService.verifyEmail(dto);
  }
}
