import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateStockDto {
  @ApiProperty({ example: 'cm1product123' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'cm1warehouse123' })
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class UpdateStockDto {
  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(0)
  quantity: number;
}

export class AdjustStockDto {
  @ApiProperty({
    example: 10,
    description: 'Amount to add (positive) or subtract (negative)',
  })
  @IsInt()
  adjustment: number;
}

export class StockResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  warehouseId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  reserved: number;

  @ApiProperty()
  available: number;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductStockSummaryDto {
  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  totalQuantity: number;

  @ApiProperty()
  totalReserved: number;

  @ApiProperty()
  totalAvailable: number;

  @ApiProperty({ type: [StockResponseDto] })
  stockByWarehouse: StockResponseDto[];
}
