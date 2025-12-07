import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { apiClient } from '@/lib/api/client'
import type { components } from '@/lib/api/schema'

type CartResponse = components['schemas']['CartResponseDto']
type CartItem = components['schemas']['CartItemResponseDto']

interface CartState {
  cart: CartResponse | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchCart: () => Promise<void>
  addToCart: (productId: string, quantity: number) => Promise<void>
  updateQuantity: (productId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  clearCart: () => Promise<void>

  // Computed
  getTotalItems: () => number
  getTotalAmount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await apiClient.GET('/cart')
          if (error) throw new Error('Failed to fetch cart')
          set({ cart: data as CartResponse, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
        }
      },

      addToCart: async (productId: string, quantity: number) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await apiClient.POST('/cart/items', {
            body: { productId, quantity },
          })
          if (error) throw new Error('Failed to add item to cart')
          set({ cart: data as CartResponse, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      updateQuantity: async (productId: string, quantity: number) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await apiClient.PATCH(
            '/cart/items/{productId}',
            {
              params: { path: { productId } },
              body: { quantity },
            },
          )
          if (error) throw new Error('Failed to update cart item')
          set({ cart: data as CartResponse, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      removeFromCart: async (productId: string) => {
        set({ isLoading: true, error: null })
        try {
          const { data, error } = await apiClient.DELETE(
            '/cart/items/{productId}',
            {
              params: { path: { productId } },
            },
          )
          if (error) throw new Error('Failed to remove item from cart')
          set({ cart: data as CartResponse, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null })
        try {
          const { error } = await apiClient.DELETE('/cart')
          if (error) throw new Error('Failed to clear cart')
          set({ cart: null, isLoading: false })
        } catch (error: any) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      getTotalItems: () => {
        const { cart } = get()
        return cart?.totalItems || 0
      },

      getTotalAmount: () => {
        const { cart } = get()
        return cart?.totalAmount || 0
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cart: state.cart }), // Only persist cart data
    },
  ),
)
