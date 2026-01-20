import { ShoppingCart, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'
import { useCartStore } from '@/lib/stores/cart-store'
import { useState } from 'react'

export interface ProductCardProps {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  sku: string
  imageUrl?: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string;
  totalStock: number;
  totalReserved: number;
  availableStock: number
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  availableStock,
}: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(id, 1)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400">
            No Image
          </div>
        )}
        {availableStock <= 0 && (
          <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
            Brak w magazynie
          </Badge>
        )}
      </div>
      <CardHeader className="space-y-2 pb-3">
        <CardTitle className="line-clamp-2 text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{price.toFixed(2)} zł</span>
        </div>
        <Button
          className="mt-auto w-full cursor-pointer"
          variant="outline"
          disabled={availableStock <= 0 || isAdding}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
          )}
          {availableStock > 0 ? 'Dodaj do koszyka' : 'Niedostępny'}
        </Button>
      </CardContent>
    </Card>
  )
}
