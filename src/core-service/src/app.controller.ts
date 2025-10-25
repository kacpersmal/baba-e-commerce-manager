import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService } from './shared/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: AppConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    return {
      app: this.configService.app,
      database: {
        ...this.configService.database,
        password: '***', // Hide sensitive data
      },
      redis: {
        ...this.configService.redis,
        password: '***', // Hide sensitive data
      },
    };
  }
}
