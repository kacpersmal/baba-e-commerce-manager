import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService } from './shared/config';
import { PrismaService } from './shared/prisma';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: AppConfigService,
    private readonly prisma: PrismaService,
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

  @Get('hello-world')
  async getHelloWorlds() {
    return this.prisma.helloWorld.findMany();
  }

  @Post('hello-world')
  async createHelloWorld(@Body() data: { message: string }) {
    return this.prisma.helloWorld.create({
      data: {
        message: data.message,
      },
    });
  }
}
