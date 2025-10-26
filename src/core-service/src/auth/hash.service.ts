import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../shared/config';
import bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  constructor(private appConfigService: AppConfigService) {}

  hash(password: string): Promise<string> {
    const hashSettings = this.appConfigService.auth.bcrypt;
    password = hashSettings.salt + password;
    return bcrypt.hash(password, hashSettings.saltRounds);
  }

  compare(password: string, hashedPassword: string): Promise<boolean> {
    const hashSettings = this.appConfigService.auth.bcrypt;
    password = hashSettings.salt + password;
    return bcrypt.compare(password, hashedPassword);
  }
}
