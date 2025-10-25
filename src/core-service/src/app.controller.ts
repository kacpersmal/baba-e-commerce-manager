import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AppConfigService } from '@shared/config';
import { PrismaService } from '@shared/prisma';
import { RedisService } from '@shared/redis';

@Controller()
@ApiTags('general')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: AppConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get welcome message' })
  @ApiResponse({ status: 200, description: 'Returns welcome message' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  @ApiOperation({ summary: 'Get application configuration' })
  @ApiResponse({
    status: 200,
    description: 'Returns configuration (passwords masked)',
  })
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
  @ApiTags('database')
  @ApiOperation({ summary: 'Get all HelloWorld records' })
  @ApiResponse({ status: 200, description: 'Returns all records' })
  async getHelloWorlds() {
    return this.prisma.helloWorld.findMany();
  }

  @Post('hello-world')
  @ApiTags('database')
  @ApiOperation({ summary: 'Create a HelloWorld record' })
  @ApiResponse({ status: 201, description: 'Record created successfully' })
  async createHelloWorld(@Body() data: { message: string }) {
    return this.prisma.helloWorld.create({
      data: {
        message: data.message,
      },
    });
  }

  @Get('cache/:key')
  @ApiTags('cache')
  @ApiOperation({ summary: 'Get cached value by key' })
  @ApiParam({ name: 'key', description: 'Cache key' })
  @ApiResponse({ status: 200, description: 'Returns cached value' })
  async getCache(@Param('key') key: string) {
    const value = await this.redis.get(key);
    return { key, value };
  }

  @Post('cache')
  @ApiTags('cache')
  @ApiOperation({ summary: 'Set cache value with optional TTL' })
  @ApiResponse({ status: 201, description: 'Cache value set successfully' })
  async setCache(@Body() data: { key: string; value: string; ttl?: number }) {
    if (data.ttl) {
      await this.redis.setex(data.key, data.ttl, data.value);
    } else {
      await this.redis.set(data.key, data.value);
    }
    return { success: true, key: data.key, value: data.value };
  }
}
