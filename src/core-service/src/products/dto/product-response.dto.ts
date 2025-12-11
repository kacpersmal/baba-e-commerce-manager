import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  sku: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class ProductWithStockDto extends ProductResponseDto {
  @ApiProperty({ example: 150 })
  totalStock: number;

  @ApiProperty({ example: 10 })
  totalReserved: number;

  @ApiProperty({ example: 140 })
  availableStock: number;
}

export class PaginatedProductResponse {
  @ApiProperty({ type: [ProductWithStockDto] })
  data: ProductWithStockDto[];

  @ApiProperty({
    example: { total: 100, page: 1, limit: 20, totalPages: 5 },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
