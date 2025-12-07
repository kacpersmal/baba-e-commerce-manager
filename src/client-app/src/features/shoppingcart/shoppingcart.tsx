import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useCartStore } from '@/lib/stores/cart-store'
import { Link } from '@tanstack/react-router'

export function ShoppingCartContent() {
  const {
    cart,
    isLoading,
    fetchCart,
    updateQuantity,
    removeFromCart,
    getTotalItems,
    getTotalAmount,
  } = useCartStore()

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const handleQuantityChange = (itemId: number, delta: number) => {
    const item = cart?.items.find((i) => i.id === itemId)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta)
      updateQuantity(itemId, newQuantity)
    }
  }

  const handleRemove = (itemId: number) => {
    removeFromCart(itemId)
  }

  const subtotal = getTotalAmount().toFixed(2)
  const totalItems = getTotalItems()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-orange-500/20 group"
        >
          <ShoppingCart className="h-5 w-5 text-brand-navy group-hover:text-orange-500 transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-white text-xs font-semibold shadow-md">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[400px] sm:w-[480px] top-16 h-[calc(100vh-4rem)] flex flex-col p-0"
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-lg font-semibold">Twój koszyk</SheetTitle>
          <SheetDescription>
            Sprawdź swoje produkty przed złożeniem zamówienia.
          </SheetDescription>
        </SheetHeader>

        {/* Produkty w koszyku */}
        <ScrollArea className="flex-1 px-4 py-2 max-h-[calc(91vh-14rem)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-gray-400">Ładowanie koszyka...</p>
            </div>
          ) : (
            <div className="divide-y">
              {cart && cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-4 gap-4"
                  >
                    <img
                      src={
                        item.product.imageUrl ||
                        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
                      }
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1">
                      <p className="font-medium text-gray-200">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-200">
                        {item.product.price.toFixed(2)} zł
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={isLoading}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleQuantityChange(item.id, +1)}
                          disabled={isLoading}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleRemove(item.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                  <ShoppingCart className="h-10 w-10 mb-3 opacity-70" />
                  <p className="text-sm mb-3">Twój koszyk jest pusty</p>
                  <SheetClose asChild>
                    <Link to="/products">
                      <Button variant="outline" size="sm">
                        Przeglądaj produkty
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Stopka */}
        <SheetFooter className="px-4 py-3 space-y-3 bg-brand-navy text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-200">Suma</span>
            <span className="font-semibold text-white text-lg">
              {subtotal} zł
            </span>
          </div>

          <div className="flex gap-2">
            <SheetClose asChild>
              <Link to="/orderform" className="flex-1">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Złóż zamówienie
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Button
                variant="outline"
                className="flex-1 bg-white text-brand-navy hover:bg-gray-100"
              >
                Zamknij
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
