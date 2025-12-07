import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
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
import { CartService } from './cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartResponseDto,
} from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/decorators/current-user.decorator';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({
    status: 200,
    description: 'Returns user cart with items',
    type: CartResponseDto,
  })
  async getCart(
    @CurrentUser() user: CurrentUserType,
  ): Promise<CartResponseDto> {
    return this.cartService.getCart(user.userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({
    status: 200,
    description: 'Item added to cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or insufficient stock',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async addToCart(
    @CurrentUser() user: CurrentUserType,
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(user.userId, addToCartDto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async updateCartItem(
    @CurrentUser() user: CurrentUserType,
    @Param('productId') productId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateCartItem(
      user.userId,
      productId,
      updateCartItemDto,
    );
  }

  @Delete('items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart successfully',
    type: CartResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(
    @CurrentUser() user: CurrentUserType,
    @Param('productId') productId: string,
  ): Promise<CartResponseDto> {
    return this.cartService.removeFromCart(user.userId, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 204, description: 'Cart cleared successfully' })
  async clearCart(@CurrentUser() user: CurrentUserType): Promise<void> {
    return this.cartService.clearCart(user.userId);
  }
}
