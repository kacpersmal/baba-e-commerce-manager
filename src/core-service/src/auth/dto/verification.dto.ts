import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyPasswordResetDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'ABC123',
    description: '6-character verification code',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{6}$/, {
    message: 'Code must be 6 alphanumeric characters',
  })
  code: string;

  @ApiProperty({ example: 'NewPassword123!' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class RequestEmailVerificationDto {
  @ApiProperty({ example: 'user-id' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'user-id' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'ABC123',
    description: '6-character verification code',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z0-9]{6}$/, {
    message: 'Code must be 6 alphanumeric characters',
  })
  code: string;
}
