import { Star, ShoppingCart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'
import { Button } from './button'

export interface ProductCardProps {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  image: string
  rating: number
  soldCount: number
  category: string
}

export function ProductCard({
  name,
  price,
  originalPrice,
  discount,
  image,
  rating,
  soldCount,
  category,
}: ProductCardProps) {
  return (
    <Card className="group flex h-full cursor-pointer flex-col overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <Badge className="absolute right-2 top-2 bg-destructive text-destructive-foreground">
          -{discount}%
        </Badge>
      </div>
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{category}</span>
        </div>
        <CardTitle className="line-clamp-2 text-base">{name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">
            ({soldCount} sprzedanych)
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{price.toFixed(2)} zł</span>
          <span className="text-sm text-muted-foreground line-through">
            {originalPrice.toFixed(2)} zł
          </span>
        </div>
        <Button className="mt-auto w-full cursor-pointer" variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Dodaj do koszyka
        </Button>
      </CardContent>
    </Card>
  )
}
