import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { WarehouseQueryDto } from './dto/warehouse-query.dto';
import { Public } from '@/auth/decorators/public.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@ApiTags('Warehouses')
@Controller('warehouses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active warehouses with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of warehouses',
  })
  async findAll(@Query() query: WarehouseQueryDto) {
    return this.warehousesService.findAll(query);
  }

  @Public()
  @Get('code/:code')
  @ApiOperation({ summary: 'Get warehouse by code' })
  @ApiParam({ name: 'code', description: 'Warehouse code' })
  @ApiResponse({
    status: 200,
    description: 'Returns the warehouse',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async findByCode(@Param('code') code: string): Promise<WarehouseResponseDto> {
    return this.warehousesService.findByCode(code);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the warehouse',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  async findById(@Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehousesService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new warehouse (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Warehouse code already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() dto: CreateWarehouseDto): Promise<WarehouseResponseDto> {
    return this.warehousesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a warehouse (Admin only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse updated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({ status: 409, description: 'Code conflict' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateWarehouseDto,
  ): Promise<WarehouseResponseDto> {
    return this.warehousesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Soft delete a warehouse (Admin only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse deactivated successfully',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({
    status: 400,
    description: 'Warehouse has active stock items',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }

  @Post(':id/activate')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reactivate a deactivated warehouse (Admin only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse activated successfully',
    type: WarehouseResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({ status: 400, description: 'Warehouse is already active' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async activate(@Param('id') id: string): Promise<WarehouseResponseDto> {
    return this.warehousesService.activate(id);
  }

  @Get('admin/all')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all warehouses including inactive ones (Admin only)',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'city', required: false, type: String })
  @ApiQuery({ name: 'country', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of all warehouses',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async findAllAdmin(@Query() query: WarehouseQueryDto) {
    return this.warehousesService.findAllAdmin(query);
  }

  @Get(':id/stats')
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get warehouse statistics (Admin only)' })
  @ApiParam({ name: 'id', description: 'Warehouse ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns warehouse statistics',
  })
  @ApiResponse({ status: 404, description: 'Warehouse not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async getStats(@Param('id') id: string) {
    return this.warehousesService.getStats(id);
  }
}
