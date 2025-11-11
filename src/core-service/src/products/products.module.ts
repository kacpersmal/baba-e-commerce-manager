import { Module } from '@nestjs/common';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { PrismaModule } from '@/shared/prisma';
import { RedisModule } from '@/shared/redis';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class ProductsModule {}
