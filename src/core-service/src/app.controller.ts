import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { AppConfigService } from './shared/config';
import { PrismaService } from './shared/prisma';
import { RedisService } from './shared/redis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: AppConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
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

  @Get('cache/:key')
  async getCache(@Param('key') key: string) {
    const value = await this.redis.get(key);
    return { key, value };
  }

  @Post('cache')
  async setCache(@Body() data: { key: string; value: string; ttl?: number }) {
    if (data.ttl) {
      await this.redis.setex(data.key, data.ttl, data.value);
    } else {
      await this.redis.set(data.key, data.value);
    }
    return { success: true, key: data.key, value: data.value };
  }
}
