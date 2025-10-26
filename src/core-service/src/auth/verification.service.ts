import { Injectable } from '@nestjs/common';
import { RedisService } from '../shared/redis';
import { generateVerificationCode } from './utils/verification-code.util';

export enum VerificationType {
  PASSWORD_RESET = 'pwd_reset',
  ACCOUNT_VERIFICATION = 'account_ver',
}

@Injectable()
export class VerificationService {
  private readonly CODE_EXPIRY_SECONDS = 600; // 10 minutes

  constructor(private readonly redisService: RedisService) {}

  /**
   * Generate and store a verification code in Redis
   */
  async generateCode(userId: string, type: VerificationType): Promise<string> {
    const code = generateVerificationCode();
    const key = this.buildRedisKey(type, userId, code);

    await this.redisService.setex(key, this.CODE_EXPIRY_SECONDS, userId);

    return code;
  }

  /**
   * Verify a code and return userId if valid
   */
  async verifyCode(
    userId: string,
    code: string,
    type: VerificationType,
  ): Promise<boolean> {
    const key = this.buildRedisKey(type, userId, code);
    const storedUserId = await this.redisService.get(key);

    return storedUserId === userId;
  }

  /**
   * Invalidate (delete) a verification code
   */
  async invalidateCode(
    userId: string,
    code: string,
    type: VerificationType,
  ): Promise<void> {
    const key = this.buildRedisKey(type, userId, code);
    await this.redisService.del(key);
  }

  /**
   * Invalidate all codes for a user and type
   */
  async invalidateAllUserCodes(
    userId: string,
    type: VerificationType,
  ): Promise<void> {
    const pattern = `${type}:${userId}:*`;
    const keys = await this.redisService.keys(pattern);

    if (keys.length > 0) {
      await this.redisService.del(...keys);
    }
  }

  /**
   * Build Redis key in format: <type>:userid:code
   */
  private buildRedisKey(
    type: VerificationType,
    userId: string,
    code: string,
  ): string {
    return `${type}:${userId}:${code}`;
  }

  /**
   * Get remaining TTL for a code (for testing/debugging)
   */
  async getCodeTTL(
    userId: string,
    code: string,
    type: VerificationType,
  ): Promise<number> {
    const key = this.buildRedisKey(type, userId, code);
    return this.redisService.ttl(key);
  }
}
