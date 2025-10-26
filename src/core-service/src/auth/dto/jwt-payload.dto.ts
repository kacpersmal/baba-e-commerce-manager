import { ApiProperty } from '@nestjs/swagger';

export interface AuthJwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
}

export class TokenPair {
  @ApiProperty()
  accessToken: string;
  @ApiProperty()
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}
