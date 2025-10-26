import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import type { TokenPair } from './jwt-payload.dto';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsStrongPassword()
  password: string;
}

export class CreateUserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  tokenPair: TokenPair;
}
