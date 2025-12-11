import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  CreateOrderDto,
  UpdateOrderStatusDto,
  QueryOrderDto,
  OrderResponseDto,
  PaginatedOrderResponse,
  OrderStatsDto,
  OrderItemResponseDto,
  PaymentResponseDto,
} from './dto/order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly CACHE_KEYS = {
    BY_ID: (id: string) => `order:${id}`,
    BY_USER: (userId: string) => `orders:user:${userId}`,
  };
  private readonly CACHE_TTL = 600; // 10 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createOrder(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    // Get user's cart
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                stockItems: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Validate stock availability for all items
    for (const item of cart.items) {
      const totalAvailable = item.product.stockItems.reduce(
        (sum, stock) => sum + (stock.quantity - stock.reserved),
        0,
      );

      if (totalAvailable < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${item.product.name}`,
        );
      }
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Calculate total amount
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    // Create order with items in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          shippingAddress: createOrderDto.shippingAddress,
          shippingCity: createOrderDto.shippingCity,
          shippingPostal: createOrderDto.shippingPostal,
          shippingCountry: createOrderDto.shippingCountry,
          customerEmail: createOrderDto.customerEmail,
          customerPhone: createOrderDto.customerPhone,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // Reserve stock for each item
      for (const item of cart.items) {
        const stockItems = item.product.stockItems.sort(
          (a, b) => b.quantity - b.reserved - (a.quantity - a.reserved),
        );

        let remainingQuantity = item.quantity;

        for (const stock of stockItems) {
          if (remainingQuantity <= 0) break;

          const available = stock.quantity - stock.reserved;
          const toReserve = Math.min(available, remainingQuantity);

          if (toReserve > 0) {
            await tx.stock.update({
              where: { id: stock.id },
              data: {
                reserved: stock.reserved + toReserve,
              },
            });

            remainingQuantity -= toReserve;
          }
        }
      }

      // Clear cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Create payment record
      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          amount: totalAmount,
          method: createOrderDto.paymentMethod,
          status: 'PENDING',
        },
      });

      return newOrder;
    });

    await this.invalidateCache(userId);

    // Emit order created event
    this.eventEmitter.emit('order.created', { orderId: order.id });

    this.logger.log(`Order created: ${order.orderNumber} for user ${userId}`);

    return this.formatOrderResponse(order);
  }

  async findAll(query: QueryOrderDto): Promise<PaginatedOrderResponse> {
    const { page = 1, limit = 20, status, userId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          payment: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const data = orders.map((order) => this.formatOrderResponse(order));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<OrderResponseDto> {
    const cacheKey = this.CACHE_KEYS.BY_ID(id);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const response = this.formatOrderResponse(order);

    await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(response));

    return response;
  }

  async findByOrderNumber(orderNumber: string): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with number ${orderNumber} not found`);
    }

    return this.formatOrderResponse(order);
  }

  async findUserOrders(userId: string): Promise<OrderResponseDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.formatOrderResponse(order));
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                stockItems: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // If order is being cancelled, release reserved stock
    if (
      updateOrderStatusDto.status === 'CANCELLED' &&
      order.status !== 'CANCELLED'
    ) {
      await this.releaseStock(order);
    }

    // If order is being marked as shipped/delivered, convert reserved to actual stock reduction
    if (
      (updateOrderStatusDto.status === 'SHIPPED' ||
        updateOrderStatusDto.status === 'DELIVERED') &&
      order.status === 'PROCESSING'
    ) {
      await this.fulfillOrder(order);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: updateOrderStatusDto.status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    await this.invalidateCache(order.userId, id);

    // Emit status changed event
    this.eventEmitter.emit('order.status.changed', {
      orderId: id,
      oldStatus: order.status,
      newStatus: updateOrderStatusDto.status,
    });

    this.logger.log(
      `Order ${id} status updated from ${order.status} to ${updateOrderStatusDto.status}`,
    );

    return this.formatOrderResponse(updated);
  }

  async getStats(): Promise<OrderStatsDto> {
    const [
      totalOrders,
      totalRevenueResult,
      pendingOrders,
      completedOrders,
      cancelledOrders,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        where: {
          status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
        },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      totalOrders,
      totalRevenue: Number(totalRevenueResult._sum.totalAmount || 0),
      pendingOrders,
      completedOrders,
      cancelledOrders,
    };
  }

  private async releaseStock(order: any): Promise<void> {
    for (const item of order.items) {
      const stockItems = item.product.stockItems.sort(
        (a, b) => b.reserved - a.reserved,
      );

      let remainingQuantity = item.quantity;

      for (const stock of stockItems) {
        if (remainingQuantity <= 0) break;

        const toRelease = Math.min(stock.reserved, remainingQuantity);

        if (toRelease > 0) {
          await this.prisma.stock.update({
            where: { id: stock.id },
            data: {
              reserved: stock.reserved - toRelease,
            },
          });

          remainingQuantity -= toRelease;
        }
      }
    }
  }

  private async fulfillOrder(order: any): Promise<void> {
    for (const item of order.items) {
      const stockItems = item.product.stockItems.sort(
        (a, b) => b.reserved - a.reserved,
      );

      let remainingQuantity = item.quantity;

      for (const stock of stockItems) {
        if (remainingQuantity <= 0) break;

        const toFulfill = Math.min(stock.reserved, remainingQuantity);

        if (toFulfill > 0) {
          await this.prisma.stock.update({
            where: { id: stock.id },
            data: {
              quantity: stock.quantity - toFulfill,
              reserved: stock.reserved - toFulfill,
            },
          });

          remainingQuantity -= toFulfill;
        }
      }
    }
  }

  private formatOrderResponse(order: any): OrderResponseDto {
    const items: OrderItemResponseDto[] = order.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product.name,
      quantity: item.quantity,
      priceAtOrder: Number(item.priceAtOrder),
      subtotal: Number(item.priceAtOrder) * item.quantity,
    }));

    let payment: PaymentResponseDto | undefined;
    if (order.payment) {
      payment = {
        id: order.payment.id,
        amount: Number(order.payment.amount),
        status: order.payment.status,
        method: order.payment.method,
        transactionId: order.payment.transactionId || '',
        createdAt: order.payment.createdAt,
      };
    }

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      userId: order.userId,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingPostal: order.shippingPostal,
      shippingCountry: order.shippingCountry,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items,
      payment,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Count orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');

    return `ORD-${year}${month}${day}-${sequence}`;
  }

  private async invalidateCache(
    userId: string,
    orderId?: string,
  ): Promise<void> {
    await this.redis.del(this.CACHE_KEYS.BY_USER(userId));
    if (orderId) {
      await this.redis.del(this.CACHE_KEYS.BY_ID(orderId));
    }
  }
}
