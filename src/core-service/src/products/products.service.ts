import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ProductWithStockDto,
  PaginatedProductResponse,
  ProductResponseDto,
} from './dto/product-response.dto';
import {
  CreateStockDto,
  UpdateStockDto,
  AdjustStockDto,
  StockResponseDto,
  ProductStockSummaryDto,
} from './dto/stock.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly CACHE_KEYS = {
    ALL: 'products:all',
    BY_ID: (id: string) => `product:${id}`,
    STOCK: (productId: string) => `product:stock:${productId}`,
  };
  private readonly CACHE_TTL = {
    INDIVIDUAL: 600, // 10 minutes
    LIST: 300, // 5 minutes
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async findAll(query: QueryProductDto): Promise<PaginatedProductResponse> {
    const { page = 1, limit = 20, search, categoryId, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          stockItems: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const productsWithStock: ProductWithStockDto[] = products.map((product) => {
      const totalStock = product.stockItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalReserved = product.stockItems.reduce(
        (sum, item) => sum + item.reserved,
        0,
      );
      const availableStock = totalStock - totalReserved;

      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description ?? undefined,
        price: Number(product.price),
        sku: product.sku,
        imageUrl: product.imageUrl ?? undefined,
        categoryId: product.categoryId,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        totalStock,
        totalReserved,
        availableStock,
      };
    });

    return {
      data: productsWithStock,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<ProductResponseDto> {
    const cacheKey = this.CACHE_KEYS.BY_ID(id);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const response: ProductResponseDto = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: Number(product.price),
      sku: product.sku,
      imageUrl: product.imageUrl ?? undefined,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    await this.redis.setex(
      cacheKey,
      this.CACHE_TTL.INDIVIDUAL,
      JSON.stringify(response),
    );

    return response;
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: Number(product.price),
      sku: product.sku,
      imageUrl: product.imageUrl ?? undefined,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }

    // Check for duplicate slug
    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Product with slug ${createProductDto.slug} already exists`,
      );
    }

    // Check for duplicate SKU
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException(
        `Product with SKU ${createProductDto.sku} already exists`,
      );
    }

    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    await this.invalidateCache();

    this.logger.log(`Created product: ${product.id} - ${product.name}`);

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? undefined,
      price: Number(product.price),
      sku: product.sku,
      imageUrl: product.imageUrl ?? undefined,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new BadRequestException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
    }

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingSlug = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException(
          `Product with slug ${updateProductDto.slug} already exists`,
        );
      }
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });

    await this.invalidateCache(id);

    this.logger.log(`Updated product: ${id}`);

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description ?? undefined,
      price: Number(updated.price),
      sku: updated.sku,
      imageUrl: updated.imageUrl ?? undefined,
      categoryId: updated.categoryId,
      isActive: updated.isActive,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });

    await this.invalidateCache(id);

    this.logger.log(`Deleted product: ${id}`);
  }

  // Stock Management Methods

  async getProductStock(productId: string): Promise<ProductStockSummaryDto> {
    const cacheKey = this.CACHE_KEYS.STOCK(productId);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        stockItems: {
          include: {
            warehouse: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const totalQuantity = product.stockItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalReserved = product.stockItems.reduce(
      (sum, item) => sum + item.reserved,
      0,
    );
    const totalAvailable = totalQuantity - totalReserved;

    const stockByWarehouse: StockResponseDto[] = product.stockItems.map(
      (item) => ({
        id: item.id,
        productId: item.productId,
        warehouseId: item.warehouseId,
        quantity: item.quantity,
        reserved: item.reserved,
        available: item.quantity - item.reserved,
        updatedAt: item.updatedAt,
      }),
    );

    const summary: ProductStockSummaryDto = {
      productId: product.id,
      productName: product.name,
      totalQuantity,
      totalReserved,
      totalAvailable,
      stockByWarehouse,
    };

    await this.redis.setex(
      cacheKey,
      this.CACHE_TTL.INDIVIDUAL,
      JSON.stringify(summary),
    );

    return summary;
  }

  async createStock(createStockDto: CreateStockDto): Promise<StockResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: createStockDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${createStockDto.productId} not found`,
      );
    }

    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id: createStockDto.warehouseId },
    });

    if (!warehouse) {
      throw new NotFoundException(
        `Warehouse with ID ${createStockDto.warehouseId} not found`,
      );
    }

    const existingStock = await this.prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: createStockDto.productId,
          warehouseId: createStockDto.warehouseId,
        },
      },
    });

    if (existingStock) {
      throw new ConflictException(
        `Stock already exists for this product in this warehouse`,
      );
    }

    const stock = await this.prisma.stock.create({
      data: createStockDto,
    });

    await this.redis.del(this.CACHE_KEYS.STOCK(createStockDto.productId));
    await this.redis.del(this.CACHE_KEYS.ALL);

    this.logger.log(
      `Created stock: ${stock.id} for product ${createStockDto.productId}`,
    );

    return {
      id: stock.id,
      productId: stock.productId,
      warehouseId: stock.warehouseId,
      quantity: stock.quantity,
      reserved: stock.reserved,
      available: stock.quantity - stock.reserved,
      updatedAt: stock.updatedAt,
    };
  }

  async updateStock(
    productId: string,
    warehouseId: string,
    updateStockDto: UpdateStockDto,
  ): Promise<StockResponseDto> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock not found for product ${productId} in warehouse ${warehouseId}`,
      );
    }

    const updated = await this.prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: { quantity: updateStockDto.quantity },
    });

    await this.redis.del(this.CACHE_KEYS.STOCK(productId));
    await this.redis.del(this.CACHE_KEYS.ALL);

    this.logger.log(`Updated stock: ${updated.id}`);

    return {
      id: updated.id,
      productId: updated.productId,
      warehouseId: updated.warehouseId,
      quantity: updated.quantity,
      reserved: updated.reserved,
      available: updated.quantity - updated.reserved,
      updatedAt: updated.updatedAt,
    };
  }

  async adjustStock(
    productId: string,
    warehouseId: string,
    adjustStockDto: AdjustStockDto,
  ): Promise<StockResponseDto> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock not found for product ${productId} in warehouse ${warehouseId}`,
      );
    }

    const newQuantity = stock.quantity + adjustStockDto.adjustment;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Adjustment would result in negative stock quantity`,
      );
    }

    const updated = await this.prisma.stock.update({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
      data: { quantity: newQuantity },
    });

    await this.redis.del(this.CACHE_KEYS.STOCK(productId));
    await this.redis.del(this.CACHE_KEYS.ALL);

    this.logger.log(
      `Adjusted stock: ${updated.id} by ${adjustStockDto.adjustment}`,
    );

    return {
      id: updated.id,
      productId: updated.productId,
      warehouseId: updated.warehouseId,
      quantity: updated.quantity,
      reserved: updated.reserved,
      available: updated.quantity - updated.reserved,
      updatedAt: updated.updatedAt,
    };
  }

  async deleteStock(productId: string, warehouseId: string): Promise<void> {
    const stock = await this.prisma.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    if (!stock) {
      throw new NotFoundException(
        `Stock not found for product ${productId} in warehouse ${warehouseId}`,
      );
    }

    await this.prisma.stock.delete({
      where: {
        productId_warehouseId: {
          productId,
          warehouseId,
        },
      },
    });

    await this.redis.del(this.CACHE_KEYS.STOCK(productId));
    await this.redis.del(this.CACHE_KEYS.ALL);

    this.logger.log(`Deleted stock: ${stock.id}`);
  }

  private async invalidateCache(id?: string): Promise<void> {
    await this.redis.del(this.CACHE_KEYS.ALL);
    if (id) {
      await this.redis.del(this.CACHE_KEYS.BY_ID(id));
      await this.redis.del(this.CACHE_KEYS.STOCK(id));
    }
  }
}
