import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HashService } from './hash.service';
import { VerificationService } from './verification.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: false, // We'll use separate instances for access and refresh tokens
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    HashService,
    VerificationService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  exports: [TokenService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
