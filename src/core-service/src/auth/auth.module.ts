import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { HashService } from './hash.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, HashService]
})
export class AuthModule {}
