import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);
  private readonly CACHE_KEY = 'categories:all';
  private readonly CACHE_TTL = 180; // 3 minutes in seconds

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Get all categories with hierarchy
   * Cached for 3 minutes
   */
  async findAll(): Promise<CategoryResponseDto[]> {
    // Try to get from cache
    const cached = await this.redis.get(this.CACHE_KEY);
    if (cached) {
      this.logger.debug('Categories retrieved from cache');
      return JSON.parse(cached);
    }

    // Fetch from database
    const categories = await this.prisma.category.findMany({
      orderBy: { order: 'asc' },
    });

    // Build hierarchy
    const hierarchy = this.buildHierarchy(categories);

    // Cache the result
    await this.redis.setex(
      this.CACHE_KEY,
      this.CACHE_TTL,
      JSON.stringify(hierarchy),
    );

    this.logger.debug('Categories retrieved from database and cached');
    return hierarchy;
  }

  /**
   * Get a single category by ID
   */
  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category as CategoryResponseDto;
  }

  /**
   * Get a category by slug
   */
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return category as CategoryResponseDto;
  }

  /**
   * Create a new category (Admin only)
   */
  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Check if slug already exists
    const existing = await this.prisma.category.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException(
        `Category with slug ${dto.slug} already exists`,
      );
    }

    // Validate parent exists if provided
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${dto.parentId} not found`,
        );
      }
    }

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        icon: dto.icon,
        color: dto.color,
        order: dto.order ?? 0,
        parentId: dto.parentId,
      },
      include: {
        children: true,
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    this.logger.log(`Category created: ${category.name} (${category.id})`);
    return category as CategoryResponseDto;
  }

  /**
   * Update a category (Admin only)
   */
  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Check if category exists
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check slug uniqueness if changed
    if (dto.slug && dto.slug !== existing.slug) {
      const slugExists = await this.prisma.category.findUnique({
        where: { slug: dto.slug },
      });

      if (slugExists) {
        throw new ConflictException(
          `Category with slug ${dto.slug} already exists`,
        );
      }
    }

    // Validate parent exists if provided
    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });

      if (!parent) {
        throw new NotFoundException(
          `Parent category with ID ${dto.parentId} not found`,
        );
      }

      // Prevent circular reference
      if (dto.parentId === id) {
        throw new ConflictException('Category cannot be its own parent');
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
      include: {
        children: true,
      },
    });

    // Invalidate cache
    await this.invalidateCache();

    this.logger.log(`Category updated: ${category.name} (${category.id})`);
    return category as CategoryResponseDto;
  }

  /**
   * Delete a category (Admin only)
   */
  async remove(id: string): Promise<void> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check if category has children
    if (category.children.length > 0) {
      throw new ConflictException(
        'Cannot delete category with subcategories. Delete subcategories first.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    // Invalidate cache
    await this.invalidateCache();

    this.logger.log(`Category deleted: ${category.name} (${id})`);
  }

  /**
   * Build hierarchical structure from flat array
   */
  private buildHierarchy(
    categories: any[],
    parentId: string | null = null,
  ): CategoryResponseDto[] {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        ...cat,
        children: this.buildHierarchy(categories, cat.id),
      }));
  }

  /**
   * Invalidate categories cache
   */
  private async invalidateCache(): Promise<void> {
    await this.redis.del(this.CACHE_KEY);
    this.logger.debug('Categories cache invalidated');
  }
}
