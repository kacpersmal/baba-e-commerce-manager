import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { WarehouseQueryDto } from './dto/warehouse-query.dto';

@Injectable()
export class WarehousesService {
  private readonly logger = new Logger(WarehousesService.name);
  private readonly CACHE_KEYS = {
    ALL_ACTIVE: 'warehouses:active',
    BY_ID: (id: string) => `warehouse:${id}`,
    BY_CODE: (code: string) => `warehouse:code:${code}`,
  };
  private readonly CACHE_TTL = {
    INDIVIDUAL: 600, // 10 minutes
    LIST: 300, // 5 minutes
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Get all warehouses with pagination and filtering
   */
  async findAll(query: WarehouseQueryDto): Promise<{
    data: WarehouseResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      limit = 20,
      city,
      country,
      search,
      isActive = true,
    } = query;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { isActive };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count and data
    const [total, warehouses] = await Promise.all([
      this.prisma.warehouse.count({ where }),
      this.prisma.warehouse.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: warehouses as WarehouseResponseDto[],
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get a warehouse by ID
   */
  async findById(id: string): Promise<WarehouseResponseDto> {
    // Try cache first
    const cacheKey = this.CACHE_KEYS.BY_ID(id);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.debug(`Warehouse ${id} retrieved from cache`);
      return JSON.parse(cached);
    }

    // Fetch from database
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id, isActive: true },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID '${id}' not found`);
    }

    // Cache the result
    await this.redis.setex(
      cacheKey,
      this.CACHE_TTL.INDIVIDUAL,
      JSON.stringify(warehouse),
    );

    this.logger.debug(`Warehouse ${id} retrieved from database and cached`);
    return warehouse as WarehouseResponseDto;
  }

  /**
   * Get a warehouse by code
   */
  async findByCode(code: string): Promise<WarehouseResponseDto> {
    // Try cache first
    const cacheKey = this.CACHE_KEYS.BY_CODE(code);
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.debug(`Warehouse ${code} retrieved from cache`);
      return JSON.parse(cached);
    }

    // Fetch from database
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { code, isActive: true },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with code '${code}' not found`);
    }

    // Cache the result
    await this.redis.setex(
      cacheKey,
      this.CACHE_TTL.INDIVIDUAL,
      JSON.stringify(warehouse),
    );

    this.logger.debug(`Warehouse ${code} retrieved from database and cached`);
    return warehouse as WarehouseResponseDto;
  }

  /**
   * Create a new warehouse (ADMIN only)
   */
  async create(dto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    // Check if code already exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Warehouse with code '${dto.code}' already exists`,
      );
    }

    // Create warehouse
    const warehouse = await this.prisma.warehouse.create({
      data: dto,
    });

    // Invalidate cache
    await this.invalidateCache();

    this.logger.log(`Warehouse ${warehouse.code} created`);
    return warehouse as WarehouseResponseDto;
  }

  /**
   * Update a warehouse (ADMIN only)
   */
  async update(
    id: string,
    dto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    // Check if warehouse exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID '${id}' not found`);
    }

    // If code is being changed, check uniqueness
    if (dto.code && dto.code !== existing.code) {
      const codeExists = await this.prisma.warehouse.findUnique({
        where: { code: dto.code },
      });

      if (codeExists) {
        throw new ConflictException(
          `Warehouse with code '${dto.code}' already exists`,
        );
      }
    }

    // Update warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: dto,
    });

    // Invalidate caches
    await this.invalidateCache(id, existing.code, dto.code);

    this.logger.log(`Warehouse ${warehouse.code} updated`);
    return warehouse as WarehouseResponseDto;
  }

  /**
   * Soft delete a warehouse (ADMIN only)
   */
  async remove(id: string): Promise<{
    message: string;
    warehouse: WarehouseResponseDto;
  }> {
    // Check if warehouse exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID '${id}' not found`);
    }

    // TODO: Check if warehouse has active stock items (future constraint)
    // if (existing.stockItems && existing.stockItems.length > 0) {
    //   throw new BadRequestException('Cannot delete warehouse with active stock items');
    // }

    // Soft delete
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: { isActive: false },
    });

    // Invalidate all caches
    await this.invalidateCache();

    this.logger.log(`Warehouse ${warehouse.code} deactivated`);
    return {
      message: 'Warehouse successfully deactivated',
      warehouse: warehouse as WarehouseResponseDto,
    };
  }

  /**
   * Reactivate a warehouse (ADMIN only)
   */
  async activate(id: string): Promise<WarehouseResponseDto> {
    // Check if warehouse exists
    const existing = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Warehouse with ID '${id}' not found`);
    }

    if (existing.isActive) {
      throw new ConflictException('Warehouse is already active');
    }

    // Activate warehouse
    const warehouse = await this.prisma.warehouse.update({
      where: { id },
      data: { isActive: true },
    });

    // Invalidate all caches
    await this.invalidateCache();

    this.logger.log(`Warehouse ${warehouse.code} activated`);
    return warehouse as WarehouseResponseDto;
  }

  /**
   * Get all warehouses including inactive ones (ADMIN only)
   */
  async findAllAdmin(query: WarehouseQueryDto): Promise<{
    data: WarehouseResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    // Use the same findAll method but without isActive filter
    const modifiedQuery = { ...query };
    delete modifiedQuery.isActive;

    const { page = 1, limit = 20, city, country, search } = modifiedQuery;
    const skip = (page - 1) * limit;

    // Build where clause (without isActive filter)
    const where: any = {};

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count and data
    const [total, warehouses] = await Promise.all([
      this.prisma.warehouse.count({ where }),
      this.prisma.warehouse.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: warehouses as WarehouseResponseDto[],
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Get warehouse statistics (ADMIN only)
   */
  async getStats(id: string): Promise<{
    warehouseId: string;
    warehouseName: string;
    usedCapacity: number;
    activeProducts: number;
    lastStockUpdate: Date | null;
  }> {
    // Check if warehouse exists
    const warehouse = await this.prisma.warehouse.findUnique({
      where: { id },
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID '${id}' not found`);
    }

    // TODO: Calculate real stats when Stock module is implemented
    return {
      warehouseId: warehouse.id,
      warehouseName: warehouse.name,
      usedCapacity: 0, // TODO: Calculate from stock items
      activeProducts: 0, // TODO: Count unique products in stock
      lastStockUpdate: null, // TODO: Get from stock items
    };
  }

  /**
   * Invalidate warehouse caches
   */
  private async invalidateCache(
    id?: string,
    oldCode?: string,
    newCode?: string,
  ): Promise<void> {
    try {
      // Clear specific caches if provided
      if (id) {
        await this.redis.del(this.CACHE_KEYS.BY_ID(id));
      }
      if (oldCode) {
        await this.redis.del(this.CACHE_KEYS.BY_CODE(oldCode));
      }
      if (newCode && newCode !== oldCode) {
        await this.redis.del(this.CACHE_KEYS.BY_CODE(newCode));
      }

      // Always clear the active warehouses cache
      await this.redis.del(this.CACHE_KEYS.ALL_ACTIVE);

      this.logger.debug('Warehouse caches invalidated');
    } catch (error) {
      this.logger.error('Failed to invalidate cache', error);
    }
  }
}
