import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../shared/prisma/prisma.service';
import { RedisService } from '../shared/redis/redis.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartResponseDto,
  CartItemResponseDto,
} from './dto/cart.dto';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private readonly CACHE_KEYS = {
    BY_USER: (userId: string) => `cart:user:${userId}`,
  };
  private readonly CACHE_TTL = 300; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async getCart(userId: string): Promise<CartResponseDto> {
    const cacheKey = this.CACHE_KEYS.BY_USER(userId);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    let cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const response = this.formatCartResponse(cart);

    await this.redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(response));

    return response;
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    // Verify product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: addToCartDto.productId },
      include: { stockItems: true },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${addToCartDto.productId} not found`,
      );
    }

    if (!product.isActive) {
      throw new BadRequestException('Product is not available');
    }

    // Check stock availability
    const totalAvailable = product.stockItems.reduce(
      (sum, item) => sum + (item.quantity - item.reserved),
      0,
    );

    if (totalAvailable < addToCartDto.quantity) {
      throw new BadRequestException(
        `Insufficient stock. Available: ${totalAvailable}`,
      );
    }

    // Get or create cart
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    // Check if item already exists in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: addToCartDto.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + addToCartDto.quantity;

      if (totalAvailable < newQuantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${totalAvailable}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: addToCartDto.productId,
          quantity: addToCartDto.quantity,
        },
      });
    }

    await this.invalidateCache(userId);

    this.logger.log(
      `Added ${addToCartDto.quantity} of product ${addToCartDto.productId} to cart for user ${userId}`,
    );

    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    productId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    if (updateCartItemDto.quantity === 0) {
      // Remove item if quantity is 0
      await this.prisma.cartItem.delete({
        where: { id: cartItem.id },
      });
    } else {
      // Check stock availability
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { stockItems: true },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const totalAvailable = product.stockItems.reduce(
        (sum, item) => sum + (item.quantity - item.reserved),
        0,
      );

      if (totalAvailable < updateCartItemDto.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${totalAvailable}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: updateCartItemDto.quantity },
      });
    }

    await this.invalidateCache(userId);

    this.logger.log(
      `Updated cart item ${productId} for user ${userId} to quantity ${updateCartItemDto.quantity}`,
    );

    return this.getCart(userId);
  }

  async removeFromCart(
    userId: string,
    productId: string,
  ): Promise<CartResponseDto> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.prisma.cartItem.delete({
      where: { id: cartItem.id },
    });

    await this.invalidateCache(userId);

    this.logger.log(
      `Removed product ${productId} from cart for user ${userId}`,
    );

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return;
    }

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await this.invalidateCache(userId);

    this.logger.log(`Cleared cart for user ${userId}`);
  }

  private formatCartResponse(cart: any): CartResponseDto {
    const items: CartItemResponseDto[] = cart.items.map((item) => ({
      id: item.id,
      productId: item.product.id,
      productName: item.product.name,
      productPrice: Number(item.product.price),
      productImageUrl: item.product.imageUrl || '',
      quantity: item.quantity,
      subtotal: Number(item.product.price) * item.quantity,
    }));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalItems,
      totalAmount,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }

  private async invalidateCache(userId: string): Promise<void> {
    await this.redis.del(this.CACHE_KEYS.BY_USER(userId));
  }
}
