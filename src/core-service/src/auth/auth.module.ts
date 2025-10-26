import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HashService } from './hash.service';
import { VerificationService } from './verification.service';

@Module({
  imports: [
    JwtModule.register({
      global: false, // We'll use separate instances for access and refresh tokens
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, HashService, VerificationService],
  exports: [TokenService],
})
export class AuthModule {}
