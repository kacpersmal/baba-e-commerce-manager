import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProcessPaymentDto, PaymentResponseDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async processPayment(
    processPaymentDto: ProcessPaymentDto,
  ): Promise<PaymentResponseDto> {
    // Get order and payment
    const order = await this.prisma.order.findUnique({
      where: { id: processPaymentDto.orderId },
      include: { payment: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Order with ID ${processPaymentDto.orderId} not found`,
      );
    }

    if (!order.payment) {
      throw new NotFoundException('Payment record not found for this order');
    }

    if (order.payment.status === 'COMPLETED') {
      throw new BadRequestException('Payment already completed');
    }

    // Mock payment processing - always succeeds
    const transactionId = this.generateTransactionId();
    const paymentId = order.payment.id;

    // Update payment and order status in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update payment
      const payment = await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: 'COMPLETED',
          method: processPaymentDto.paymentMethod,
          transactionId,
        },
      });

      // Update order status to PAID
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      return payment;
    });

    // Emit payment completed event
    this.eventEmitter.emit('payment.completed', {
      paymentId: result.id,
      orderId: order.id,
      amount: Number(result.amount),
    });

    this.logger.log(
      `Mock payment processed for order ${order.orderNumber}: ${transactionId}`,
    );

    return {
      id: result.id,
      orderId: result.orderId,
      amount: Number(result.amount),
      status: result.status,
      method: result.method,
      transactionId: result.transactionId || '',
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async getPaymentByOrderId(orderId: string): Promise<PaymentResponseDto> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    });

    if (!payment) {
      throw new NotFoundException(`Payment not found for order ${orderId}`);
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: Number(payment.amount),
      status: payment.status,
      method: payment.method,
      transactionId: payment.transactionId || '',
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  private generateTransactionId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `MOCK-${timestamp}-${random}`.toUpperCase();
  }
}
