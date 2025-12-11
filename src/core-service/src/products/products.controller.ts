import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ProductResponseDto,
  PaginatedProductResponse,
} from './dto/product-response.dto';
import {
  CreateStockDto,
  UpdateStockDto,
  AdjustStockDto,
  StockResponseDto,
  ProductStockSummaryDto,
} from './dto/stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Product CRUD Endpoints

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of products',
    type: PaginatedProductResponse,
  })
  async findAll(
    @Query() query: QueryProductDto,
  ): Promise<PaginatedProductResponse> {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productsService.findOne(id);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  @ApiResponse({
    status: 200,
    description: 'Returns product details',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  @ApiResponse({
    status: 409,
    description: 'Product with slug or SKU already exists',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (Admin only)' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }

  // Stock Management Endpoints

  @Public()
  @Get(':id/stock')
  @ApiOperation({ summary: 'Get product stock summary' })
  @ApiResponse({
    status: 200,
    description: 'Returns stock information for product',
    type: ProductStockSummaryDto,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductStock(
    @Param('id') id: string,
  ): Promise<ProductStockSummaryDto> {
    return this.productsService.getProductStock(id);
  }

  @Post('stock')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create stock entry for product (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Stock created successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Product or warehouse not found' })
  @ApiResponse({ status: 409, description: 'Stock already exists' })
  async createStock(
    @Body() createStockDto: CreateStockDto,
  ): Promise<StockResponseDto> {
    return this.productsService.createStock(createStockDto);
  }

  @Patch('stock/:productId/:warehouseId')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update stock quantity (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async updateStock(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
    @Body() updateStockDto: UpdateStockDto,
  ): Promise<StockResponseDto> {
    return this.productsService.updateStock(
      productId,
      warehouseId,
      updateStockDto,
    );
  }

  @Post('stock/:productId/:warehouseId/adjust')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adjust stock quantity (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Stock adjusted successfully',
    type: StockResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid adjustment' })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async adjustStock(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
    @Body() adjustStockDto: AdjustStockDto,
  ): Promise<StockResponseDto> {
    return this.productsService.adjustStock(
      productId,
      warehouseId,
      adjustStockDto,
    );
  }

  @Delete('stock/:productId/:warehouseId')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete stock entry (Admin only)' })
  @ApiResponse({ status: 204, description: 'Stock deleted successfully' })
  @ApiResponse({ status: 404, description: 'Stock not found' })
  async deleteStock(
    @Param('productId') productId: string,
    @Param('warehouseId') warehouseId: string,
  ): Promise<void> {
    return this.productsService.deleteStock(productId, warehouseId);
  }
}
