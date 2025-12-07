import { Module } from '@nestjs/common';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { PrismaModule } from '@/shared/prisma';
import { RedisModule } from '@/shared/redis';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [CategoriesController, ProductsController],
  providers: [CategoriesService, ProductsService],
  exports: [CategoriesService, ProductsService],
})
export class ProductsModule {}
