import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { RedisModule } from '../shared/redis/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
