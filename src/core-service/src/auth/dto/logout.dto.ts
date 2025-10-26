import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class LogoutAllDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
