import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { ProcessPaymentDto, PaymentResponseDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @ApiOperation({ summary: 'Process payment (Mock)' })
  @ApiResponse({
    status: 200,
    description: 'Payment processed successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Payment already completed' })
  @ApiResponse({ status: 404, description: 'Order or payment not found' })
  async processPayment(
    @Body() processPaymentDto: ProcessPaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.processPayment(processPaymentDto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payment by order ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns payment details',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }
}
