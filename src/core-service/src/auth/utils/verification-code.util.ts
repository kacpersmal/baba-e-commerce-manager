import { randomBytes } from 'crypto';

/**
 * Generate a random 6-character alphanumeric code (uppercase)
 */
export function generateVerificationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(6);

  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters[bytes[i] % characters.length];
  }

  return code;
}

/**
 * Validate verification code format (6 alphanumeric characters)
 */
export function isValidVerificationCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code);
}
