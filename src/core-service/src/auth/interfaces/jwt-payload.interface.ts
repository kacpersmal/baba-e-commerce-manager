export interface AuthJwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}
