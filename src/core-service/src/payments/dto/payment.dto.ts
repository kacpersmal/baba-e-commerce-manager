import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class ProcessPaymentDto {
  @ApiProperty({ example: 'cm1order123' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.MOCK_CARD })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}

export class PaymentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

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

  @ApiProperty()
  updatedAt: Date;
}
