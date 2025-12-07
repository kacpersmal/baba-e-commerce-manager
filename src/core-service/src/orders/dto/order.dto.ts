import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({ example: '123 Main St' })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({ example: 'Warsaw' })
  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @ApiProperty({ example: '00-001' })
  @IsString()
  @IsNotEmpty()
  shippingPostal: string;

  @ApiProperty({ example: 'Poland' })
  @IsString()
  @IsNotEmpty()
  shippingCountry: string;

  @ApiProperty({ example: '[email protected]' })
  @IsEmail()
  customerEmail: string;

  @ApiProperty({ example: '+48 123 456 789' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MOCK_CARD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class QueryOrderDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  userId?: string;
}

export class OrderItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  productId: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  priceAtOrder: number;

  @ApiProperty()
  subtotal: number;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'] })
  status: string;

  @ApiProperty({
    enum: ['MOCK_CARD', 'MOCK_BLIK', 'MOCK_PAYPAL', 'MOCK_TRANSFER'],
  })
  method: string;

  @ApiProperty()
  transactionId: string;

  @ApiProperty()
  createdAt: Date;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderNumber: string;

  @ApiProperty({
    enum: [
      'PENDING',
      'PAID',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ],
  })
  status: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  shippingAddress: string;

  @ApiProperty()
  shippingCity: string;

  @ApiProperty()
  shippingPostal: string;

  @ApiProperty()
  shippingCountry: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerPhone: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiPropertyOptional({ type: PaymentResponseDto })
  payment?: PaymentResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class PaginatedOrderResponse {
  @ApiProperty({ type: [OrderResponseDto] })
  data: OrderResponseDto[];

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

export class OrderStatsDto {
  @ApiProperty()
  totalOrders: number;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  pendingOrders: number;

  @ApiProperty()
  completedOrders: number;

  @ApiProperty()
  cancelledOrders: number;
}
