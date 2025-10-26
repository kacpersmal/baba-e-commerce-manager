import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, CreateUserResponseDto } from './dto/create-user.dto';
import { TokenPair } from './dto/jwt-payload.dto';
import { LoginUserDto } from './dto/login-user.dto';

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
  async login(@Body() loginDto: LoginUserDto): Promise<TokenPair> {
    return this.authService.login(loginDto);
  }
}
